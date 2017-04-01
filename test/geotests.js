/* global describe, it */
/* eslint one-var: 0, import/no-extraneous-dependencies: 0, no-shadow: 0 */

// -- Node modules
const fs     = require('fs')
    , expect = require('chai').expect
    ;

// -- Local modules
const JMAPS = require('../index.js')
    ;

// -- Local constants

// -- Main
module.exports = function(path, db) {
  describe('Test the method transform(geojson, options).', () => {
    const jmap = new JMAPS(path, db)
        ;
    let geojson
      , test
      ;

    it('Expects the method to throw an error if the arguments are undefined.', () => {
      try {
        test = false;
        jmap.transform();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if the first argument is an empty object.', () => {
      try {
        test = false;
        jmap.transform({});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    geojson = jmap.getFeature(1);

    it('Expects the method to throw an error if the second argument is not an object.', () => {
      try {
        test = false;
        jmap.transform(geojson, 'a');
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if option.scale is not a number.', () => {
      try {
        test = false;
        jmap.transform(geojson, { scale: 'a' });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if option.scale is a number lower than 1.', () => {
      try {
        test = false;
        jmap.transform(geojson, { scale: 0.99 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if option.projection ha a wrong value.', () => {
      try {
        test = false;
        jmap.transform(geojson, { projection: 1 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if option.mirror has a wrong value.', () => {
      try {
        test = false;
        jmap.transform(geojson, { mirror: 1 });
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to return an object.', () => {
      expect(jmap.transform(geojson)).to.be.an('object');
    });

    it('Expects it to return an object with the property "type".', () => {
      expect(jmap.transform(geojson)).to.have.property('type');
    });

    it('Expects the property "type" to be equal to "FeatureCollection".', () => {
      geojson = jmap.getCollection();
      expect(jmap.transform(geojson)).to.have.property('type').to.equal('FeatureCollection');
    });

    it('Expects the property "type" to be equal to "Feature".', () => {
      geojson = jmap.getFeature(1);
      expect(jmap.transform(geojson)).to.have.property('type').to.equal('Feature');
    });

    it('Expects it to return an object for the projection "mercator".', () => {
      expect(jmap.transform(geojson, { projection: 'mercator' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "x".', () => {
      expect(jmap.transform(geojson, { mirror: 'x' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "y".', () => {
      expect(jmap.transform(geojson, { mirror: 'y' })).to.be.an('object');
    });

    it('Expects it to return an object for the mirror value "xy".', () => {
      expect(jmap.transform(geojson, { mirror: 'xy' })).to.be.an('object');
    });
  });

  describe('Test the method toSVG().', () => {
    const SVGFile = './a.svg'
        , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
        , jmap = new JMAPS(path, db)
        ;
    let test
      ;

    it('Expects the method to throw an error if the arguments are undefined.', () => {
      try {
        test = false;
        jmap.toSVG();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if the first argument is not a writable file stream handler.', () => {
      try {
        test = false;
        jmap.toSVG({}, jmap.getFeature(1));
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if the second argument is undefined.', () => {
      try {
        test = false;
        jmap.toSVG(fd);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects the method to throw an error if the second argument is not a GeoJSON object.', () => {
      try {
        test = false;
        jmap.toSVG(fd, {});
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects a GeoJSON Feature to produce an output file.', () => {
      const SVGFile = './b.svg'
          , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
          ;

      // Create SVG output.
      jmap.toSVG(fd, jmap.getFeature(1));

      // Check that it creates a file.
      expect(fs.statSync(SVGFile).isFile()).to.be.equal(true);

      // Delete the file.
      try { fs.unlinkSync(SVGFile); } finally { /* */ }
    });

    it('Expects a GeoJSON Collection to produce an output file.', () => {
      const SVGFile = './c.svg'
          , fd = fs.createWriteStream(SVGFile, { flags: 'w' })
          ;

      // Create SVG output.
      jmap.toSVG(fd, jmap.getCollection());

      // Check that it creates a file.
      expect(fs.statSync(SVGFile).isFile()).to.be.equal(true);

      // Delete the file.
      try { fs.unlinkSync(SVGFile); } finally { /* */ }
    });

    // Delete residual file.
    try { fs.unlinkSync(SVGFile); } finally { /* */ }
  });
};
