// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */

'use strict';

// -- Vendor Modules
const { expect } = require('chai')
    ;


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main
module.exports = function(jMaps, path, db, type) {
  describe('Test jMaps Constructor:', () => {
    const jmap = jMaps();

    it('Expects the constructor to return an object.', () => {
      expect(jmap).to.be.an('object');
    });

    describe('Test the method load():', () => {
      it('Expects load to throw an error if the path is not valid.', () => {
        let result;

        try {
          result = false;
          jmap.load();
        } catch (e) {
          result = true;
        }
        expect(result).to.be.equal(true);
      });
    });

    describe('Test the method getFeature():', () => {
      const jm = jMaps();
      let test;

      jm.load(path, db);
      const record = jm.getFeature(1);

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
          jm.getFeature(-1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });

      it('Expects a non integer record number to throw an error.', () => {
        try {
          test = false;
          jm.getFeature(1.1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });

      it('Expects a string record number to throw an error.', () => {
        try {
          test = false;
          jm.getFeature('1');
        } catch (e) {
          test = true;
        }
        expect(test).to.be.equal(true);
      });
    });

    describe('Test the method getCollection():', () => {
      const jm = jMaps();

      jm.load(path, db);
      const records = jm.getCollection();

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
