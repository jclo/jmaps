/* global  */
/* eslint curly: 0, max-len: [1, 140, 2] */
'use strict';

// -- Node modules
var fs = require('fs')
  ;

// -- Local modules
var _dbf = require('./dbfReader.js')
  , _shp = require('./shpReader.js')
  , _geo = require('./geo.js')
  , _svg = require('./svg.js')
  ;

// -- Local constants

// -- Local variables

/**
 * This library parses a Natural Earth's database. It returns a record or
 * the complete collection.
 *
 * @author   jclo
 * @since    0.0.1
 */

// -- Private functions


 // -- Public

/**
 * Reads Natural Earth's database and attaches db parameters to this.
 *
 * @constructor (path, db)
 * @param {String}  The path to Natural Earth's database,
 * @param {String}  Natural Earth's database name,
 * @throws          Throws an error if the database doesn't not exist or
 *                  can't be read,
 * since 0.0.1,
 */
var JMAPS = function(path, db) {

  // Test if path and db are defined.
  if (path === undefined)
    throw new Error('You need to provide a path to Natural Earth\'s database!');
  if (db === undefined)
    throw new Error('You need to provide a Natural Earth database name!');

  // Test if path and db exist.
  try {
    fs.statSync(path);
  } catch (e) {
    throw new Error('The path "' + path + '" does not exist!');
  }

  try {
    fs.statSync(path + '/' + db);
  } catch (e) {
    throw new Error('Natural Earth database "' + db + '" does not exist!');
  }

  // Test if files .shp and dbf exist.
  try {
    fs.statSync(path + '/' + db + '/' + db + '.dbf');
  } catch (e) {
    /* istanbul ignore next */
    throw new Error('Natural Earth database file "' + db + '.dbf" does not exist!');
  }

  try {
    fs.statSync(path + '/' + db + '/' + db + '.shp');
  } catch (e) {
    /* istanbul ignore next */
    throw new Error('Natural Earth database file "' + db + '.shp" does not exist!');
  }

  // Ok. The required files are here.
  // Read dbf file and attaches dbf structure to this.
  _dbf.init(this, fs.readFileSync(path + '/' + db + '/' + db + '.dbf'));
  // Read shp file and attaches shp structure to this.
  _shp.init(this, fs.readFileSync(path + '/' + db + '/' + db + '.shp'));
};


// -- Public Methods.
JMAPS.prototype = {

  /**
   * Returns the requested GeoJSON record.
   *
   * @method (recordNumber)
   * @public
   * @param {Number}    The record to return,
   * @returns {Object}  Returns Natural Earth's database GeoJSON record,
   * @throws            Throws an error if the record doesn't not exist,
   * since 0.0.1,
   */
  getFeature: function(recordNumber) {
    var shprecord
      ;

    // Is this record available?
    if (typeof recordNumber !== 'number' || recordNumber % 1 !== 0 || recordNumber <= 0 || recordNumber > this._dbf.header.numberOfRecords)
      throw new Error('Record Number "' + recordNumber + '" do not match!');

    // Retrieve the associated data from the shp db.
    shprecord = _shp.getRecord(this._shp, recordNumber);

    // Return record.
    return {
      type: 'Feature',
      properties: _dbf.getRecord(this._dbf, recordNumber),
      geometry: {
        type: shprecord.type,
        coordinates: shprecord.coordinates
      }
    };
  },

  /**
   * Returns the complete collection of records (JS GeoJSON object).
   *
   * @method ()
   * @public
   * @returns {Object}  Returns the complete collection of Natural Earth's
   *                    database records,
   * since 0.0.1,
   */
  getCollection: function() {
    var header = this._shp.header
      , dbfrecord
      , shprecord
      , collection
      , i
      ;

    dbfrecord = _dbf.getRecord(this._dbf);
    shprecord = _shp.getRecord(this._shp);

    collection = {
      bbox: [header.Xmin, header.Ymin, header.Xmax, header.Ymax],
      type: 'FeatureCollection',
      features: []
    };

    for (i = 0; i < this._dbf.header.numberOfRecords; i++) {
      collection.features[i] = {
        type: 'Feature',
        properties: dbfrecord[i],
        geometry: {
          type: shprecord[i].type,
          coordinates: shprecord[i].coordinates
        }
      };
    }

    // return a JS GeoJSON object.
    return collection;
  },

  /**
   * Returns a GeoJSON object with the requested transformations.
   *
   * @method (geojson, options)
   * @public
   * @param {Object}    A GeoJSON object,
   * @param {Object}    The transformations to apply,
   * @returns {Object}  Returns the GeoJSON object with x, y plane coordinates,
   * @throws {Object}   Throws an error if the first argument isn't a GeoJSON object,
   * since 0.0.1,
   */
  transform: function(geojson, options) {
    options = options || { scale: 1, projection: 'none', mirror: 'none' };
    var coord
      , i
      ;

    // Check that geojson is a valid GeoJSON object.
    if (Object.prototype.toString.call(geojson) !== '[object Object]')
      throw new Error('The first argument must be a GeoJSON object!');

    if (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature')
      throw new Error('The first GeoJSON object has neither property "FeatureCollection" nor property "Feature"!');

    // Check that option parameters are valid.
    if (Object.prototype.toString.call(options) !== '[object Object]')
      throw new Error('The argument "options" must be an object!');

    if (options.scale === undefined) options.scale = 1;
    if (options.projection === undefined) options.projection = 'none';
    if (options.mirror === undefined) options.mirror = 'none';

    if (typeof options.scale !== 'number' || options.scale < 1)
      throw new Error('The scale option must be a positive number greater or equal to 1!');

    if (options.projection !== 'none' && options.projection !== 'mercator')
      throw new Error('The projection option "' + options.projection + '" is not supported!');

    if (options.mirror !== 'none' && options.mirror !== 'x' && options.mirror !== 'y' && options.mirror !== 'xy')
      throw new Error('The mirroring option "' + options.mirror + '" is not supported!');

    // For a Feature.
    if (geojson.type === 'Feature') {
      coord = _geo.project(geojson.geometry.coordinates, options);
      // Replace λ and φ coordinates by x, y plane coordiantes to
      // GeoJSON object.
      geojson.geometry.coordinates = coord;
      return geojson;
    }

    // For a FeatureCollection.
    for (i = 0; i < geojson.features.length; i++)
      geojson.features[i].geometry.coordinates = _geo.project(geojson.features[i].geometry.coordinates, options);
    return geojson;
  },

  /**
   * Converts the GeoJSON object to XML SVG and writes it to the file stream.
   *
   * @method (geojson, options)
   * @public
   * @param {Object}    A writable stream,
   * @param {Object}    A GeoJSON object with x, y plane coordinates,
   * @returns {}        -,
   * @throws {Object}   Throws an error if the first argument isn't a GeoJSON object,
   * since 0.0.1,
   */
  toSVG: function(fs, json) {
    var d
      , i
      ;

    // Check that the two arguments are defined and are objects.
    if ((fs === undefined || typeof fs !== 'object') || (json === undefined || typeof json !== 'object'))
      throw new Error('This method expects two objects as arguments!');

    // Check if the file stream has the method write.
    if ('write' in fs === false)
      throw new Error('The file stream "fs" is not a file stream or is not writable!');

    // Check that geojson is a valid GeoJSON object.
    if (json.type !== 'FeatureCollection' && json.type !== 'Feature')
      throw new Error('The GeoJSON object has neither property "FeatureCollection" nor property "Feature"!');

    // Append the XML SVG Header.
    fs.write('<!-- Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. -->\n');
    fs.write('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n');
    fs.write('  <g transform="translate(0, 0) scale(1, 1)">\n');

    // For a Feature.
    if (json.type === 'Feature') {
      d = _svg.getSVGPath(json.geometry.coordinates);
      fs.write('    <path id="" class="land" d="' + d + '"></path>\n');
    }

    // For a FeatureCollection.
    if (json.type === 'FeatureCollection')
      for (i = 0; i < json.features.length; i++) {
        d = _svg.getSVGPath(json.features[i].geometry.coordinates);
        fs.write('    <path id="" class="land" d="' + d + '"></path>\n');
      }

    // Append the XML Footer and close the file stream.
    fs.write('  </g>\n');
    fs.end('</svg>\n');
  }
};

module.exports = JMAPS;
