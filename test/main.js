var fs = require('fs');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
var git = require('../');

require('mocha');


describe('gulp-git', function() {

  it('should initialize a empty git repo', function(done) {
    var fakeFile = new gutil.File({
      base: "test/",
      cwd: "test/",
      path: path.join(__dirname, 'test.js'),
    });
    var gitS = git.init();
    gitS.once('data', function(newFile){
      should.exist(newFile);
      should.exist("test/.git");
      done();
    });
    gitS.write(fakeFile);
  });

  it('should add files to the git repo', function(done) {
    var fakeFile = new gutil.File({
      base: "test/",
      cwd: "test/",
      path: path.join(__dirname, 'test.js'),
      contents: new Buffer(fs.readFileSync('test/test.js'))
    });
    var gitS = git.add();
    gitS.once('data', function(newFile){
      should.exist(newFile);
      should.exist("test/.git/objects/");
      done();
    });
    gitS.write(fakeFile);
  });

  it('should add a Remote to the git repo', function(done) {
    var fakeFile = new gutil.File({
      base: "test/",
      cwd: "test/"
    });
    var gitS = git.addRemote({remote:'origin', url:'https://github.com/stevelacy/git-test'});
    gitS.once('data', function(newFile){
      should.exist("test/.git/");
      setTimeout(function(){
        String(fs.readFileSync('test/.git/config').toString('utf8')).should.match(/https:\/\/github.com\/stevelacy\/git-test/);
        done();
      }, 1000);
    });
    gitS.write(fakeFile);
  });


  it('should pull from the remote repo', function(done) {
    var fakeFile = new gutil.File({
      base: "test/",
      cwd: "test/",
      path: path.join(__dirname, 'test.js')
    });
    var gitS = git.pull({remote: 'origin', branch: 'master'});
    gitS.once('data', function(newFile){
      should.exist("test/.git/refs/heads/master");
      done();
    });
    gitS.write(fakeFile);
  });

  it('should commit a file to the repo', function(done) {
    var fakeFile = new gutil.File({
      base: "test/",
      cwd: "test/",
      path: path.join(__dirname, 'test.js'),
      contents: new Buffer(fs.readFileSync('test/test.js'))
    });
    var gitS = git.commit({message:"initial commit"});
    gitS.once('data', function(newFile){
      String(fs.readFileSync('test/.git/COMMIT_EDITMSG').toString('utf8')).should.match(/initial commit/);
      done();
    });
    gitS.write(fakeFile);
  });

});

