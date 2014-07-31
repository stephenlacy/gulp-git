var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (remote, branch, opt, cb) {
  if(!branch) branch = 'master';
  if(!remote) remote = 'origin';
  if(!opt) opt = {};
  if(!opt.cwd) opt.cwd = process.cwd();
  if(!opt.args) opt.args = ' ';


  var write = function(chunk, enc, cb){
    this.push(chunk);
    cb();
  };

  var flush = function(cb){
    var cmd = "git push " + escape([remote, branch]) + " " + opt.args;
    return exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
      if(err) cb(err);
      gutil.log(stdout, stderr);
      cb();
    });
  };

  return through.obj(write, flush);
};
