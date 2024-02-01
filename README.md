# jMaps

[![NPM version][npm-image]][npm-url]
[![GitHub last commit][commit-image]][commit-url]
[![Github workflow][ci-image]][ci-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![License][license-image]](LICENSE.md)

jMaps is a light Javascript API for reading [Natural Earth](http://www.naturalearthdata.com)'s DB files. jMaps provides methods to extract data from the database and creates GeoJSON and XML SVG outputs.

## Usage

### Extract data and create a GeoJSON object

```
var jMaps = require('jmaps');

// Create the object
const jmap = jMaps();

// Load the Natural Earth database:
jmap.load('<path>, <ne_110m_admin_0_countries>')

// Get a collection of maps (FeatureCollection)
const maps = jmap.getCollection();

// Get a map (Feature)
const map = jmap.getFeature('feature number');
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
const fs = require('fs');
const jMaps = require('jmaps');

const jmap = jMaps();
jmap.load('<path>, <ne_110m_admin_0_countries>')

// Transform the longitudes and latitudes, from a collection, to x, y plane coordinates
const map = jmap.transform({scale: 1, projection: 'mercator', mirror: 'x'});

// Create a File stream
const fd = fs.createWriteStream('path/to/svg/file', {flags: 'w'});

// Fill the write stream
jmap.toSVG(map, fs);
```

It creates an XML file that looks like:

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g transform="translate(0, 0) scale(1, 1)">
    <path id="" class="land" d="...."></path>
  </g>
</svg>
```

A `Feature` produces an XML SVG file with one `path` while a `FeatureCollection` produces an XML SVG file with a multitude of `paths`.

You can enrich your XML files with information extracted from the property `properties` of a `Feature` object.

## API

This module implements four methods:

 * getFeature(`feature number`),
 * getCollection(),
 * transform(`options`),
 * toSVG(`GeoJSON object`, `write file stream`).


### getFeature(n)

This method extracts one `Feature` from `Natural Earth`'s database and returns a Javascript GeoJSON object.

This method requires one argument. Its is a `number` - the Feature number. It starts from 1.


### getCollection()

This method extracts a `FeatureCollection` from `Natural Earth`'s database and returns a Javascript GeoJSON object. A `FeatureCollection` is a set of `Feature`.


### transform(options)

This methods converts the longitude and latitude coordinates of the GeoJSON object to x, y plane coordinates. It returns the transformed Javascript GeoJSON object.

This methods extracts a collection from the loaded database, converts it and returns the converted GeoJSON object.

The `options` argument is optional. If nothing is provided, the default options are:

```
{ scale: 1, projection: none, mirror: 'none' }
```

`scale` can be any number from 1 to 'infinity'.

`projection` can be `none` or `mercator`.

`mirror` can be `none`, `x`, `y`, `xy`.


### toSVG(GeoJSON, fd)

This method generates XML SVG data from a collection or a transformed collection.

This method requires two arguments. A `GeoJSON` object (collection) and `fd`, a file write stream handler.


## License

[MIT](LICENSE.md).

<!--- URls -->

[npm-image]: https://img.shields.io/npm/v/jmaps.svg?style=flat-square
[release-image]: https://img.shields.io/github/release/jclo/jmaps.svg?include_prereleases&style=flat-square
[commit-image]: https://img.shields.io/github/last-commit/jclo/jmaps.svg?style=flat-square
[ci-image]: https://github.com/jclo/jmaps/actions/workflows/ci.yml/badge.svg
[coveralls-image]: https://img.shields.io/coveralls/jclo/jmaps/master.svg?style=flat-square
[npm-bundle-size-image]: https://img.shields.io/bundlephobia/minzip/jmaps.svg?style=flat-square
[license-image]: https://img.shields.io/npm/l/jmaps.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/jmaps
[release-url]: https://github.com/jclo/jmaps/tags
[commit-url]: https://github.com/jclo/jmaps/commits/master
[ci-url]: https://github.com/jclo/jmaps/actions/workflows/ci.yml
[coveralls-url]: https://coveralls.io/github/jclo/jmaps?branch=master
[npm-bundle-size-url]: https://img.shields.io/bundlephobia/minzip/jmaps
[license-url]: http://opensource.org/licenses/MIT
