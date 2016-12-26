/* global describe, it */
/* eslint  max-len: [1, 125, 2], no-unused-expressions: 0, no-shadow: 0 */

'use strict';

// -- Node modules
var fs     = require('fs')
  , expect = require('chai').expect
  ;

// -- Local modules
var JMAPS = require('../index.js')
  ;

// -- Local constants

// -- Main
module.exports = function(path, db) {
  describe('Test the method transform(geojson, options).', function() {
    var jmap = new JMAPS(path, db)
      , geojson
      , test
      ;

    it('Expects the method to throw an error if the arguments are undefined.', function() {
      try {
        test = false;
        jmap.transform();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if the first argument is an empty object.', function() {
      try {
        test = false;
        jmap.transform({});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    geojson = jmap.getFeature(1);

    it('Expects the method to throw an error if the second argument is not an object.', function() {
      try {
        test = false;
        jmap.transform(geojson, 'a');
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if option.scale is not a number.', function() {
      try {
        test = false;
        jmap.transform(geojson, { scale: 'a' });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if option.scale is a number lower than 1.', function() {
      try {
        test = false;
        jmap.transform(geojson, { scale: 0.99 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if option.projection ha a wrong value.', function() {
      try {
        test = false;
        jmap.transform(geojson, { projection: 1 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if option.mirror has a wrong value.', function() {
      try {
        test = false;
        jmap.transform(geojson, { mirror: 1 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to return an object.', function() {
      expect(jmap.transform(geojson)).to.be.an('object');
    });

    it('Expects it to return an object with the property "type".', function() {
      expect(jmap.transform(geojson)).to.have.property('type');
    });

    it('Expects the property "type" to be equal to "FeatureCollection".', function() {
      geojson = jmap.getCollection();
      expect(jmap.transform(geojson)).to.have.property('type').to.equal('FeatureCollection');
    });

    it('Expects the property "type" to be equal to "Feature".', function() {
      geojson = jmap.getFeature(1);
      expect(jmap.transform(geojson)).to.have.property('type').to.equal('Feature');
    });

    it('Expects it to return an object for the projection "mercator".', function() {
      expect(jmap.transform(geojson, { projection: 'mercator' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "x".', function() {
      expect(jmap.transform(geojson, { mirror: 'x' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "y".', function() {
      expect(jmap.transform(geojson, { mirror: 'y' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "xy".', function() {
      expect(jmap.transform(geojson, { mirror: 'xy' })).to.be.an('object');
    });
  });

  describe('Test the method toSVG().', function() {
    var SVGFile = './a.svg'
      , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
      , jmap = new JMAPS(path, db)
      , test
      ;

    it('Expects the method to throw an error if the arguments are undefined.', function() {
      try {
        test = false;
        jmap.toSVG();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if the first argument is not a writable file stream handler.', function() {
      try {
        test = false;
        jmap.toSVG({}, jmap.getFeature(1));
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if the second argument is undefined.', function() {
      try {
        test = false;
        jmap.toSVG(fd);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects the method to throw an error if the second argument is not a GeoJSON object.', function() {
      try {
        test = false;
        jmap.toSVG(fd, {});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects a GeoJSON Feature to produce an output file.', function() {
      var SVGFile = './b.svg'
        , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
        ;

      // Create SVG output.
      jmap.toSVG(fd, jmap.getFeature(1));

      // Check that it creates a file.
      expect(fs.statSync(SVGFile).isFile()).to.be.true;

      // Delete the file.
      try { fs.unlinkSync(SVGFile); } finally { /* */ }
    });

    it('Expects a GeoJSON Collection to produce an output file.', function() {
      var SVGFile = './c.svg'
        , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
        ;

      // Create SVG output.
      jmap.toSVG(fd, jmap.getCollection());

      // Check that it creates a file.
      expect(fs.statSync(SVGFile).isFile()).to.be.true;

      // Delete the file.
      try { fs.unlinkSync(SVGFile); } finally { /* */ }
    });

    // Delete residual file.
    try { fs.unlinkSync(SVGFile); } finally { /* */ }
  });
};
