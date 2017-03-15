'use strict';

var fs = require('fs');
var should = require('should');

module.exports = function(git) {

  it('should remove the Remote origin from the git repo', function(done) {
    var opt = {cwd: './test/repo/'};
    git.removeRemote('origin', opt, function() {
      fs.stat('./test/repo/.git/', function(err) {
        should.not.exist(err);
        fs.readFileSync('./test/repo/.git/config')
          .toString('utf8')
          .should.not.match(/https:\/\/github.com\/stevelacy\/git-test/);
        done();
      });
    });
  });

};
