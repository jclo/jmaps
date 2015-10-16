/* global describe, it */
/* eslint  max-len: [1, 125, 2] */
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

    it('Checks that no argument throws an error.', function() {
      try {
        test = false;
        jmap.transform();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that an empty GeoJSON object throws an error.', function() {
      try {
        test = false;
        jmap.transform({});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    geojson = jmap.getFeature(1);

    it('Checks that a wrong option type throws an error.', function() {
      try {
        test = false;
        jmap.transform(geojson, 'a');
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a wrong scale option type throws an error.', function() {
      try {
        test = false;
        jmap.transform(geojson, { scale: 'a' });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a scale lower that 1 throws an error.', function() {
      try {
        test = false;
        jmap.transform(geojson, { scale: 0.99 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a wrong projection value throws an error.', function() {
      try {
        test = false;
        jmap.transform(geojson, { projection: 1 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a wrong mirror value throws an error.', function() {
      try {
        test = false;
        jmap.transform(geojson, { mirror: 1 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that it returns an object.', function() {
      expect(jmap.transform(geojson)).to.be.an('object');
    });

    it('Checks that it returns an object with the property "type".', function() {
      expect(jmap.transform(geojson)).to.have.property('type');
    });

    it('Checks that this property "type" is "FeatureCollection".', function() {
      geojson = jmap.getCollection();
      expect(jmap.transform(geojson)).to.have.property('type').to.equal('FeatureCollection');
    });

    it('Checks that it this property "type" is "Feature".', function() {
      geojson = jmap.getFeature(1);
      expect(jmap.transform(geojson)).to.have.property('type').to.equal('Feature');
    });

    it('Checks that it returns an object for the projection "mercator".', function() {
      expect(jmap.transform(geojson, { projection: 'mercator' })).to.be.an('object');
    });

    it('Checks that it returns an object for the mirror value "x".', function() {
      expect(jmap.transform(geojson, { mirror: 'x' })).to.be.an('object');
    });

    it('Checks that it returns an object for the mirror value "y".', function() {
      expect(jmap.transform(geojson, { mirror: 'y' })).to.be.an('object');
    });

    it('Checks that it returns an object for the mirror value "xy".', function() {
      expect(jmap.transform(geojson, { mirror: 'xy' })).to.be.an('object');
    });
  });

  describe('Test the method toSVG().', function() {
    var SVGFile = './a.svg'
      , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
      , jmap = new JMAPS(path, db)
      , test
      ;

    it('Checks that no arguments throws an error.', function() {
      try {
        test = false;
        jmap.toSVG();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a wrong file stream handler throws an error.', function() {
      try {
        test = false;
        jmap.toSVG({}, jmap.getFeature(1));
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that an undefined GeoJSON object throws an error.', function() {
      try {
        test = false;
        jmap.toSVG(fd);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a wrong GeoJSON object throws an error.', function() {
      try {
        test = false;
        jmap.toSVG(fd, {});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Checks that a GeoJSON Feature produces an output file.', function() {
      var SVGFile = './b.svg'
        , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
        ;

      // Create SVG output.
      jmap.toSVG(fd, jmap.getFeature(1));

      // Check that it creates a file.
      expect(fs.statSync(SVGFile).isFile()).to.be.true;

      // Delete the file.
      try { fs.unlinkSync(SVGFile); } finally {/* */ }
    });

    it('Checks that a GeoJSON Collection produces an output file.', function() {
      var SVGFile = './c.svg'
        , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
        ;

      // Create SVG output.
      jmap.toSVG(fd, jmap.getCollection());

      // Check that it creates a file.
      expect(fs.statSync(SVGFile).isFile()).to.be.true;

      // Delete the file.
      try { fs.unlinkSync(SVGFile); } finally {/* */ }
    });

    // Delete residual file.
    try { fs.unlinkSync(SVGFile); } finally {/* */ }

  });
};
