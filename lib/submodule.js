var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = {

  add: function (url, name, opt, cb) {
    if(!url) cb(new Error('gulp-git: Repo URL is required git.submodule.add("https://github.com/user/repo.git", "repoName")'));
    if(!name) name = '';
    if(!opt) opt = {};
    if(!opt.cwd) opt.cwd = process.cwd();
    if(!opt.args) opt.args = '';

    var cmd = "git submodule add " + opt.args + " " + url + " " + name;
    return exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
      if(err) cb(err);
      gutil.log(stdout, stderr);
      if(cb) cb();
    });
  },

  update: function(opt, cb){
    if(!opt) opt = {};
    if(!opt.cwd) opt.cwd = process.cwd();
    if(!opt.args) opt.args = ' ';

    var cmd = "git submodule update " + opt.args;
    return exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
      if(err) cb(err);
      gutil.log(stdout, stderr);
      if(cb) cb();
    });
  }

};