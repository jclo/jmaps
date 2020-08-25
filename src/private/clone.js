/** ****************************************************************************
 *
 * Clones a GeoJSON Collection or Feature.
 *
 * clone.js is just a literal object that contains a set of functions. It
 * can't be intantiated.
 *
 * Private Functions:
 *  . _cloneFeature               clones a GeoJSON Feature,
 *  . _cloneCollection            clones a GeoJSON Collection,
 *  . _clone                      clones a GeoJSON object,
 *
 *
 * Public Static Methods:
 *  . clone                       clones a GeoJSON object,
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
 * Clones a GeoJSON Feature.
 *
 * @function (arg1)
 * @private
 * @param {Object}        the GeoJSON object,
 * @throws {Object}       throws an error if the geometry isn't a polygon,
 * @returns {Object}      returns the cloned GeoJSON object,
 * @since 0.0.0
 */
function _cloneFeature(geojson) {
  const json = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: geojson.geometry.type,
      coordinates: [],
    },
  };

  const props = Object.keys(geojson.properties);
  props.forEach((prop) => {
    json.properties[prop] = geojson.properties[prop];
  });

  if (geojson.geometry.type === 'Polygon' || geojson.geometry.type === 'PolyLine') {
    for (let i = 0; i < geojson.geometry.coordinates.length; i++) {
      json.geometry.coordinates[i] = [];
      for (let j = 0; j < geojson.geometry.coordinates[i].length; j++) {
        json.geometry.coordinates[i][j] = [];
        json.geometry.coordinates[i][j].push(
          geojson.geometry.coordinates[i][j][0],
          geojson.geometry.coordinates[i][j][1],
        );
      }
    }
  } else if (geojson.geometry.type === 'Point') {
    json.geometry.coordinates.push(
      geojson.geometry.coordinates[0],
      geojson.geometry.coordinates[1],
    );
  } else {
    throw new Error(`The geometry ${geojson.geometry.type} isn't supported!`);
  }

  return json;
}

/**
 * Clones a GeoJSON Collection.
 *
 * @function (arg1)
 * @private
 * @param {Object}        the GeoJSON object,
 * @returns {Object}      returns the cloned GeoJSON object,
 * @since 0.0.0
 */
function _cloneCollection(geojson) {
  const json = {
    type: 'FeatureCollection',
    bbox: [],
    features: [],
  };

  for (let i = 0; i < geojson.bbox.length; i++) {
    json.bbox.push(geojson.bbox[i]);
  }

  for (let i = 0; i < geojson.features.length; i++) {
    json.features.push(_cloneFeature(geojson.features[i]));
  }
  return json;
}

/**
 * Clones a GeoJSON object.
 *
 * @function (arg1)
 * @private
 * @param {Object}        the GeoJSON object,
 * @throws {Object}       throws an error if it isn't a GeoJSON object,
 * @returns {Object}      returns the cloned GeoJSON object,
 * @since 0.0.0
 */
function _clone(geojson) {
  if (typeof geojson === 'object' && geojson.type === 'Feature') {
    return _cloneFeature(geojson);
  }

  if (typeof geojson === 'object' && geojson.type === 'FeatureCollection') {
    return _cloneCollection(geojson);
  }

  throw new Error('This is neither a featureCollection nor a Feature!');
}


// -- Public Static Methods ----------------------------------------------------

const CL = {

  /**
   * Clones a GeoJSON object.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the GeoJSON object,
   * @returns {Object}      returns the cloned GeoJSON object,
   * @since 0.0.0
   */
  clone(geojson) {
    return _clone(geojson);
  },
};


// -- Export
module.exports = CL;
