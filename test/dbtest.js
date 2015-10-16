/* global describe, it */
/* eslint  max-len: [1, 125, 2] */
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
    it('Checks that undefined path throws an error.', function() {
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

    it('Checks that undefined db name throws an error.', function() {
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

    it('Checks that wrong PATH throws an error.', function() {
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

    it('Checks that wrong DBNAME throws an error.', function() {
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

    it('Checks that new returns an object.', function() {
      expect(new JMAPS(path, db)).to.be.an('object');
    });

    describe('Test JMAPS attached object _dbf.', function() {
      var jmap = new JMAPS(path, db);

      it('Checks that created JMAPS object has ._dbf object attached.', function() {
        expect(jmap._dbf).to.be.an('object');
      });

      it('Checks that created JMAPS object has ._dbf object has property db.', function() {
        expect(jmap._dbf).to.have.property('db');
      });

      it('Checks that created JMAPS object has ._dbf object has property header.', function() {
        expect(jmap._dbf).to.have.property('header');
      });

      it('Checks that created JMAPS object has ._dbf object has property fieldDescriptorArray.', function() {
        expect(jmap._dbf).to.have.property('fieldDescriptorArray');
      });
    });

    describe('Test JMAPS attached object _shp.', function() {
      var jmap = new JMAPS(path, db);

      it('Checks that created JMAPS object has ._shp object attached.', function() {
        expect(jmap._shp).to.be.an('object');
      });

      it('Checks that created JMAPS object has ._shp object has property db.', function() {
        expect(jmap._shp).to.have.property('db');
      });

      it('Checks that created JMAPS object has ._shp object has property header.', function() {
        expect(jmap._shp).to.have.property('header');
      });
    });

    describe('Test the method getFeature().', function() {
      var jmap = new JMAPS(path, db)
        , record = jmap.getFeature(1)
        , test
        ;

      it('Checks that this method returns an object.', function() {
        expect(record).to.be.an('object');
      });

      it('Checks that this object has property type that is equal to "Feature".', function() {
        expect(record).to.have.property('type').to.equal('Feature');
      });

      it('Checks that this object has property properties that is an object.', function() {
        expect(record).to.have.property('properties').that.is.an('object');
      });

      it('Checks that this object has property geometry that is an object.', function() {
        expect(record).to.have.property('geometry').that.is.an('object');
      });

      it('Checks that this object has property geometry.type is equal to "' + type + '".', function() {
        expect(record.geometry).to.have.property('type').to.equal(type);
      });

      it('Checks that this object has property geometry.coordinates that is an array.', function() {
        expect(record.geometry).to.have.property('coordinates').that.is.a('array');
      });

      it('Checks that a negative record number throws an error.', function() {
        try {
          test = false;
          jmap.getFeature(-1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });

      it('Checks that a non integer record number throws an error.', function() {
        try {
          test = false;
          jmap.getFeature(1.1);
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });

      it('Checks that a string record number throws an error.', function() {
        try {
          test = false;
          jmap.getFeature('1');
        } catch (e) {
          test = true;
        }
        expect(test).to.be.true;
      });

      it('Checks that an out of range record number throws an error.', function() {
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

      it('Checks that this method returns an object.', function() {
        expect(records).to.be.an('object');
      });

      it('Checks that this object has property bbox that is an array.', function() {
        expect(records).to.have.property('bbox').that.is.an('array');
      });

      it('Checks that this object has property type.', function() {
        expect(records).to.have.property('type');
      });

      it('Check that this object type property is equal to "FeatureCollection".', function() {
        expect(records.type).to.equal('FeatureCollection');
      });

      it('Checks that this object has property features that is an array.', function() {
        expect(records).to.have.property('features').that.is.an('array');
      });

      it('Checks that the property features is an array of objects.', function() {
        expect(records.features[0]).to.be.an('object');
      });

      it('Checks that the property features has objects with property type equal to "Feature".', function() {
        expect(records.features[0]).to.have.property('type').to.equal('Feature');
      });

      it('Checks that the property features has objects with property properties that is an object.', function() {
        expect(records.features[0]).to.have.property('properties').that.is.an('object');
      });

      it('Checks that the property features has objects with property geometry that is an object.', function() {
        expect(records.features[0]).to.have.property('geometry').that.is.an('object');
      });

      it('Checks that the property features has objects with property geometry.type equal to "' + type + '".', function() {
        expect(records.features[0].geometry).to.have.property('type').to.equal(type);
      });

      it('Checks that the property features has objects with property geometry.coordinates that is an array.', function() {
        expect(records.features[0].geometry).to.have.property('coordinates').that.is.an('array');
      });
    });
  });
};
