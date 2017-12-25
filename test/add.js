'use strict';

var fs = require('fs');
var should = require('should');
var Vinyl = require('vinyl');

module.exports = function(git, util) {

  it('should add files to the git repo', function(done) {
    var fakeFile = new Vinyl(util.testFiles[0]);
    var gitS = git.add();
    gitS.on('data', function(newFile) {
      should.exist(newFile);
      fs.stat('test/repo/.git/objects/', function(err) {
        should.not.exist(err);
        done();
      });
    });
    gitS.write(fakeFile);
    gitS.end();
  });

  it('should add multiple files to the git repo', function(done) {
    var fakeFiles = [];
    util.testFiles.forEach(function(name) {
      fakeFiles.push( new Vinyl(name) );
    });
    var gitS = git.add();
    gitS.on('data', function(newFile) {
      should.exist(newFile);
      fs.stat('test/repo/.git/objects/', function(err) {
        should.not.exist(err);
      });
    });
    fakeFiles.forEach(function(file) {
      gitS.write(file);
    });
    gitS.end(done);
  });

  it('should fire an end event', function(done) {
    var fakeFile = new Vinyl(util.testFiles[0]);
    var gitS = git.add();

    gitS.on('end', function() {
      done();
    });

    gitS.write(fakeFile);
    gitS.end();
  });

};
