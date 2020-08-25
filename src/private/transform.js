/** ****************************************************************************
 *
 * Applies transformations to a GeoJSON Map.
 *
 * transform.js is just a literal object that contains a set of functions. It
 * can't be intantiated.
 *
 * Private Functions:
 *  . _filter                     extracts the transformation parameters,
 *  . _mirroring                  applies the mirroring transformation,
 *  . _mercator                   applies the mercator projection,
 *  . _none                       applies the linear projection,
 *  . _computeProjection          applies the requested projection,
 *  . _project                    applies the requested transformations,
 *  . _transform                  projects a GeoJSON map on a x, y plane,
 *  . _getBoundaries              returns the map boundaries,
 *
 *
 * Public Static Methods:
 *  . transform                   projects a GeoJSON map on a x, y plane,
 *  . getBoundaries               returns the map boundaries,
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
 * Extracts the transformation parameters.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the passed-in transformation parameters,
 * @returns {Object}        returns the filtered transformation parameters,
 * @since 0.0.0
 */
function _filter(options) {
  const opts = { scale: 1, projection: 'none', mirror: 'none' };

  opts.scale = options && options.scale && typeof options.scale === 'number' && options.scale > 1
    ? options.scale
    : opts.scale;

  opts.projection = options && options.projection && options.projection === 'mercator'
    ? options.projection
    : opts.projection;

  opts.mirror = options && options.mirror
    && (options.mirror === 'x' || options.mirror === 'y' || options.mirror === 'xy')
    ? options.mirror
    : opts.mirror;

  return opts;
}

/**
 * Applies the mirroring transformation.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Array}           the coordinate,
 * @param {String}          the transformation,
 * @returns {Array}         returns the trasnformed coordinates,
 * @since 0.0.0
 */
/* eslint-disable no-param-reassign */
function _mirroring(c, mirror) {
  if (mirror === 'x') {
    c[1] = -c[1];
  } else if (mirror === 'y') {
    c[0] = -c[0];
  } else if (mirror === 'xy') {
    c[0] = -c[0];
    c[1] = -c[1];
  } else {
    /* istanbul ignore next */
    throw new Error(`The mirroring projection "${mirror}" is not supported yet!`);
  }
  return c;
}
/* eslint-enable no-param-reassign */

/**
 * Applies the mercator projection.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Number}          the latitude,
 * @param {Number}          the longitude,
 * @param {Number}          the zoom factor,
 * @param {Number}          the longitude translation,
 * @returns {Array}         returns the converted latitude/longitude to x, y,
 * @since 0.0.0
 */
function _mercator(φdegree, λdegree, zoom, λodegree) {
  const z  = zoom || 1
      , r  = Math.PI / 180
      , φ  = φdegree * r
      // , λ  = λdegree * r
      , λo = λodegree || 0
      ;

  // let x = λ - λo;
  // x /= r;
  const x = λdegree - λo;
  // A mercator projection for a latitude greater than 85.05° or lower
  // than -85.05° tends to infinity. Thus, we limit the latitude
  // to |85.05°| i.e., a projection to |180|.
  let y;
  if (φdegree > 85.05) {
    y = 180;
  } else if (φdegree < -85.05) {
    y = -180;
  } else {
    y = Math.log(Math.tan((1 / 4) * Math.PI + (1 / 2) * φ)) / r;
  }
  return [x * z, y * z];
}

/**
 * Applies the linear projection.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Number}          the latitude,
 * @param {Number}          the longitude,
 * @returns {Array}         returns the converted latitude/longitude to x, y,
 * @since 0.0.0
 */
function _none(φ, λ) {
  return [λ, φ];
}

/**
 * Applies the requested projection.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Number}          the latitude,
 * @param {Number}          the longitude,
 * @param {String}          the projection,
 * @returns {Array}         returns the converted latitude/longitude to x, y,
 * @since 0.0.0
 */
function _computeProjection(φ, λ, projection) {
  switch (projection) {
    case 'none':
      return _none(φ, λ);

    case 'mercator':
      return _mercator(φ, λ);

    default:
      /* istanbul ignore next */
      throw new Error(`The projection "${projection}" is not supported yet!`);
  }
}

/**
 * Applies the requested transformations.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Array}           the geometry coordinates,
 * @param {Object}          the transformation parameters,
 * @returns {Array}         returns the converted coordinates,
 * @since 0.0.0
 */
function _project(coord, options) {
  const { scale } = options
      , path  = []
      ;
  let subpath
    , λ
    , φ
    , c
    , i
    , j
    ;

  for (i = 0; i < coord.length; i++) {
    subpath = [];
    for (j = 0; j < coord[i].length; j++) {
      [φ, λ] = coord[i][j];
      // Apply a projection.
      c = _computeProjection(φ, λ, options.projection);
      // Apply mirroring.
      if (options.mirror !== 'none') {
        c = _mirroring(c, options.mirror);
      }

      // Limit accuracy to approximately 0.01 degree.
      c[0] = Math.round(c[0] * 100) / 100;
      c[1] = Math.round(c[1] * 100) / 100;
      subpath.push([c[0] * scale, c[1] * scale]);
    }
    path.push(subpath);
  }
  return path;
}

/**
 * Projects a GeoJSON map on a x, y plane.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Array}           the geometry coordinates,
 * @param {Object}          the transformation parameters,
 * @returns {Object}        returns the converted GeoJSON Map,
 * @since 0.0.0
 */
function _transform(geojson, options) {
  const opts = _filter(options);

  if (!geojson || typeof geojson !== 'object' || geojson.type !== 'FeatureCollection') {
    /* eslint-disable-next-line */
    console.log('The GeoJSON object doesn\'t exist!');
    return null;
  }

  for (let i = 0; i < geojson.features.length; i++) {
    const { geometry } = geojson.features[i];
    geometry.coordinates = _project(geometry.coordinates, opts);
  }
  return geojson;
}

/**
 * Returns the map boundaries.
 *
 * @function (arg1)
 * @private
 * @param {Array}           the GeoJSOB features,
 * @returns {Object}        returns the map boundaries,
 * @since 0.0.0
 */
/* eslint-disable object-curly-newline */
function _getBoundaries(features) {
  let λ
    , φ
    , i
    , j
    , k
    ;

  const b = { λMin: 99999, λMax: -99999, φMin: 99999, φMax: -99999 };
  for (i = 0; i < features.length; i++) {
    for (j = 0; j < features[i].geometry.coordinates.length; j++) {
      for (k = 0; k < features[i].geometry.coordinates[j].length; k++) {
        [φ, λ] = features[i].geometry.coordinates[j][k];
        if (λ > b.λMax) b.λMax = λ;
        if (λ < b.λMin) b.λMin = λ;
        if (φ > b.φMax) b.φMax = φ;
        if (φ < b.φMin) b.φMin = φ;
      }
    }
  }
  return b;
}
/* eslint-enable object-curly-newline */


// -- Public Static Methods ----------------------------------------------------

const TR = {

  /**
   * Projects a GeoJSON map on a x, y plane.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         the geometry coordinates,
   * @param {Object}        the transformation parameters,
   * @returns {Object}      returns the transformed GeoJSON map,
   * @since 0.0.0
   */
  transform(geojson, options) {
    return _transform(geojson, options);
  },

  /**
   * Returns the map boundaries.
   *
   * @method (arg1)
   * @public
   * @param {Array}         the GeoJSOB features,
   * @returns {Object}      returns the map boundaries,
   * @since 0.0.0
   */
  getBoundaries(features) {
    return _getBoundaries(features);
  },
};


// -- Export
module.exports = TR;
