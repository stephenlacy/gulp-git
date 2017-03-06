'use strict';

var should = require('should');

module.exports = function(git) {

  it('should git.exec log', function(done) {
    var opt = {args: 'log', cwd: 'test/repo'};
    git.exec(opt, function(err, stdout) {
      should(stdout.match(/commit|Author|Date/g))
        .have.property('length');
      done();
    });
  });
};
