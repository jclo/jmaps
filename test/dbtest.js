/* global describe, it */
/* eslint  max-len: [1, 140, 2], no-unused-expressions: 0, no-new: 0, no-underscore-dangle: 0 */

'use strict';

// -- Node modules
var expect = require('chai').expect
  ;

// -- Local modules
var JMAPS  = require('../index.js')
  ;

// -- Local constants

// -- Main
module.exports = function(path, db, type) {
  describe('Test JMAPS instantiation for ' + db + '.', function() {
    it('Expects the constructor to throw an error if the path is undefined.', function() {
      var test
        ;

      try {
        test = false;
        new JMAPS();
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects it to throw an error if the db name is undefined.', function() {
      var test
        ;

      try {
        test = false;
        new JMAPS(path);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects it to throw an error for a wrong PATH.', function() {
      var test
        ;

      try {
        test = false;
        new JMAPS(path + 's', db);
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects it to throw an error for a wrong DBNAME.', function() {
      var test
        ;

      try {
        test = false;
        new JMAPS(path, db + 's');
      } catch (e) {
        test = true;
      }
      expect(test).to.be.true;
    });

    it('Expects it to return an object.', function() {
      expect(new JMAPS(path, db)).to.be.an('object');
    });

    describe('Test JMAPS attached object _dbf.', function() {
      var jmap = new JMAPS(path, db);

      it('Expects the JMAPS object to have ._dbf object attached.', function() {
        expect(jmap._dbf).to.be.an('object');
      });

      it('Expects the JMAPS object to have ._dbf object with the property db.', function() {
        expect(jmap._dbf).to.have.property('db');
      });

      it('Expects JMAPS object to have ._dbf object with the property header.', function() {
        expect(jmap._dbf).to.have.property('header');
      });

      it('Expects JMAPS object to have ._dbf object with property fieldDescriptorArray.', function() {
        expect(jmap._dbf).to.have.property('fieldDescriptorArray');
      });
    });

    describe('Test JMAPS attached object _shp.', function() {
      var jmap = new JMAPS(path, db);

      it('Expects JMAPS object to have ._shp object attached.', function() {
        expect(jmap._shp).to.be.an('object');
      });

      it('Expects JMAPS object to have ._shp object with the property db.', function() {
        expect(jmap._shp).to.have.property('db');
      });

      it('Expects JMAPS object to have ._shp object with property header.', function() {
        expect(jmap._shp).to.have.property('header');
      });
    });

    describe('Test the method getFeature().', function() {
      var jmap = new JMAPS(path, db)
        , record = jmap.getFeature(1)
        , test
        ;

      it('Expects the method to return an object.', function() {
        expect(record).to.be.an('object');
      });

      it('Expects this object to have the property type that is equal to "Feature".', function() {
        expect(record).to.have.property('type').to.equal('Feature');
      });

      it('Expects this object to have the property properties that is an object.', function() {
        expect(record).to.have.property('properties').that.is.an('object');
      });

      it('Expects this object to have the property geometry that is an object.', function() {
        expect(record).to.have.property('geometry').that.is.an('object');
      });

      it('Expects this object to have the property geometry.type that is equal to "' + type + '".', function() {
        expect(record.geometry).to.have.property('type').to.equal(type);
      });

      it('Expects this object to have the property geometry.coordinates that is an array.', function() {
        expect(record.geometry).to.have.property('coordinates').that.is.a('array');
      });

      it('Expects a negative record number to throw an error.', function() {
        try {
          test = false;
          jmap.getFeature(-1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });

      it('Expects a non integer record number to throw an error.', function() {
        try {
          test = false;
          jmap.getFeature(1.1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });

      it('Expects a string record number to throw an error.', function() {
        try {
          test = false;
          jmap.getFeature('1');
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });

      it('Expects an out of range record number to throw an error.', function() {
        try {
          test = false;
          jmap.getFeature(jmap._dbf.header.numberOfRecords + 1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });
    });

    describe('Test the method getCollection().', function() {
      var jmap = new JMAPS(path, db)
        , records = jmap.getCollection()
        ;

      it('Expects the method to return an object.', function() {
        expect(records).to.be.an('object');
      });

      it('Expects this object to have the property bbox that is an array.', function() {
        expect(records).to.have.property('bbox').that.is.an('array');
      });

      it('Expects this object to have the property type.', function() {
        expect(records).to.have.property('type');
      });

      it('Expects the property type to be equal to "FeatureCollection".', function() {
        expect(records.type).to.equal('FeatureCollection');
      });

      it('Expects this object to have the property features that is an array.', function() {
        expect(records).to.have.property('features').that.is.an('array');
      });

      it('expects the property features to be an array of objects.', function() {
        expect(records.features[0]).to.be.an('object');
      });

      it('Expects the property features to have objects with the property type equal to "Feature".', function() {
        expect(records.features[0]).to.have.property('type').to.equal('Feature');
      });

      it('Expects the property features to have objects with the property properties that is an object.', function() {
        expect(records.features[0]).to.have.property('properties').that.is.an('object');
      });

      it('Expects the property features to have objects with the property geometry that is an object.', function() {
        expect(records.features[0]).to.have.property('geometry').that.is.an('object');
      });

      it('Expects the property features to have objects with the property geometry.type that is equal to "' + type + '".', function() {
        expect(records.features[0].geometry).to.have.property('type').to.equal(type);
      });

      it('Expects the property features to have objects with the property geometry.coordinates that is an array.', function() {
        expect(records.features[0].geometry).to.have.property('coordinates').that.is.an('array');
      });
    });
  });
};
