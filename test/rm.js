'use strict';

var fs = require('fs');
var Vinyl = require('vinyl');

module.exports = function(git, util) {

  it('should rm a file', function(done) {
    var opt = {args: '-f', cwd: 'test/repo'};
    var fakeFile = new Vinyl(util.testFiles[0]);
    var gitS = git.rm(opt);
    gitS.once('data', function (newFile) {
      setTimeout(function() {
        fs.exists('test/repo/' + newFile, function(exists) {
          exists.should.be.false();
        });
        done();
      }, 100);
    });
    gitS.write(fakeFile);
    gitS.end();
  });

  it('should rm multiple files', function(done) {
    var fakeFiles = [];
    util.testFiles.slice(1).forEach(function(file) {
      fakeFiles.push(new Vinyl(file));
    });

    var opt = {args: '-f', cwd: 'test/repo'};
    var gitS = git.rm(opt);
    gitS.on('data', function (newFile) {
      fs.exists('test/repo/' + newFile, function(exists) {
        exists.should.be.false();
      });
    });
    gitS.once('end', done);
    fakeFiles.forEach(function(fake) {
      gitS.write(fake);
    });
    gitS.end();
  });

};
