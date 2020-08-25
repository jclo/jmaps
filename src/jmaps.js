/** ****************************************************************************
 *
 * Extracts maps from Natural Earth DB files.
 *
 * jmaps.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Constructor:
 *  . jMaps                      creates and returns the jMaps object,
 *
 *
 * Private Static Methods:
 *  . _setTestMode                returns internal objects for testing purpose,
 *
 *
 * Public Static Methods:
 *  . none,
 *
 *
 * Public Methods:
 *  . whoami                      returns the library name and version,
 *  . load                        loads the Natural Earth database,
 *  . getCollection               returns a GeoJSON collection,
 *  . getFeature                  returns the requested GeoJSON feature,
 *  . transform                   applies a transformation to the GeoJSON map,
 *  . toSVG                       converts a GeoJSON to a SVG Map,
 *
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* global */
/* eslint-disable one-var, semi-style, no-underscore-dangle */

'use strict';


// -- Module Path
const fs  = require('fs')
    , SHP = require('@mobilabs/shp')
    ;


// -- Local Modules
const pack = require('../package.json')
    , T    = require('./private/transform')
    , S    = require('./private/svg')
    , C    = require('./private/clone')
    ;


// -- Local Constants
const LIBNAME = 'jMaps';


// -- Local Variables
let methods;


// -- Public -------------------------------------------------------------------

/**
 * Returns the jMaps object.
 * (Prototypal Instantiation Pattern)
 *
 * @constructor ()
 * @public
 * @param {}              -,
 * @returns {Object}      returns the jMaps object,
 * @since 0.0.0
 */
const jMaps = function() {
  const obj = Object.create(methods);
  obj._library = {
    name: LIBNAME,
    version: pack.version,
  };
  obj._shp = SHP();
  return obj;
};

// Attaches constants to jMaps that provide name and version of the lib.
jMaps.NAME = LIBNAME;
jMaps.VERSION = pack.version;


// -- Private Static Methods ---------------------------------------------------

/**
 * Returns the internal objects for testing purpose.
 * (must not be deleted)
 *
 * @method ()
 * @private
 * @param {}              -,
 * @returns {Object}      returns a list of internal objects,
 * @since 0.0.0
 */
jMaps._setTestMode = function() {
  return [C];
};


// -- Public Methods -----------------------------------------------------------

methods = {

  /**
   * Returns the library name and version.
   * (must not be deleted)
   *
   * @method ()
   * @public
   * @param {}            -,
   * @returns {Object}    returns the library name and version,
   * @since 0.0.0
   */
  whoami() {
    return this._library;
  },

  /**
   * Loads the Natural Earth database.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the database path,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */

  load(path, db) {
    let dbf
      , shp
      , version
      ;

    try {
      dbf = fs.readFileSync(`${path}/${db}/${db}.dbf`);
      shp = fs.readFileSync(`${path}/${db}/${db}.shp`);
      version = fs.readFileSync(`${path}/${db}/${db}.VERSION.txt`, 'utf8');
    } catch (e) {
      throw new Error('Cannot access to the database!');
    }
    this._shp._load([dbf, shp, version]);
  },

  /**
   * Returns a GeoJSON collection.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Object}      returns a collection,
   * @since 0.0.0
   */
  getCollection() {
    return C.clone(this._shp.getCollection());
  },

  /**
   * Returns the requested GeoJSON feature.
   *
   * @method (arg1)
   * @public
   * @param {Number}        the requested feature,
   * @returns {Object}      returns a GeoJON feature,
   * @since 0.0.0
   */
  getFeature(feature) {
    return C.clone(this._shp.getFeature(feature));
  },

  /**
   * Applies a transformation to the GeoJSON map.
   *
   * @method (arg1)
   * @public
   * @param {Object}        transformation parameters,
   * @returns {Object}      returns the transformed GeoJSON map,
   * @since 0.0.0
   */
  transform(options) {
    // options = options || { scale: 1, projection: 'none', mirror: 'none' };
    return T.transform(this.getCollection(), options);
  },

  /**
   * Converts a GeoJSON to a SVG Map.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the GeoJSON map,
   * @param {Object}        the file stream,
   * @returns {}            -,
   * @since 0.0.0
   */
  toSVG(...args) {
    S.to(...args);
  },
};

// -- Export
module.exports = jMaps;
