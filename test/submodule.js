'use strict';

var fs = require('fs');
var rimraf = require('rimraf');
var should = require('should');

module.exports = function(git) {

  it('should add a submodule to the git repo', function(done) {

    var opt = {cwd: 'test/repo'};
    var url = 'https://github.com/stevelacy/git-test';

    git.addSubmodule(url, 'testSubmodule', opt, function() {

      fs.readFileSync('test/repo/.gitmodules')
        .toString('utf8')
        .should.match(new RegExp(url.replace(/[\/]/g, '\\$&')));
      fs.stat('test/repo/testSubmodule/.git', function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  it('should update submodules', function(done) {
    var args = {cwd: 'test/repo'};

    git.updateSubmodule(args, function() {
      fs.stat('test/repo/testSubmodule/.git', function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  after(function(done) {
    rimraf('test/repo/testSubmodule', function(err) {
      if (err) return done(err);
      done();
    });
  });
};
