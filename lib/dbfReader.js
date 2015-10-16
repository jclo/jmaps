/* global  */
/* eslint curly: 0, camelcase: 0, max-len: [1, 135, 2] */
'use strict';

// -- Node modules

// -- Local modules

// -- Local constants

// -- Local variables

/**
 * This library reads the records of Natural Earth's dbf files. dbf files are
 * structured as a dBASE III Plus file version 03h (without a memo).
 *
 * dBase file format description can be found here:
 *   - http://www.oocities.org/geoff_wass/dBASE/GaryWhite/dBASE/FAQ/qformt.htm
 *   - http://ulisse.elettra.trieste.it/services/doc/dbase/DBFstruct.htm
 *
 * @namespace  _dbf
 * @author     jclo
 * @since      0.0.1
 */

/* istanbul ignore next */
var _dbf = function() {};

_dbf = {

  /**
   * Reads database header and field descriptor array and attaches these
   * parameters to this.
   *
   * @function(_this, dbf)
   * @public
   * @param {Object}    This,
   * @param {Buffer}    The content of .dbf file,
   * @returns           -,
   */
  init: function(_this, dbf) {
    _this._dbf = {
      db: dbf,
      header: undefined,
      fieldDescriptorArray: undefined
    };

    // Retrieve the header.
    _this._dbf.header = _dbf._retrieveHeader(_this._dbf.db);
    // Retrieve the field descriptor array.
    _this._dbf.fieldDescriptorArray = _dbf._retrieveFieldDescriptorArray(_this._dbf.db, _this._dbf.header);
  },

  /**
   * Reads a record or all the records if record number is undefined.
   *
   * @function(dbf, number)
   * @public
   * @param {Object}    The dbf structure,
   * @param {Number}    The record number,
   * @returns {Object}  The record object,
   */
  getRecord: function(dbf, number) {
    var record = [];

    if (number === undefined) {
      // Return all the records
      for (var i = 0; i < dbf.header.numberOfRecords; i++) {
        record[i] = _dbf._retrieveRecord(dbf.db, dbf.header, dbf.fieldDescriptorArray, i);
      }
      return record;
    }

    // Check that this record number is an integer and in the range.
    if (number % 1 === 0 && number > 0 && number <= dbf.header.numberOfRecords) {
      // Return the requested record.
      record = _dbf._retrieveRecord(dbf.db, dbf.header, dbf.fieldDescriptorArray, number - 1);
      return record;
    } else {
      // Record out or range.
      /* istanbul ignore next */
      return null;
    }
  },

  /**
   * Returns the db header.
   *
   * @function(db)
   * @private
   * @param {Buffer}    The dbf database,
   * @returns {Object}  The db header,
   */
  _retrieveHeader: function(db) {
    var header
      ;

    header = {
      dbaseVersion: db.readUInt8(0),
      numberOfRecords: db.readUInt32LE(4),
      numberOfBytesInHeader: db.readUInt16LE(8),
      numberOfBytesInRecord: db.readUInt16LE(10),
      bytes12_14: 'Reserved bytes.',
      bytes15_27: 'Reserved for dBASE III PLUS on a LAN.',
      bytes28_31: 'Reserved bytes.',
      bytes32_n: 'Field Descriptor Array',
      terminator: '0x0D stored as the Field Descriptor terminator.',
      // Additional info
      numberOfFieldsArray: 0,
      startRecordSection: 0
    };

    // Compute the number of Field Descriptor Arrays.
    header.numberOfFieldsArray = (header.numberOfBytesInHeader - 1) / 32 - 1;
    // Compute address of record section
    header.startRecordSection = header.numberOfBytesInHeader;

    return header;
  },

  /**
   * Returns the db field descriptor array.
   *
   * @function(_this, header)
   * @private
   * @param {Buffer}    The dbf database,
   * @param {Object}    The db header,
   * @returns {Object}  Returns the Field Descriptor Array,
   * @throws {Object}   Throws an error if terminator not found,
   */
  _retrieveFieldDescriptorArray: function(db, header) {
    var field  = []
      , buffer = new Buffer(32)
      , offset = 32
      , i
      ;

    // Parse all Field Descriptor Arrays.
    for (i = 0; i < header.numberOfFieldsArray; i++) {
      field[i] = {};
      // Read the Table Field Descriptor Array.
      db.copy(buffer, 0, offset, offset + 32);
      // Extract data
      field[i]['name'] = buffer.toString('utf8', 0, 11).replace(/\u0000/g, ''); //.replace(/[^A-Za-z0-9]/g, '');
      field[i]['type'] = String.fromCharCode(buffer.readUInt8(11));
      field[i]['dataAddress'] = buffer.readUInt32LE(12);
      field[i]['length'] = buffer.readUInt8(16);
      field[i]['count'] = buffer.readUInt8(17);
      field[i]['workArreaID'] = buffer.readUInt8(20);
      field[i]['flag'] = buffer.readUInt8(23);
      offset += 32;
    }

    // Throws an error if Field Descriptor Terminator not found.
    if (db.readUInt8(offset) !== 0x0D) {
      /* istanbul ignore next */
      throw new Error('Field Descriptor terminator 0x0D not found!');
    }
    return field;
  },

  /**
   * Returns the record.
   *
   * @function(db, header, fieldDescriptorArray, number)
   * @private
   * @param {Buffer}    The dbf database,
   * @param {Object}    The db header,
   * @param {Object}    The Field Descript Array,
   * @param {Number}    The record number,
   * @returns {Object}  Returns the record,
   * @throws {Object}   Throws an error if the type is not supported or unknown,
   */
  _retrieveRecord: function(db, header, fieldDescriptorArray, number) {
    var record = {}
    , buffer
    , offset = header.startRecordSection + header.numberOfBytesInRecord * number
    , i
    ;

    // Check that the first record byte is:
    //   0x20: if the record is not deleted,
    //   0x2A: if the record is deleted.
    if (db.readUInt8(offset) !== 0x20 && db.readUInt8(offset) !== 0x2A)
      /* istanbul ignore next */
      throw new Error('The first byte of the record should be "0x20" or "0x2A" instead of: ' + db.readUInt8(offset).toString(16));

    // Process the record
    offset += 1;
    for (i = 0; i < header.numberOfFieldsArray; i++) {
      buffer = new Buffer(fieldDescriptorArray[i].length);
      db.copy(buffer, 0, offset, offset + fieldDescriptorArray[i].length);

      // Decode and process Data Type
      switch (fieldDescriptorArray[i].type) {

        // Type Character
        case 'C':
          // Remove leading and trailing spaces.
          record[fieldDescriptorArray[i].name] = buffer.toString().replace(/^\s+|\s+$/g,'');
          break;

        // Type Date
        /* istanbul ignore next */
        case 'D':
          throw new Error('Field Data Type "D" not processed yet!');

        // Type Binary coded decimal numeric
        case 'N':
          // Remove leading and trailing spaces and convert string to Number.
          record[fieldDescriptorArray[i].name] = parseInt(buffer.toString().replace(/^\s+|\s+$/g,''), 10);
          break;

        // Type Floating point binary numeric
        case 'F':
          record[fieldDescriptorArray[i].name] = parseFloat(buffer.toString());
          break;

        // Type Logical
        /* istanbul ignore next */
        case 'L':
          throw new Error('Field Data Type "L" not processed yet!');

        // Type Memo
        /* istanbul ignore next */
        case 'M':
          throw new Error('Field Data Type "M" not processed yet!');

        /* istanbul ignore next */
        default:
          throw new Error('Field Data Type ' + fieldDescriptorArray[i].type + ' not supported!');
      }

      offset += fieldDescriptorArray[i].length;
    }

    //  Return the decoded record.
    return record;
  }
};

module.exports = _dbf;
