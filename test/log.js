/* global describe, it, after, before, afterEach, beforeEach */

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var should = require('should');
var gutil = require('gulp-util');

module.exports = function(git, util){

  it('should git log', function(done){

    var opt = {cwd: 'test/repo'};
    git.log(opt, function(err, stdout){
      should(err).be.eql(null);
      stdout.match(/^commit|^Author|^Date/mg)
        .should.have.property('length', 3);
      done();
    });
  });
};
