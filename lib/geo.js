/* global  */
/* eslint one-var: 0, no-underscore-dangle: 0, no-param-reassign: 0 */

// -- Node modules

// -- Local modules

// -- Local constants

// -- Local variables

/**
 * This library provides utilities to manipulate φ and λ coordinates.
 *
 * @namespace  _geo
 * @throws     Throws errors on unsupported options.
 * @author     jclo
 * @since      0.0.1
 */
const _geo = {

  /**
   * Transforms longitudes and latitudes into x, y coordinates.
   *
   * @function(coord, options)
   * @public
   * @param {Array}     A set of φ and λ coordinates,
   * @param {Object}    The transformations to apply,
   * @returns {Array}   Returns a set of x, y coordinates,
   */
  project(coord, options) {
    return _geo._setProjection(coord, options);
  },

  /**
   * Returns the min, max longitudes and latitudes(not used yet!).
   *
   * @function(coord, options)
   * @public
   * @param {Object}    A set of GeoJSON features,
   * @returns {Array}   Returns the λ and φ min/max coordinates,
   */
  /* eslint-disable object-shorthand */
  getBoundaries: /* istanbul ignore next */ function(features) {
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
          φ = features[i].geometry.coordinates[j][k][0];
          λ = features[i].geometry.coordinates[j][k][1];
          if (λ > b.λMax) b.λMax = λ;
          if (λ < b.λMin) b.λMin = λ;
          if (φ > b.φMax) b.φMax = φ;
          if (φ < b.φMin) b.φMin = φ;
        }
      }
    }
    return b;
  },
  /* eslint-enable object-shorthand */

  /**
   * Applies the requested projection on the array of coordinates.
   *
   * @function(coord, options)
   * @private
   * @param {Array}     A set of φ and λ coordinates,
   * @param {Object}    The transformations to apply,
   * @returns {Array}   Returns a set of x, y coordinates,
   */
  _setProjection(coord, options) {
    const scale = options.scale
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
        φ = coord[i][j][0];
        λ = coord[i][j][1];
        // Apply a projection.
        c = _geo._computeProjection(φ, λ, options.projection);
        // Apply mirroring.
        if (options.mirror !== 'none') {
          c = _geo._mirroring(c, options.mirror);
        }

        // Limit accuracy to approximately 0.01 degree.
        c[0] = Math.round(c[0] * 100) / 100;
        c[1] = Math.round(c[1] * 100) / 100;
        subpath.push([c[0] * scale, c[1] * scale]);
      }
      path.push(subpath);
    }
    return path;
  },

  /**
   * Applies mercator projection.
   *
   * @function(φ, λ)
   * @private
   * @param {Number}    The latitude,
   * @param {Number}    The longitude,
   * @returns {Array}   Returns x, y coordinates,
   */
  _mercator(φ, λ) {
    return [
      λ,
      Math.log(Math.tan((Math.PI / 4) + ((φ / 2) / (180 * Math.PI)))) * (180 / Math.PI),
    ];
  },

  /**
   * Applies no projection (convert one to one λ, φ to x, y).
   *
   * @function(φ, λ)
   * @private
   * @param {Number}    The latitude,
   * @param {Number}    The longitude,
   * @returns {Array}   Returns x, y coordinates,
   */
  _none(φ, λ) {
    return [λ, φ];
  },

  /**
   * Applies the requested projection.
   *
   * @function(φ, λ, projection)
   * @private
   * @param {Number}    The latitude,
   * @param {Number}    The longitude,
   * @param {String}    The name of the projection,
   * @returns {Array}   Returns x, y coordinates,
   * @throws {Object}   Throws an error if the projection is unknown,
   */
  _computeProjection(φ, λ, projection) {
    switch (projection) {
      case 'none':
        return _geo._none(φ, λ);

      case 'mercator':
        return _geo._mercator(φ, λ);

      default:
        /* istanbul ignore next */
        throw new Error(`The projection "${projection}" is not supported yet!`);
    }
  },

  /**
   * Applies the requested mirroring projection on the array of coordinates.
   *
   * @function(coord, mirror)
   * @private
   * @param {Array}     x, y coordinates,
   * @param {String}    The mirroring operation,
   * @returns {Array}   Returns x, y coordinates,
   * @throws {Object}   Throws an error if the mirroring option is unknown,
   */
  _mirroring(c, mirror) {
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
  },
};

module.exports = _geo;
