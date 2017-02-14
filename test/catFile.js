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
    if (!/\b(\S{40,})\b/.test(execSync('git ls-files -s -- package.json').toString())) {
      return;
    }
    var hash = RegExp.$1;

    var stream = git.catFile();

    stream.on('data', function(file) {
      should.exist(file.contents);
      done();
    });

    stream.write(new Vinyl({
      path: 'package.json',
      git: {
        hash: hash
      }
    }));
  });
};
