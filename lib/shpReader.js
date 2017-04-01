/* global  */
/* eslint one-var: 0, no-underscore-dangle: 0, no-param-reassign: 0 */

// -- Node modules

// -- Local modules

// -- Local constants
const RECORD_START = 100
    , RECORD_HEAD = 8
    ;

// -- Local variables


/**
 * This library reads the records of a shapefile.
 *
 * Shapefile Format description:
 *  - http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf
 *
 * In brief:
 *
 *  -----------------------------
 * |  File Header (100 bytes)    |
 * |                             |
 *  -----------------------------
 * |  Record Header (8 bytes)    |
 *  -----------------------------
 * |  Record contents (variable) |
 *  -----------------------------
 * |                             |
 * |                             |
 *  -----------------------------
 * |  Record Header (8 bytes)    |
 *  -----------------------------
 * |  Record contents (variable) |
 *  -----------------------------
 *
 *
 * @namespace  _shp
 * @author     jclo
 * @since      0.0.1
 */
const _shp = {

  /**
   * Reads database header and attaches it to this.
   *
   * @function(_this, shp)
   * @public
   * @param {Object}    This,
   * @param {Buffer}    The content of .shp file,
   * @returns           -,
   */
  init(_this, shp) {
    _this._shp = {
      db: shp,
      header: undefined,
    };

    // Retrieve the header.
    _this._shp.header = _shp._retrieveHeader(_this._shp.db);
  },

  /**
   * Reads a record or all the records if record number is undefined.
   *
   * @function(shp, number)
   * @public
   * @param {Object}    The shp structure,
   * @param {Number}    The record number,
   * @returns {Object}  The record object,
   */
  getRecord(shp, number) {
    // Extract all the records.
    const records = _shp._extractRecords(shp.db, shp.header);

    // If the record number is undefined, return all the records.
    if (!number) {
      return records;
    }

    // Check that this record number isn't fantaisist!
    if (number % 1 !== 0 || number < 1) {
      /* istanbul ignore next */
      throw new Error(`This record number "${number}" does not match!`);
    }

    // Return the requested record or null if it is out of range.
    if (records[number - 1]) {
      return records[number - 1];
    }

    /* istanbul ignore next */
    return null;
  },

  /**
   * Returns the db header.
   *
   * @function(db)
   * @private
   * @param {Buffer}    The shp database,
   * @returns {Object}  The db header,
   * @throws {Object}   Throws an error if the header contains unsupported
   *                    params,
   */
  _retrieveHeader(db) {
    const header = {
      code: db.readUInt32BE(0),
      byte4: 'Unused',
      byte8: 'Unused',
      byte12: 'Unused',
      byte16: 'Unused',
      byte20: 'Unused',
      fileLength: db.readUInt32BE(24) * 2,  // File length
      version: db.readUInt32LE(28),         // SHP version
      shape: db.readUInt32LE(32),           // shape type
      Xmin: db.readDoubleLE(36),
      Ymin: db.readDoubleLE(44),
      Xmax: db.readDoubleLE(52),
      Ymax: db.readDoubleLE(60),
      Zmin: db.readDoubleLE(68),
      Zmax: db.readDoubleLE(76),
      Mmin: db.readDoubleLE(84),
      Mmax: db.readDoubleLE(92),
    };

    // Check if file starts with pattern '9994'.
    if (header.code !== 9994) {
      /* istanbul ignore next */
      throw new Error(`This is not a SHP file! The first four bytes are: "${header.code}" instead of "9994"`);
    }

    // Check if 'Z' is equal to zero
    if (header.Zmin !== 0 || header.Zmax !== 0) {
      /* istanbul ignore next */
      throw new Error('SHP files with Z type != zero are not supported!');
    }

    // Check if 'M' is equal to zero
    if (header.Mmin !== 0 || header.Mmax !== 0) {
      /* istanbul ignore next */
      throw new Error('SHP files with points having M Measure are not supported!');
    }

    return header;
  },

  /**
   * Returns the coordinates of the decoded Point.
   *
   * @function(db, offset)
   * @private
   * @param {Buffer}    The shp database,
   * @param {Number}    The position of the polyline/polygon in the db,
   * @returns {Array}   The point coordinates [latitude, longitude],
   */
  _retrievePoint(db, offset) {
    // Order like this: [latitude, longitude].
    return [
      db.readDoubleLE(offset + RECORD_HEAD + 12),
      db.readDoubleLE(offset + RECORD_HEAD + 4),
    ];
  },

  /**
   * Returns the coordinates of the decoded PolyLine or Polygon.
   *
   * @function(db, offset)
   * @private
   * @param {Buffer}    The shp database,
   * @param {Number}    The position of the polyline/polygon in the db,
   * @returns {Array}   The polyline/polygon coordinates [[latitude, longitude]],
   */
  _retrievePolyLine(db, offset) {
    const record = []
      ;
    let first
      , last
      , coord
      , i
      , j
      ;

    // PolyLine and Polygon structure.
    const polyline = {
      // Bounding boxes.
      Xmin: db.readDoubleLE(offset + RECORD_HEAD + 4),
      Ymin: db.readDoubleLE(offset + RECORD_HEAD + 12),
      Xmax: db.readDoubleLE(offset + RECORD_HEAD + 20),
      Ymax: db.readDoubleLE(offset + RECORD_HEAD + 28),
      // The number of parts in the PolyLine.
      numParts: db.readUInt32LE(offset + RECORD_HEAD + 36),
      // The total number of points for all the parts.
      numPoints: db.readUInt32LE(offset + RECORD_HEAD + 40),
      // Index to the first point in Part.
      parts: db.readUInt32LE(offset + RECORD_HEAD + 44),
      // An array of length NumPoints. The points for each part in the
      // PolyLine are stored end to end.
      points: 0,
    };

    // Compute the position of the first point. It is:
    // offset + RECORD_HEAD + 44 bytes + 4 * numparts.
    const P0 = offset + RECORD_HEAD + 44 + (4 * polyline.numParts);

    // Process all the parts.
    for (i = 0; i < polyline.numParts; i++) {
      // Compute the position of the first point in the given part.
      first = db.readUInt32LE(offset + RECORD_HEAD + 44 + (i * 4));
      // Compute the position of the last point in the given part.
      if (i + 1 < polyline.numParts) {
        last = db.readUInt32LE(offset + RECORD_HEAD + 44 + ((i + 1) * 4)) - 1;
      } else {
        last = polyline.numPoints - 1;
      }

      // Extract all coord. for one part or one ring.
      // Order like this: [latitude, longitude].
      coord = [];
      for (j = first; j <= last; j++) {
        coord[j - first] = [
          db.readDoubleLE(P0 + (16 * j) + 8),
          db.readDoubleLE(P0 + (16 * j)),
        ];
      }
      record.push(coord);
    }

    // Return the set of coordinates that are stored in
    // array of arrays (one array per part or ring).
    return record;
  },

  /**
   * Extracts all the records.
   *
   * @function(db, header)
   * @private
   * @param {Buffer}    The shp database,
   * @param {Object}    The db header,
   * @returns {Array}   The records found in the db,
   */
  _extractRecords(db, header) {
    const record = []
      ;
    let offset = RECORD_START
      , i
      ;

    // Parse records.
    for (i = 0; offset < header.fileLength; i++) {
      record[i] = {
        recordNumber: db.readUInt32BE(offset),
        contentLength: db.readUInt32BE(offset + 4),
        shape: db.readUInt32LE(offset + RECORD_HEAD),
        type: '',
        coordinates: [],
      };

      // Process shape
      switch (record[i].shape) {

        // Type Null Shape
        /* istanbul ignore next */
        case 0:
          throw new Error('The Shape Type "Null Shape" is not supported yet!');

        // Type Point
        case 1:
          record[i].type = 'Point';
          record[i].coordinates = _shp._retrievePoint(db, offset);
          break;

        // Type PolyLine
        case 3:
          record[i].type = 'PolyLine';
          record[i].coordinates = _shp._retrievePolyLine(db, offset);
          break;

        // Type Polygon
        case 5:
          record[i].type = 'Polygon';
          record[i].coordinates = _shp._retrievePolyLine(db, offset);
          break;

        // Type MultiPoint
        /* istanbul ignore next */
        case 8:
          throw new Error('The Shape Type "MultiPoint" is not supported yet!');

        // Type PointZ
        /* istanbul ignore next */
        case 11:
          throw new Error('The Shape Type "PointZ" is not supported yet!');

        // Type PolyLineZ
        /* istanbul ignore next */
        case 13:
          throw new Error('The Shape Type "PolyLineZ" is not supported yet!');

        // Type PolygonZ
        /* istanbul ignore next */
        case 15:
          throw new Error('The Shape Type "PolygonZ" is not supported yet!');

        // Type MultiPointZ
        /* istanbul ignore next */
        case 18:
          throw new Error('The Shape Type "MultiPointZ" is not supported yet!');

        // Type PointM
        /* istanbul ignore next */
        case 21:
          throw new Error('The Shape Type "PointM" is not supported yet!');

        // Type PolyLineM
        /* istanbul ignore next */
        case 23:
          throw new Error('The Shape Type "PolyLineM" is not supported yet!');

        // Type PolygonM
        /* istanbul ignore next */
        case 25:
          throw new Error('The Shape Type "PolygonM" is not supported yet!');

        // Type MultiPointM
        /* istanbul ignore next */
        case 28:
          throw new Error('The Shape Type "MultiPointM" is not supported yet!');

        // Type MultiPatch
        /* istanbul ignore next */
        case 31:
          throw new Error('The Shape Type "MultiPatch" is not supported yet!');

        // Unknown type
        /* istanbul ignore next */
        default:
          throw new Error(`The Shape Type "${record[i].shape}" is unknown!`);
      }

      // Increment offset to next record
      offset += (record[i].contentLength * 2) + RECORD_HEAD;
    }

    // Returns all the records in the db.
    return record;
  },
};

module.exports = _shp;
