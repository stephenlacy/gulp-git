'use strict';

var should = require('should');
var Vinyl = require('vinyl');
var mapStream = require('../lib/util/mapStream');

module.exports = function(git) {
  it('LICENSE', function(done) {

    var stream = git.blame();

    stream.on('data', function(file) {
      should.exist(file.git);
      should.exist(file.git.blame);
      should(file.git.blame).lengthOf(21);
      file.git.blame.forEach(function(line) {
        should.equal(line.email, 'me@slacy.me');
        should(line.time).be.instanceof(Date);
      });
      done();
    });

    stream.write(new Vinyl({
      path: 'LICENSE',
    }));
  });

  it('LICENSE with gulp flow', function(done) {
    git.lsFiles({
      log: false,
      args: ['--', 'LICENSE']
    })
    .pipe(git.catFile())
    .pipe(git.blame())
    .pipe(mapStream(function(file) {
      should.exist(file.contents);
      should.exist(file.git);
      should.exist(file.git.blame);
      should(file.git.blame).lengthOf(21);
      file.git.blame.forEach(function(line) {
        should.equal(line.email, 'me@slacy.me');
        should(line.time).be.instanceof(Date);
      });
      done();
    }));
  });
};

// module.exports(require('../'));
