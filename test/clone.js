'use strict';

var fs = require('fs');
var rimraf = require('rimraf');
var should = require('should');

module.exports = function(git) {

  beforeEach(function(done) {
    var repo = 'git://github.com/stevelacy/gulp-git';
    git.clone(repo, {args: './test/tmp'}, done);
  });

  it('should have cloned project into tmp directory', function(done) {
    fs.stat('./test/tmp/.git', function(err) {
      should.not.exist(err);
      done();
    });
  });

  afterEach(function(done) {
    rimraf('./test/tmp', function(err) {
      if (err) return done(err);
      done();
    });
  });
};
