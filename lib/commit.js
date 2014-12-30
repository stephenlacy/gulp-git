var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');
var path = require('path');
var _ = require('lodash');

// want to get the current git hash instead?
// git.revParse({args:'--short HEAD'})

module.exports = function(message, opt) {
  if(typeof message === 'object') opt = message;
  if(!opt) opt = {};
  if(!opt.cwd) opt.cwd = process.cwd();
  if(!opt.args) opt.args = ' ';
  if(typeof message === 'string') opt.message = message;
  
  var files = [];
  var paths = [];

  var write = function(file, enc, cb){
    if(file.data) opt = _.extend(opt, file.data);
    
    files.push(file);
    paths.push(path.relative(opt.cwd, file.path).replace('\\','/'));
    cb();
  };

  var flush = function(cb){
    if(!opt.message && opt.args.indexOf('--amend') === -1)
      throw new Error('gulp-git: Commit message is required git.commit("commit message") or --amend arg must be given');
    
    var cmd = 'git commit ';
    if (opt.message && opt.args.indexOf('--amend') === -1) {
      cmd += '-m "' + opt.message + '" ' + opt.args + ' ' + escape(paths);

    } else {
      // When amending, just add the file automatically and do not include the message not the file.
      // Also, add all the files and avoid lauching the editor (even if --no-editor was added)
      cmd += '-a ' + opt.args + (opt.args.indexOf('--no-edit') === -1 ? ' --no-edit' : '');
    }
    var self = this;
    exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
      if(err) return cb(err);
      gutil.log(stdout, stderr);
      files.forEach(self.push.bind(self));
      if(cb) cb();
    });
  };

  return through.obj(write, flush);
};
