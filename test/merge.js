'use strict';

var fs = require('fs');

module.exports = function(git, util) {

  it('should merge branches', function(done) {
    var opt = {cwd: './test/repo'};
    git.merge('testBranch', opt, function() {
      setTimeout(function() {
        fs.readFileSync(util.testCommit)
          .toString('utf8')
          .should.match(/initial commit/);
        done();
      }, 100);
    });
  });
};
