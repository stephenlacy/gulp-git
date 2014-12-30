var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');
var _ = require('lodash');

module.exports = function (opt) {
  if(!opt) opt = {};

  var paths = [];
  var files = [];
  var fileCwd = process.cwd;
  var write = function(file, enc, cb) {
    if(file.data) opt = _.extend(opt, file.data);
    if(!opt.args) opt.args = ' ';
    
    paths.push(file.path);
    files.push(file);
    fileCwd = file.cwd;
    cb();
  };

  var flush = function(cb) {
    var cwd = opt.cwd || fileCwd;

    var cmd = "git rm " + escape(paths) + " " + opt.args;
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
