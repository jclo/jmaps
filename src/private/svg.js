/** ****************************************************************************
 *
 * Creates a SVG Map.
 *
 * svg.js is just a literal object that contains a set of functions. It
 * can't be intantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Private Functions:
 *  . _getSVGPath                 returns the SVG path,
 *  . _out                        writes SVG to the file stream or stdout,
 *  . _process                    generates the SVG map
 *  . _to                         creates the SVG map,
 *
 *
 * Public Static Methods:
 *  . to                          creates the SVG Map,
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


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the SVG path.
 *
 * @function (arg1)
 * @private
 * @param {Array}           the geometry coordinates,
 * @returns {String}        returns the SVG path,
 * @since 0.0.0
 */
function _getSVGPath(coord) {
  let path
    , subpath
    , i
    , j
    ;

  path = '';
  for (i = 0; i < coord.length; i++) {
    subpath = '';
    for (j = 0; j < coord[i].length; j++) {
      if (subpath === '') {
        subpath = `M${(coord[i][j][0])},${coord[i][j][1]}`;
      } else {
        subpath += `L${coord[i][j][0]},${coord[i][j][1]}`;
      }
    }
    subpath += 'z';
    path += subpath;
  }
  return path;
}

/**
 * Writes the SVG element to the file stream or stdout.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object/String}   the file stream object,
 * @param {String}          the SVG element,
 * @returns {}              -,
 * @since 0.0.0
 */
function _out(fsw, str) {
  if (typeof fsw === 'object') {
    fsw.write(str);
  } else {
    process.stdout.write(str);
  }
}

/**
 * Generates the SVG map.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object}          the GeoJSON map,
 * @param {Object}          the file stream,
 * @returns {}              -,
 * @since 0.0.0
 */
function _process(json, fsw) {
  let d
    ;

  // Append the XML SVG Header.
  const header = `
<!-- Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g transform="translate(0, 0) scale(1, 1)">
  `;
  _out(fsw, header);

  if (json.type === 'FeatureCollection') {
    for (let i = 0; i < json.features.length; i++) {
      d = _getSVGPath(json.features[i].geometry.coordinates);
      _out(fsw, `    <path id="" class="land" d="${d}"></path>\n`);
    }
  } else {
    d = _getSVGPath(json.geometry.coordinates);
    _out(fsw, `    <path id="" class="land" d="${d}"></path>\n`);
  }

  // Append the XML Footer and close the file stream.
  _out(fsw, '  </g>\n');
  _out(fsw, '</svg>\n');
  if (typeof fsw === 'object') {
    fsw.end('');
  }
}

/**
 * Creates the SVG map.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object}          the GeoJSON map,
 * @param {Object}          the file stream,
 * @returns {}              -,
 * @since 0.0.0
 */
function _to(...args) {
  const [geojson, stream] = args;
  if (args.length < 1) {
    throw new Error('This method expects at least one argument!');
  }

  if (typeof geojson !== 'object'
    || (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature')) {
    throw new Error('The first passed-in argument isn\'t a valid GeoJSON object!');
  }

  if (stream && (typeof stream !== 'object' || !stream.write)) {
    throw new Error('The second argument isn\'t a writable file stream!');
  }

  if (stream) {
    _process(geojson, stream);
  } else {
    _process(geojson, 'stdout');
  }
}


// -- Public Static Methods ----------------------------------------------------

const SVG = {

  /**
   * Creates the SVG Map.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the GeoJSON map,
   * @param {Object}        the file stream,
   * @returns {}            -,
   * @since 0.0.0
   */
  to(...args) {
    _to(...args);
  },
};


// -- Export
module.exports = SVG;
