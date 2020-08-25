// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */

'use strict';

// -- Vendor Modules
const fs         = require('fs')
    , { expect } = require('chai')
    ;


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main
module.exports = function(path, db) {
  describe(`Test Natural Earth's database ${db}:`, () => {
    it('Expects the database to exist.', () => {
      let file = true;
      try { fs.accessSync(`${path}/${db}`, fs.R_OK); } catch (e) { file = false; }
      expect(file).to.be.equal(true);
    });

    it('Expects the database file with the suffix .dbf to exist.', () => {
      let file = true;
      try { fs.accessSync(`${path}/${db}/${db}.dbf`, fs.R_OK); } catch (e) { file = false; }
      expect(file).to.be.equal(true);
    });

    it('Expects the database file with the suffix .shp to exist.', () => {
      let file = true;
      try { fs.accessSync(`${path}/${db}/${db}.shp`, fs.R_OK); } catch (e) { file = false; }
      expect(file).to.be.equal(true);
    });
  });
};
