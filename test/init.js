'use strict';

var fs = require('fs');
var should = require('should');

module.exports = function(git) {

  before(function(done) {
    git.init({cwd: './test/repo/'}, done);
  });

  it('should initialize a empty git repo', function(done) {
    fs.stat('test/repo/.git/', function(err) {
      should.not.exist(err);
      done();
    });
  });

};
