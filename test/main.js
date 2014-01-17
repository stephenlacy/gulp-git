var fs = require('fs');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var git = require('../');

require('mocha');



describe('gulp-git', function() {

  describe('gulp-git normal', function(){

    it('should initialize a empty git repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, '/test.js'),
      });
      var gitS = git.init();
      gitS.once('data', function(newFile){
        should.exist(newFile);
        should.exist('test/.git');
        done();
      });
      gitS.write(fakeFile);
    });

    it('should add files to the git repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, '/test.js'),
        contents: new Buffer(fs.readFileSync('test/test.js'))
      });
      var gitS = git.add();
      gitS.once('data', function(newFile){
        should.exist(newFile);
        should.exist('test/.git/objects/');
        done();
      });
      gitS.write(fakeFile);
    });

    it('should add a Remote to the git repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/'
      });
      var gitS = git.addRemote('origin', 'https://github.com/stevelacy/git-test');
      gitS.once('data', function(newFile){
        should.exist('test/.git/');
        setTimeout(function(){
          String(fs.readFileSync('test/.git/config').toString('utf8')).should.match(/https:\/\/github.com\/stevelacy\/git-test/);
          done();
        }, 1000);
      });
      gitS.write(fakeFile);
    });

    it('should pull from the remote repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js')
      });
      var gitS = git.pull('origin', 'master');
      gitS.once('data', function(newFile){
        should.exist('test/.git/refs/heads/master');
        done();
      });
      gitS.write(fakeFile);
    });
  /*
  // This must be run on a system which as git installed, and has git configured.

    it('should tag a version of the repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js')
      });
      var gitS = git.tag('v1.2.3', 'message');
      gitS.once('data', function(newFile){
        setTimeout(function(){
        should.exist('test/.git/refs/tags/v1.2.3');
          fs.unlinkSync('test/.git/refs/tags/v1.2.3');
          done();
        },1000);
      });
      gitS.write(fakeFile);

    });
  */
    it('should commit a file to the repo', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js'),
        contents: new Buffer(fs.readFileSync('test/test.js'))
      });
      var gitS = git.commit('initial commit');
      gitS.once('data', function(newFile){
        String(fs.readFileSync('test/.git/COMMIT_EDITMSG').toString('utf8')).should.match(/initial commit/);
        done();
      });
      gitS.write(fakeFile);
    });

  });


  describe('gulp-git with options', function(){

    it('should initialize a empty git repo - with options', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, '/test.js'),
      });
      var gitS = git.init('-q');
      gitS.once('data', function(newFile){
        should.exist(newFile);
        should.exist('test/.git');
        done();
      });
      gitS.write(fakeFile);
    });

    it('should add files to the git repo - with options', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, '/test.js'),
        contents: new Buffer(fs.readFileSync('test/test.js'))
      });
      var gitS = git.add('-u');
      gitS.once('data', function(newFile){
        should.exist(newFile);
        should.exist('test/.git/objects/');
        done();
      });
      gitS.write(fakeFile);
    });

    it('should add a Remote to the git repo - with options', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/'
      });
      var gitS = git.addRemote('origin', 'https://github.com/stevelacy/git-test', '--no-tag');
      gitS.once('data', function(newFile){
        should.exist('test/.git/');
        setTimeout(function(){
          String(fs.readFileSync('test/.git/config').toString('utf8')).should.match(/https:\/\/github.com\/stevelacy\/git-test/);
          done();
        }, 1000);
      });
      gitS.write(fakeFile);
    });

    it('should pull from the remote repo - with options', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js')
      });
      var gitS = git.pull('origin', 'master', '-v');
      gitS.once('data', function(newFile){
        should.exist('test/.git/refs/heads/master');
        done();
      });
      gitS.write(fakeFile);
    });

    it('should commit a file to the repo - with options', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js'),
        contents: new Buffer('var awsome = this;')
      });
      var gitS = git.commit('initial commit', '-v');
      gitS.once('data', function(newFile){
        String(fs.readFileSync('test/.git/COMMIT_EDITMSG').toString('utf8')).should.match(/initial commit/);
        done();
      });
      gitS.write(fakeFile);
    });

    it('should create a new branch', function(done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js')
      });
      var gitS = git.branch("testBranch");
      gitS.once('data', function () {
        should.exist('test/.git/refs/heads/testBranch');
        done();
      });
      gitS.write(fakeFile);
    });
    
    /*
    it('should merge a branch', function (done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: path.join(__dirname, 'test.js'),
        contents: new Buffer('var awesome = this;')
      });
      var gitS = git.merge('testBranch');
      gitS.once('data', function () {
        String(fs.readFileSync('test/.git/COMMIT_EDITMSG').toString('utf8')).should.match(/merging/);
        done();
      });
      gitS.write(fakeFile);
    });
    */
    
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
    });

  });

  after(function(done){
    rimraf('test/.git', function(err){
      if(err) return err;
      done();
    });
  });

});

