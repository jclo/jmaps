/* global  */
/* eslint one-var: 0, no-underscore-dangle: 0, semi-style: 0 */

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
const _svg = {

  /**
   * Returns a SVG path related to the given array of coordinates.
   *
   * @function(coord)
   * @public
   * @param {Array}     An array of coordinates,
   * @returns {String}  Returns the SVG path,
   */
  getSVGPath(coord) {
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
  },
};

module.exports = _svg;
