'use strict';

var should = require('should');
var execSync = require('child_process').execSync;
var Vinyl = require('vinyl');

module.exports = function(git) {
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
