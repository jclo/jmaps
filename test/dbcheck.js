/* global describe, it */
/* eslint one-var: 0, import/no-extraneous-dependencies: 0 */

// -- Node modules
const fs     = require('fs')
    , expect = require('chai').expect
    ;

// -- Local modules

// -- Local constants

// -- Main
module.exports = function(path, db) {
  describe(`Test Natural Earth's database ${db}.`, () => {
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
