'use strict';

var fs = require('fs');

module.exports = function(git) {

  it('should stash a branch', function(done) {
    var opt = {cwd: './test/repo'};
    git.stash(opt, function() {
      fs.readFileSync('test/repo/.git/logs/refs/stash')
        .toString('utf8')
        .should.match(/gulp-stash/);
      done();
    });
  });

  it('should unstash a branch', function(done) {
    var opt = {cwd: './test/repo', args: 'pop'};
    git.stash(opt, function() {
      fs.open('test/repo/.git/refs/stash', 'r', function(err) {
        err.code.should.be.exactly('ENOENT');
        done();
      });
    });
  });
};
