/* global describe, it, after, before */
var fs = require('fs');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var git = require('../');

var testFile = __dirname + '/test.js';
fs.openSync(testFile, 'w');

var testFiles = [];
for (var i = 0; i < 10; i++) {
  testFiles[i] = __dirname + '/test.' + i + '.js';
  fs.openSync(testFiles[i], 'w');
}

var testCommit = path.join(__dirname, '/.git/COMMIT_EDITMSG');

describe('cloning', function(){
  before(function(done){
    git.clone('git://github.com/stevelacy/gulp-git', { args: './test/tmp' }, done);
  });

  it('should have cloned project into tmp directory', function(done){
    should.exist('./test/tmp/.git');
    done();
  });

  after(function(done){
    rimraf('./test/tmp', done);
  });
});

describe('gulp-git', function() {

  describe('normal usage ', function(){

    it('should initialize a empty git repo', function(done) {
      git.init({cwd:"./test/"}, function(){
        should.exist("test/.git/");
        done();
      });
    });

    it('should add files to the git repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js'),
        contents: new Buffer(fs.readFileSync('test/test.js'))
      });
      var gitS = git.add();
      gitS.once('data', function(newFile){
        should.exist(newFile);
        should.exist('test/.git/objects/');
        done();
      });
      gitS.write(fakeFile);
      gitS.end();
    });

    it('should add multiple files to the git repo', function(done) {
      var fakeFiles = [];

      for (var i = 0; i < 10; i++) {
        fakeFiles[i] = new gutil.File({
          base: 'test/',
          cwd: 'test/',
          path: testFiles[i],
          contents: new Buffer(fs.readFileSync('test/test.js'))
        });
      }

      var gitS = git.add();
      gitS.once('data', function(newFile){
        should.exist(newFile);
        should.exist('test/.git/objects/');
        done();
      });

      for (var j = 0; j < fakeFiles.length; j++) {
        gitS.write(fakeFiles[j]);
      }
      gitS.end();
    });

    it('should add a Remote to the git repo', function(done) {
      git.addRemote('origin', 'https://github.com/stevelacy/git-test', {cwd:"./test/"} , function(){
        should.exist('test/.git/');
        String(fs.readFileSync('test/.git/config').toString('utf8')).should.match(/https:\/\/github.com\/stevelacy\/git-test/);
        done();
      });
    });

  /*
    it('should pull from the remote repo', function(done) {
      git.pull('origin', 'master', {cwd: "./test/"}, function(){
        should.exist('./test/.git/refs/heads/master');
        done();
      });
    });

    // These must be run on a system which has git installed, no pull delay, and has git configured.


    it('should tag a version of the repo', function(done) {

      git.tag('v1.2.3', 'message', {cwd: "./test/"}, function(){
        should.exist('test/.git/refs/tags/v1.2.3');
        done();
      });

    });
  */

    it('should commit a file to the repo', function(done) {
      var fakeFilename = path.join(__dirname, 'test.js');
      var fakeFile = new gutil.File({
        base: '/',
        cwd: '/',
        path: fakeFilename,
        contents: new Buffer(fs.readFileSync(fakeFilename))
      });
      var gitS = git.commit('initial commit', {cwd:"./test/"});
      gitS.once('finish', function(){
        setTimeout(function () {
          String(fs.readFileSync(testCommit).toString('utf8')).should.match(/initial commit/);
          done();
        }, 100);
      });
      gitS.write(fakeFile);
      gitS.end();
    });



    it('should create a new branch', function(done){
      git.branch("testBranch", {cwd: "./test/"}, function(){
        should.exist('test/.git/refs/heads/testBranch');
        done();
      });
    });

    it('should create a new branch, switch to branch, and return branch name', function(done){
      var branchName = 'anotherBranch';
      git.branch(branchName, {cwd: "./test/"}, function(){
        should.exist('test/.git/refs/heads/'+branchName);
        git.checkout(branchName, {cwd: "./test/"}, function(){
          git.revParse({args: '--abbrev-ref HEAD', cwd: './test/'}, function (err, branch) {
            branch.should.equal(branchName);
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should merge branches', function(done){
      git.merge("testBranch", {cwd: "./test/"}, function(){
        setTimeout(function(){
          String(fs.readFileSync(testCommit).toString('utf8')).should.match(/initial commit/);
          done();
        }, 100);
      });
    });

    /*
     Requires git pull
    it('should checkout a branch', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js')
      });
      var gitS = git.checkout("testBranch", '-b');
      gitS.once('data', function () {
        String(fs.readFileSync('test/.git/HEAD').toString('utf8')).should.match(/ref\: refs\/heads\/master/);
        done();
      });
      gitS.write(fakeFile);
      gitS.end();
    });

    */


    describe('submodule', function(){
      it('should add a submodule to the git repo', function(done){
        git.addSubmodule('https://github.com/stevelacy/git-test', 'testSubmodule', { cwd: "./test/" }, function(){
          should.exist('test/.gitmodules');
          setTimeout(function(){
            String(fs.readFileSync('test/.gitmodules').toString('utf8')).should.match(/https:\/\/github.com\/stevelacy\/git-test/);
          }, 100);
          should.exist('test/testSubmodule');
          should.exist('test/testSubmodule/.git/');
          done();
        });
      });

      it('should update submodules', function(done){
        git.updateSubmodule({ cwd: "./test/" }, function(){
          should.exist('test/testSubmodule');
          should.exist('test/testSubmodule/.git/');
          done();
        });
      });

      after(function(done){
        rimraf('test/testSubmodule', function(err){
          if(err) return err;
          done();
        });
      });
    });

    describe('rm', function(){
      it('should rm multiple files', function(done) {
        var fakeFiles = [];

        for (var i = 0; i < 10; i++) {
          fakeFiles[i] = new gutil.File({
            base: 'test/',
            cwd: 'test/',
            path: testFiles[i],
            contents: new Buffer(fs.readFileSync('test/test.js'))
          });
        }

        var gitS = git.rm({args: '-f'});
        gitS.once('data', function (newFile) {
          setTimeout(function(){
            fs.exists(newFile, function(exists) {
              exists.should.be.false;
            });
          }, 300);
          done();
        });
        for (var j = 0; j < fakeFiles.length; j++) {
          gitS.write(fakeFiles[j]);
        }
        gitS.end();

      });

      it('should rm a file', function(done) {
        var fakeFile = new gutil.File({
          base: 'test/',
          cwd: 'test/',
          path: testFile
        });
        var gitS = git.rm();
        gitS.once('data', function (newFile) {
          setTimeout(function(){
            fs.exists(testFile, function(exists) {
              exists.should.be.false;
            });
            done();
          }, 100);
        });
        gitS.write(fakeFile);
        gitS.end();
      });
    });




  });

  after(function(done){
    rimraf('test/.git', function(err){
      if(err) return err;
      rimraf('test/.gitmodules', function(err){
        if(err) return err;
        done();
      });
    });
  });

});
