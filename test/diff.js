'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var should = require('should');
var gutil = require('gulp-util');

module.exports = function(git, util) {
  it('diff files', function(done) {
    var diffFile = [];
    git.diff('1.12.0...1.13.0').on('data', function (file) {
      diffFile.push(file);
    }).on('finish', function() {
      var subPath = [];
      var diffInfo = [];
      diffFile.forEach(function(file) {
        subPath.push(file.relative.replace(/\\/g, '/'));
        diffInfo.push(file.git.diff);
      });
      should.deepEqual(subPath, ['LICENSE', 'README.md', 'lib/tag.js', 'package.json']);
      should.deepEqual(diffInfo, [
        { srcMode: '100644',
          dstMode: '100644',
          srcHash: '369b1d7',
          dstHash: '3834582',
          status: 'M',
          srcPath: 'LICENSE',
          dstPath: 'LICENSE'
        },
        { srcMode: '100644',
          dstMode: '100644',
          srcHash: '783f6c7',
          dstHash: 'd79e3b2',
          status: 'M',
          srcPath: 'README.md',
          dstPath: 'README.md'
        },
        { srcMode: '100644',
          dstMode: '100644',
          srcHash: '3fa85aa',
          dstHash: 'cdebb2e',
          status: 'M',
          srcPath: 'lib/tag.js',
          dstPath: 'lib/tag.js'
        },
        { srcMode: '100644',
          dstMode: '100644',
          srcHash: 'f128959',
          dstHash: '1ade7a9',
          status: 'M',
          srcPath: 'package.json',
          dstPath: 'package.json'
        }
      ]);
      done();
    }).on('error', done);
  });
};
