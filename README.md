# jMaps

[![NPM version][npm-image]][npm-url]
[![Travis CI][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies status][dependencies-image]][dependencies-url]
[![Dev Dependencies status][devdependencies-image]][devdependencies-url]
[![License][license-image]](LICENSE.md)

[![NPM install][npm-install-image]][npm-install-url]

jMaps is a light Javascript API for reading [Natural Earth](http://www.naturalearthdata.com)'s DB files. jMaps provides methods to extract data from the database and creates GeoJSON and XML SVG outputs.

## Usage

### Extract data and create a GeoJSON object

```
var JMAPS = require('jmaps');

// Create an object
var jmap = new JMAPS('path/to/database', 'database_name');

// Get a collection of maps (FeatureCollection)
var maps = jmap.getCollection();

// Get a map (Feature)
var map = jmap.getFeature('feature number');
```

The `GeoJSON` object looks like:

```
{ 
  bbox: [ ... ],
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: [Object], geometry: [Object] },
    ...
    { type: 'Feature', properties: [Object], geometry: [Object] }
  ]
}
```

A `Feature` looks like:

```
{ 
  type: 'Feature',
  properties: { ... },
  geometry : {
    type: 'Polygon'
    coordinates: [ ... ]
  }
```

**Nota**:

A `Natural Earth`'s database is a folder that contains, at least, two files having the same name as the folder and with the suffix `.dbf` and `.shp`. For instance, `Natural Earth`'s database `ne_50m_admin_0_countries` must contains the two files: `ne_50m_admin_0_countries.dbf` and `ne_50m_admin_0_countries.shp`.


### Create an XML SVG file

```
var JMAPS = require('jmaps');

var jmap = new JMAPS('path/to/database', 'database_name');
var collection = jmap.getCollection();
var feature = jmap.getFeature('feature number');

// Transform longitudes and latitudes to x, y plane coordinates
var map = jmap.transform(feature, {scale: 1, projection: 'mercator', mirror: 'x'});

// Create a File stream
var fd = fs.createWriteStream('path/to/svg/file', {flags: 'w'});

// Fill the write stream
jmap.toSVG(fd, map);
```

It creates an XML file that looks like:

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g transform="translate(0, 0) scale(1, 1)">
    <path id="" class="land" d="...."></path>
  </g>
</svg>
```

A `Feature` produces an XML SVG file with one `path` while a `FeatureCollection` produces an XML SVG file with a multitude of `path`.

You can enrich your XML files with information extracted from the property `properties` of a `Feature` object.

## API

This module implements four methods:

 * getFeature(`feature number`),
 * getCollection(),
 * transform(`GeoJSON object`, `options`),
 * toSVG(`write file stream`, `Transformed GeoJSON object`).


### getFeature(n)

This method extracts one `Feature` from `Natural Earth`'s database and returns a Javascript GeoJSON object.

This method requires one argument. Its is a `number` - the Feature number. It starts from 1.


### getCollection()

This method extracts a `FeatureCollection` from `Natural Earth`'s database and returns a Javascript GeoJSON object. A `FeatureCollection` is a set of `Feature`.


### transform(GeoJSON, options)

This methods converts the longitude and latitude coordinates of the GeoJSON object to x, y plane coordinates. It returns the transformed Javascript GeoJSON object.

This method needs the GeoJSON object as the first argument. The `options` argument is optional. If nothing is provided, the default options are:

```
{ scale: 1, projection: none, mirror: 'none' } 
```

`scale` can be any number from 1 to 'infinity'.

`projection` can be `none` or `mercator`.

`mirror` can be `none`, `x`, `y`, `xy`.


### toSVG(fd, GeoJSON)

This method generates XML SVG data from the transformed GeoJSON object.

This method requires two arguments. `fd`, a file write stream handler, and a `GeoJSON` object with x, y plane coordinates.


## License

[MIT](LICENSE.md).

<!--- URls -->

[npm-image]: https://img.shields.io/npm/v/jmaps.svg?style=flat-square
[npm-install-image]: https://nodei.co/npm/jmaps.png?compact=true
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[download-image]: https://img.shields.io/npm/dm/jmaps.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/jclo/jmaps.svg?style=flat-square
[coveralls-image]: https://img.shields.io/coveralls/jclo/jmaps/master.svg?style=flat-square
[dependencies-image]: https://david-dm.org/jclo/jmaps/status.svg?theme=shields.io
[devdependencies-image]: https://david-dm.org/jclo/jmaps/dev-status.svg?theme=shields.io
[license-image]: https://img.shields.io/npm/l/jmaps.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/jmaps
[npm-install-url]: https://nodei.co/npm/jmaps
[node-url]: http://nodejs.org/download
[download-url]: https://www.npmjs.com/package/jmaps
[travis-url]: https://travis-ci.org/jclo/jmaps
[coveralls-url]: https://coveralls.io/github/jclo/jmaps?branch=master
[dependencies-url]: https://david-dm.org/jclo/jmaps#info=dependencies
[devdependencies-url]: https://david-dm.org/jclo/jmaps#info=devDependencies
[license-url]: http://opensource.org/licenses/MIT
