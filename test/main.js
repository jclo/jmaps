/* global describe */
/* eslint max-len: [1, 120, 2] */
'use strict';

// -- Node modules
var execSync = require('child_process').execSync
  ;

// -- Local modules
var check   = require('./dbcheck.js')
  , test    = require('./dbtest.js')
  , geoTest = require('./geotest.js')
  ;

// -- Local constants
var CMD             = './test/natural_earth_download.sh'
  , URL             = 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/50m/cultural'
  , PATH            = './_db'
  , DBNAME_POLYGON  = 'ne_50m_admin_0_countries'
  , DBNAME_POLYLINE = 'ne_50m_admin_0_pacific_groupings'
  , DBNAME_POINT    = 'ne_50m_populated_places'
  ;

// Download Natural Earth's databases if they are not present. This is required
// for Travis CI as we do not provide Natural Earth's databases with the
// package.
CMD += ' ' + URL + ' ' + PATH + ' ' + DBNAME_POLYGON + ' ' + DBNAME_POLYLINE + ' ' + DBNAME_POINT;
execSync(CMD);

// Start tests.
describe('jMaps', function() {

  // Check if databases exist.
  check(PATH, DBNAME_POLYGON);
  check(PATH, DBNAME_POLYLINE);
  check(PATH, DBNAME_POINT);

  // Test databases.
  test(PATH, DBNAME_POLYGON, 'Polygon');
  test(PATH, DBNAME_POLYLINE, 'PolyLine');
  test(PATH, DBNAME_POINT, 'Point');

  // Test GeoJSON object operations.
  geoTest(PATH, DBNAME_POLYGON);

});
