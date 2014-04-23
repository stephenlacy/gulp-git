var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function(message, opt) {
  if(!opt) opt = {};
  if(!message) throw new Error('gulp-git: Commit message is required git.commit("commit message")');
  if(!opt.args) opt.args = ' ';

  var paths = [];
  var files = [];
  var defaultCwd = process.cwd();
  
  var write = function(file, enc, cb){
    paths.push(file.path);
    files.push(file);
    cb();
  };

  var flush = function(cb){
    var fileCwd = (files.length > 0 ? files[0].cwd : defaultCwd);
    var cwd = opt.cwd || fileCwd;

    var cmd = 'git commit -m "' + message + '" ' + escape(paths) + ' ' + opt.args;
    var that = this;
    exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
      if(err) cb(err);
      gutil.log(stdout, stderr);
      files.forEach(that.push.bind(that));
      cb();
    });
  };

  return through.obj(write, flush);
  
};