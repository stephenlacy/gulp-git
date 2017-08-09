'use strict';

var fs = require('fs');
var should = require('should');

module.exports = function(git) {

  // These must be run on a system which has git installed
  // no pull delay, and has git configured.

  it('should tag a version of the repo', function(done) {
    git.tag('v1.2.3', 'message', {cwd: './test/repo/'}, function() {
      fs.stat('test/repo/.git/refs/tags/v1.2.3', function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  it('should not throw an error on success', function(done) {
    git.tag('v2', 'message', {cwd: './test/repo/'}, function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should tag a version with an empty message', function(done) {
    git.tag('v3', '', {cwd: './test/repo/'}, function(err) {
      should.not.exist(err);
      fs.stat('test/repo/.git/refs/tags/v3', function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  it('should return all tags', function(done) {
    git.tag(function(err, tags) {
      should(tags).not.be.null();
      should(tags[0]).not.be.null();
      should(tags[0]).equal('0.5.1');
      done();
    });
  });
};
