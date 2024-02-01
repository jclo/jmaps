// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */

'use strict';

// -- Vendor Modules


// -- Local Modules
const jMaps   = require('../index')
    , pack    = require('../package.json')
    , testlib = require('./int/lib')
    , check   = require('./int/dbcheck')
    , test    = require('./int/dbtest')
    , geoTest = require('./int/geotests')
    ;


// -- Local Constants
const libname         = 'jMaps'
    , PATH            = './_db'
    , DBNAME_POLYGON  = 'ne_50m_admin_0_countries'
    , DBNAME_POLYLINE = 'ne_50m_admin_0_pacific_groupings'
    , DBNAME_POINT    = 'ne_50m_populated_places'
    ;


// -- Local Variables


// -- Main
describe('Test jMaps:', () => {
  testlib(jMaps, libname, pack.version, 'without new');

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
