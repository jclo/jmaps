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
module.exports = function(jMaps, path, db) {
  describe('Test the method transform(geojson, options):', () => {
    const jmap = jMaps();

    jmap.load(path, db);
    it('Expects the method to return an object.', () => {
      expect(jmap.transform()).to.be.an('object');
    });

    it('Expects it to return an object with the property "type".', () => {
      expect(jmap.transform()).to.have.property('type');
    });

    it('Expects the property "type" to be equal to "FeatureCollection".', () => {
      expect(jmap.transform()).to.have.property('type').that.is.equal('FeatureCollection');
    });

    it('Expects it to return an object for the projection "mercator".', () => {
      expect(jmap.transform({ projection: 'mercator' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "x".', () => {
      expect(jmap.transform({ mirror: 'x' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "y".', () => {
      expect(jmap.transform({ mirror: 'y' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "xy".', () => {
      expect(jmap.transform({ mirror: 'xy' })).to.be.an('object');
    });
  });

  describe('Test the method toSVG():', () => {
    const jmap = jMaps();

    let test;
    jmap.load(path, db);

    it('Expects the method to throw an error if the arguments are undefined.', () => {
      try {
        test = false;
        jmap.toSVG();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if the first argument is not a GeoJSON file.', () => {
      try {
        test = false;
        jmap.toSVG({});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if the second argument is not a writable filestream.', () => {
      try {
        test = false;
        jmap.toSVG(jmap.getFeature(1), {});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects a GeoJSON Feature to produce an output file.', (done) => {
      const sFile = './b.svg'
          , wfd = fs.createWriteStream(sFile, { flags: 'w' })
          ;

      // Create SVG output:
      jmap.toSVG(jmap.getFeature(1), wfd);
      setTimeout(() => {
        expect(fs.statSync(sFile).isFile()).to.be.equal(true);
        try { fs.unlinkSync(sFile); } finally { /* */ }
        done();
      }, 1000);
    });

    it('Expects a GeoJSON Collection to produce an output file.', (done) => {
      const sFile = './c.svg'
          , wfd = fs.createWriteStream(sFile, { flags: 'w' })
          ;

      // Create SVG output:
      jmap.toSVG(jmap.getCollection(), wfd);
      setTimeout(() => {
        expect(fs.statSync(sFile).isFile()).to.be.equal(true);
        try { fs.unlinkSync(sFile); } finally { /* */ }
        done();
      });
    });
  });
};
