/* global describe, it */
/* eslint  max-len: [1, 120, 2] */
'use strict';

// -- Node modules
var fs     = require('fs')
  , expect = require('chai').expect
  ;

// -- Local modules

// -- Local constants

// -- Main
module.exports = function(path, db) {

  describe('Test Natural Earth\'s database ' + db + '.', function() {
    it('Checks if database exists.', function() {
      var file = true;
      try { fs.accessSync(path + '/' + db, fs.R_OK); } catch (e) { file = false; }
      expect(file).to.be.true;
    });

    it('Checks if database file .dbf exists.', function() {
      var file = true;
      try { fs.accessSync(path + '/' + db + '/' + db + '.dbf', fs.R_OK); } catch (e) { file = false; }
      expect(file).to.be.true;
    });

    it('Checks if database file .shp exists.', function() {
      var file = true;
      try { fs.accessSync(path + '/' + db + '/' + db + '.dbf', fs.R_OK); } catch (e) { file = false; }
      expect(file).to.be.true;
    });
  });
};
