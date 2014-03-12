var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (message, opt, endcb) {
  if(!opt) opt = {};
  if(!message) throw new Error('gulp-git: Commit message is required git.commit("commit message")');
  if(!opt.args) opt.args = ' ';

  var files = [];

  var stream = through.obj(function(file, enc, cb){
    this.push(file);
    if(!opt.cwd) {
      if (file.stat.isDirectory()) {
        opt.cwd = file.path;
      } else {
        opt.cwd = file.base;
      }
    }
    cb();
  }).on('data', function(file){
    files.push(file.path);
  }).on('end', function(){
    var cmd = 'git commit -m "' + message + '" ' + escape(files) + ' ' + opt.args;
    exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
      if(err) gutil.log(err);
      gutil.log(stdout, stderr);
      if(endcb) endcb();
    });
  });

  return stream;
};
