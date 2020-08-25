// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */

'use strict';

// -- Vendor Modules
const { execSync } = require('child_process')
    ;


// -- Local Modules
const jMaps  = require('../index.js')
    , pack    = require('../package.json')
    , testlib = require('./int/lib')
    , check   = require('./int/dbcheck.js')
    , test    = require('./int/dbtest.js')
    , geoTest = require('./int/geotests.js')
    ;


// -- Local Constants
const libname = 'jMaps'
    , SCRIPT          = './test/natural_earth_download.sh'
    , URL             = 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/50m/cultural'
    , PATH            = './_db'
    , DBNAME_POLYGON  = 'ne_50m_admin_0_countries'
    , DBNAME_POLYLINE = 'ne_50m_admin_0_pacific_groupings'
    , DBNAME_POINT    = 'ne_50m_populated_places'
    ;


// -- Local Variables


// -- Main
// Download Natural Earth's databases if they are not present. This is required
// for Travis CI as we do not provide Natural Earth's databases with the
// package.
const cmd = `${SCRIPT} ${URL} ${PATH} ${DBNAME_POLYGON} ${DBNAME_POLYLINE} ${DBNAME_POINT}`;
execSync(cmd);

describe('Test jMaps:', () => {
  testlib(jMaps, libname, pack.version);

  // Check if the databases exist.
  check(PATH, DBNAME_POLYGON);
  check(PATH, DBNAME_POLYLINE);
  check(PATH, DBNAME_POINT);

  // Test the databases.
  test(jMaps, PATH, DBNAME_POLYGON, 'Polygon');
  test(jMaps, PATH, DBNAME_POLYLINE, 'PolyLine');
  test(jMaps, PATH, DBNAME_POINT, 'Point');

  // Test GeoJSON object operations.
  geoTest(jMaps, PATH, DBNAME_POLYGON);
});
