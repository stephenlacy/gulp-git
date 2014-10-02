/* global describe, it, after, before, afterEach, beforeEach */

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var should = require('should');
var gutil = require('gulp-util');

// read it before it
var testSuite = fs.readdirSync(__dirname);

// prepare stuff
var repo = path.join(__dirname, 'repo');
var testCommit = path.join(repo, '.git', 'COMMIT_EDITMSG');

fs.mkdirSync(repo);
fs.openSync(path.join(repo, 'testContents.js'), 'w');

var testFiles = [];
var fileContents = fs.readFileSync('test/repo/testContents.js');
for (var i = 0; i < 10; i++) {
  testFiles[i] = {
        base : 'test/repo',
         cwd : 'test/repo',
        path : __dirname + '/repo/test.' + i + '.js',
    contents : new Buffer(fileContents)
  };
  fs.openSync(testFiles[i].path, 'w');
}

// some need priority
// ---
// till there is no intial commit no repo
// till no added can't commit
// till no commit no master branch

var testFirst = [
  'clone.js', 'init.js', 'add.js', 'commit.js'
];

// use it also to omit _main & _util files
testFirst.concat('main.js', '_util.js').forEach(function(file){
  testSuite.splice(testSuite.indexOf(file), 1);
});
testSuite.unshift.apply(testSuite, testFirst);

module.exports = {
          repo : repo,
    testCommit : testCommit,
     testFiles : testFiles,
  fileContents : fileContents,
     testSuite : testSuite
};
