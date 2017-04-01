/* global describe */
/* eslint one-var: 0 */
/* eslint max-len: [1, 120, 2] */

// -- Node modules
const execSync = require('child_process').execSync
    ;

// -- Local modules
const check   = require('./dbcheck.js')
    , test    = require('./dbtest.js')
    , geoTest = require('./geotests.js')
    ;

// -- Local constants
const SCRIPT          = './test/natural_earth_download.sh'
    , URL             = 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/50m/cultural'
    , PATH            = './_db'
    , DBNAME_POLYGON  = 'ne_50m_admin_0_countries'
    , DBNAME_POLYLINE = 'ne_50m_admin_0_pacific_groupings'
    , DBNAME_POINT    = 'ne_50m_populated_places'
    ;

// Download Natural Earth's databases if they are not present. This is required
// for Travis CI as we do not provide Natural Earth's databases with the
// package.
const cmd = `${SCRIPT} ${URL} ${PATH} ${DBNAME_POLYGON} ${DBNAME_POLYLINE} ${DBNAME_POINT}`;
execSync(cmd);

// Start tests.
describe('jMaps', () => {
  // Check if the databases exist.
  check(PATH, DBNAME_POLYGON);
  check(PATH, DBNAME_POLYLINE);
  check(PATH, DBNAME_POINT);

  // Test the databases.
  test(PATH, DBNAME_POLYGON, 'Polygon');
  test(PATH, DBNAME_POLYLINE, 'PolyLine');
  test(PATH, DBNAME_POINT, 'Point');

  // Test GeoJSON object operations.
  geoTest(PATH, DBNAME_POLYGON);
});
