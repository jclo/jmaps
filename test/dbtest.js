/* global describe, it */
/* eslint one-var: 0, import/no-extraneous-dependencies: 0, no-new: 0, no-underscore-dangle: 0,
  semi-style: 0 */

// -- Node modules
const { expect } = require('chai')
    ;

// -- Local modules
const JMAPS  = require('../index.js')
    ;

// -- Local constants

// -- Main
module.exports = function(path, db, type) {
  describe(`Test JMAPS instantiation for ${db}.`, () => {
    it('Expects the constructor to throw an error if the path is undefined.', () => {
      let test
        ;

      try {
        test = false;
        new JMAPS();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects it to throw an error if the db name is undefined.', () => {
      let test
        ;

      try {
        test = false;
        new JMAPS(path);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects it to throw an error for a wrong PATH.', () => {
      let test
        ;

      try {
        test = false;
        new JMAPS(`${path}s`, db);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects it to throw an error for a wrong DBNAME.', () => {
      let test
        ;

      try {
        test = false;
        new JMAPS(path, `${db}s`);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.equal(true);
    });

    it('Expects it to return an object.', () => {
      expect(new JMAPS(path, db)).to.be.an('object');
    });

    describe('Test JMAPS attached object _dbf.', () => {
      const jmap = new JMAPS(path, db);

      it('Expects the JMAPS object to have ._dbf object attached.', () => {
        expect(jmap._dbf).to.be.an('object');
      });

      it('Expects the JMAPS object to have ._dbf object with the property db.', () => {
        expect(jmap._dbf).to.have.property('db');
      });

      it('Expects JMAPS object to have ._dbf object with the property header.', () => {
        expect(jmap._dbf).to.have.property('header');
      });

      it('Expects JMAPS object to have ._dbf object with property fieldDescriptorArray.', () => {
        expect(jmap._dbf).to.have.property('fieldDescriptorArray');
      });
    });

    describe('Test JMAPS attached object _shp.', () => {
      const jmap = new JMAPS(path, db);

      it('Expects JMAPS object to have ._shp object attached.', () => {
        expect(jmap._shp).to.be.an('object');
      });

      it('Expects JMAPS object to have ._shp object with the property db.', () => {
        expect(jmap._shp).to.have.property('db');
      });

      it('Expects JMAPS object to have ._shp object with property header.', () => {
        expect(jmap._shp).to.have.property('header');
      });
    });

    describe('Test the method getFeature().', () => {
      const jmap = new JMAPS(path, db)
          , record = jmap.getFeature(1)
          ;
      let test
        ;

      it('Expects the method to return an object.', () => {
        expect(record).to.be.an('object');
      });

      it('Expects this object to have the property type that is equal to "Feature".', () => {
        expect(record).to.have.property('type').to.equal('Feature');
      });

      it('Expects this object to have the property properties that is an object.', () => {
        expect(record).to.have.property('properties').that.is.an('object');
      });

      it('Expects this object to have the property geometry that is an object.', () => {
        expect(record).to.have.property('geometry').that.is.an('object');
      });

      it(`Expects this object to have the property geometry.type that is equal to "${type}".`, () => {
        expect(record.geometry).to.have.property('type').to.equal(type);
      });

      it('Expects this object to have the property geometry.coordinates that is an array.', () => {
        expect(record.geometry).to.have.property('coordinates').that.is.a('array');
      });

      it('Expects a negative record number to throw an error.', () => {
        try {
          test = false;
          jmap.getFeature(-1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });

      it('Expects a non integer record number to throw an error.', () => {
        try {
          test = false;
          jmap.getFeature(1.1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });

      it('Expects a string record number to throw an error.', () => {
        try {
          test = false;
          jmap.getFeature('1');
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });

      it('Expects an out of range record number to throw an error.', () => {
        try {
          test = false;
          jmap.getFeature(jmap._dbf.header.numberOfRecords + 1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });
    });

    describe('Test the method getCollection().', () => {
      const jmap    = new JMAPS(path, db)
          , records = jmap.getCollection()
          ;

      it('Expects the method to return an object.', () => {
        expect(records).to.be.an('object');
      });

      it('Expects this object to have the property bbox that is an array.', () => {
        expect(records).to.have.property('bbox').that.is.an('array');
      });

      it('Expects this object to have the property type.', () => {
        expect(records).to.have.property('type');
      });

      it('Expects the property type to be equal to "FeatureCollection".', () => {
        expect(records.type).to.equal('FeatureCollection');
      });

      it('Expects this object to have the property features that is an array.', () => {
        expect(records).to.have.property('features').that.is.an('array');
      });

      it('expects the property features to be an array of objects.', () => {
        expect(records.features[0]).to.be.an('object');
      });

      it('Expects the property features to have objects with the property type equal to "Feature".', () => {
        expect(records.features[0]).to.have.property('type').to.equal('Feature');
      });

      it('Expects the property features to have objects with the property properties that is an object.', () => {
        expect(records.features[0]).to.have.property('properties').that.is.an('object');
      });

      it('Expects the property features to have objects with the property geometry that is an object.', () => {
        expect(records.features[0]).to.have.property('geometry').that.is.an('object');
      });

      it(`Expects the property features to have objects with the property geometry.type that is equal to "${type}"."`, () => {
        expect(records.features[0].geometry).to.have.property('type').to.equal(type);
      });

      it('Expects the property features to have objects with the property geometry.coordinates that is an array.', () => {
        expect(records.features[0].geometry).to.have.property('coordinates').that.is.an('array');
      });
    });
  });
};
