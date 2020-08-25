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
module.exports = function(jMaps, libname, version) {
  describe('jMaps introspection:', () => {
    describe('Test the nature of jMaps:', () => {
      it('Expects jMaps to be a function.', () => {
        expect(jMaps).to.be.a('function');
      });

      it('Expects jMaps to own 3 custom properties.', () => {
        expect(Object.keys(jMaps)).to.be.an('array').that.has.lengthOf(3);
      });

      describe('Check the owned generic custom properties:', () => {
        it(`Expects jMaps to own the property "NAME" whose value is "${libname}".`, () => {
          expect(jMaps).to.own.property('NAME').that.is.equal(libname);
        });

        it(`Expects jMaps to own the property "VERSION" whose value is "${version}".`, () => {
          expect(jMaps).to.own.property('VERSION');
        });

        it('Expects jMaps to own the property "_setTestMode" that is a function.', () => {
          expect(jMaps).to.own.property('_setTestMode').that.is.a('function');
        });

        // it('Expects jMaps to own the property "noConflict" that is a function.', () => {
        //   expect(jMaps).to.own.property('noConflict').that.is.a('function');
        // });

        describe('Test the owned generic custom properties:', () => {
          it('Expects the property "_setTestMode" to return an array with 1 item.', () => {
            expect(jMaps._setTestMode()).to.be.an('array').that.has.lengthOf(1);
          });

          it('Expects this item to be an object.', () => {
            expect(jMaps._setTestMode()[0]).to.be.an('object');
          });


          // it('Expects the property "noConflict" to return a function.', () => {
          //   expect(jMaps.noConflict()).to.be.a('function');
          // });
        });
      });
    });

    describe('Test jMaps constructor:', () => {
      const o = jMaps();
      const op = Object.getOwnPropertyNames(o);
      const io = Object.keys(Object.getPrototypeOf(o));

      it('Expects the function jMaps to return an object.', () => {
        expect(o).to.be.an('object');
      });

      it('Expects jMaps object to own 2 properties.', () => {
        expect(op).to.be.an('array').that.has.lengthOf(2);
      });

      it('Expects jMaps object to inherit 6 properties.', () => {
        expect(io).to.be.an('array').that.has.lengthOf(6);
      });

      describe('Check the owned generic properties:', () => {
        it('Expects jMaps object to own the property "_library" that is an object.', () => {
          expect(o).to.own.property('_library').that.is.an('object');
        });

        it('Expects jMaps object to own the property "_shp" that is an object.', () => {
          expect(o).to.own.property('_shp').that.is.an('object');
        });

        describe('Test the owned generic properties:', () => {
          it('Expects the property "_library" to own two properties.', () => {
            expect(Object.keys(o.whoami())).to.be.an('array').that.has.lengthOf(2);
          });
          it(`Expects the property "_library" to own the property "name" whose value is "${libname}".`, () => {
            expect(o.whoami()).to.own.property('name').that.is.equal(libname);
          });
          it(`Expects the property "_library" to own the property "version" whose value is "${version}".`, () => {
            expect(o.whoami()).to.own.property('version').that.is.equal(version);
          });

          // it('Expects the property "_shp" to own two properties.', () => {
          //   expect(Object.keys(o._shp.whoami())).to.be.an('array').that.has.lengthOf(2);
          // });
        });
      });

      describe('Check the inherited generic properties:', () => {
        it('Expects jMaps object to inherit the property "whoami" that is a function.', () => {
          expect(o).to.have.property('whoami').that.is.a('function');
        });

        describe('Test the inherited generic properties:', () => {
          it('Expects the property "whoami" to return an object.', () => {
            expect(o.whoami()).to.be.an('object');
          });
          it('Expects this object to own two properties.', () => {
            expect(Object.keys(o.whoami())).to.be.an('array').that.has.lengthOf(2);
          });
          it(`Expects this object to own the property "name" whose value is "${libname}".`, () => {
            expect(o.whoami()).to.own.property('name').that.is.equal(libname);
          });
          it(`Expects this object to own the property "version" whose value is "${version}".`, () => {
            expect(o.whoami()).to.own.property('version').that.is.equal(version);
          });
        });
      });

      describe('Check the owned specific properties:', () => {
        // none,
        describe('Test the owned specific properties:', () => {
          // none,
        });
      });

      describe('Check the inherited specific properties:', () => {
        it('Expects jMaps object to inherit the property "load" that is a function.', () => {
          expect(o).to.have.property('load').that.is.a('function');
        });

        it('Expects jMaps object to inherit the property "getCollection" that is a function.', () => {
          expect(o).to.have.property('getCollection').that.is.a('function');
        });

        it('Expects jMaps object to inherit the property "getFeature" that is a function.', () => {
          expect(o).to.have.property('getFeature').that.is.a('function');
        });

        it('Expects jMaps object to inherit the property "transform" that is a function.', () => {
          expect(o).to.have.property('transform').that.is.a('function');
        });

        it('Expects jMaps object to inherit the property "toSVG" that is a function.', () => {
          expect(o).to.have.property('toSVG').that.is.a('function');
        });

        describe('Test the inherited specific properties:', () => {
          // it('Expects the property "getString" to return the string "I am a string!".', () => {
          //   expect(o.getString()).to.be.a('string').that.is.equal('I am a string!');
          // });
        });
      });
    });
  });
};
