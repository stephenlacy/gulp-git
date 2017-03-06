'use strict';

var fs = require('fs');

module.exports = function(git) {

  it('should checkout a branch', function(done) {
    var opt = {cwd: 'test/repo'};
    git.checkout('testBranch', opt, function() {
      fs.readFileSync('test/repo/.git/HEAD')
        .toString('utf8')
        .should.match(/ref\: refs\/heads\/testBranch/);

      done();
    });
  });
};
