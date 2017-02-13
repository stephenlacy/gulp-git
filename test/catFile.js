'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var should = require('should');
var gutil = require('gulp-util');
var Vinyl = require('vinyl');
var through = require('through2');
var execSync = require('child_process').execSync;

module.exports = function(git, util) {
  it('package.json', function(done) {
    var hash = execSync('git ls-files -s -- package.json').toString().replace(/^.+\b(\S{30,})\b.+$/m, '$1');

    var srcStream = through.obj();

    srcStream.pipe(git.catFile()).on('data', function(file) {
      should.exist(file.contents);
      done();
    });

    srcStream.write(new Vinyl({
      path: 'package.json',
      git: {
        hash: hash
      }
    }));
  });
};
