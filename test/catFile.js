'use strict';

var should = require('should');
var mapStream = require('../lib/util/mapStream');

module.exports = function(git) {
  it('package.json', function(done) {
    git.lsFiles({
      args: ['--', 'package.json']
    })
    .pipe(git.catFile())
    .pipe(mapStream(function(file) {
      should.exist(file.contents);
      done();
    }));
  });
};

// module.exports(require('../'));
