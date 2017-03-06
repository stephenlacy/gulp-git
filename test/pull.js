'use strict';

var should = require('should');

module.exports = function(git) {

  it.skip('should pull from the remote repo', function(done) {
    git.pull('origin', 'master', {cwd: './test/'}, function() {
      should.exist('./test/.git/refs/heads/master');
      done();
    });
  });

};
