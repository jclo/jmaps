/* eslint one-var: 0, semi-style: 0 */

'use strict';

// -- Vendor Modules
const connect = require('gulp-connect')
    , open    = require('open')
    ;


// -- Local Constants


// -- Local Variables


// -- Gulp Private Tasks


// -- Gulp connect dev
function devserver(done) {
  connect.server({
    host: '0.0.0.0', // (allows remote access)
    root: './',
    port: 8888,
    livereload: true,
  });
  open('http://localhost:8888/');
  done();
}

// -- Gulp connect prod
function appserver(done) {
  connect.server({
    host: '0.0.0.0', // (allows remote access)
    root: './_dist',
    port: 8889,
    livereload: true,
  });
  open('http://localhost:8889/');
  done();
}


// Gulp Public Tasks:
exports.rundev = devserver;
exports.runapp = appserver;
