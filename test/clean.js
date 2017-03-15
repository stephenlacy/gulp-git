/* global beforeEach, it, afterEach */
'use strict';

var fs = require('fs');
var rimraf = require('rimraf');

module.exports = function (git) {
  var repoPath = './test/tmp';

  beforeEach(function (done) {
    var repo = 'git://github.com/stevelacy/git-test';
    git.clone(repo, { args: repoPath }, done);
  });

  it('should remove an untracked file from the repo', function (done) {
    var filePath = repoPath + '/test.txt';
    fs.writeFile(filePath, 'Hello git clean test', function (err) {
      if (err)
        return done(err);
      git.clean({ cwd: repoPath, args: '-f' }, function (err) {
        if (err)
          return done(err);
        fs.stat(filePath, function (err) {
          if (err)
            return done();
          done(new Error('Failed to remove file'));
        });
      });
    });
  });

  afterEach(function(done) {
    rimraf('./test/tmp', function(err) {
      if (err) return done(err);
      done();
    });
  });
};
