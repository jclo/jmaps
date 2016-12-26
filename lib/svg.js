/* global  */
/* eslint curly: 0, no-underscore-dangle: 0 */

'use strict';

// -- Node modules

// -- Local modules

// -- Local constants

// -- Local variables

/**
 * This library processes SVG.


 * @namespace  _dbf
 * @author     jclo
 * @since      0.0.1
 */

/* istanbul ignore next */
var _svg = function() {};

_svg = {

  /**
   * Returns a SVG path related to the given array of coordinates.
   *
   * @function(coord)
   * @public
   * @param {Array}     An array of coordinates,
   * @returns {String}  Returns the SVG path,
   */
  getSVGPath: function(coord) {
    var path
      , subpath
      , i
      , j
      ;

    path = '';
    for (i = 0; i < coord.length; i++) {
      subpath = '';
      for (j = 0; j < coord[i].length; j++) {
        if (subpath === '')
          subpath = 'M' + (coord[i][j][0]) + ',' + coord[i][j][1];
        else
          subpath += 'L' + coord[i][j][0] + ',' + coord[i][j][1];
      }
      subpath += 'z';
      path += subpath;
    }
    return path;
  }
};

module.exports = _svg;
