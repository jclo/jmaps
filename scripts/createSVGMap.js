// ESLint declarations:
/* global */
/* eslint one-var: 0, semi-style: 0 */

'use strict';


// -- Vendor Modules
const fs = require('fs');


// -- Local Modules
const jMaps = require('../index');


// -- Local Constants
const output = 'index.html'
    , path   = './_db'
    , db     = 'ne_50m_admin_0_countries'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Create SVG
 */
function createSVG() {
  const jmap = jMaps()
      , fd = fs.createWriteStream(output, { flags: 'w' })
      ;

  jmap.load(path, db);
  const map = jmap.transform({ scale: 2, projection: 'mercator', mirror: 'x' });
  jmap.toSVG(map, fd);
}


// -- Main
createSVG();
