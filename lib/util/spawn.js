'use strict';
var spawn = require('child_process').spawn;
var readStream = require('./readStream');
var Readable = require('stream').Readable;

module.exports = function(args, cwd, config) {
  config = Object.assign({
    'diff.mnemonicprefix': false,
    'core.quotepath': false
  }, config);

  let configArgs = [];

  Object.keys(config).forEach(function(key) {
    configArgs.push('-c', key + '=' + String(config[key]));
  });

  var git = spawn('git', configArgs.concat(args).filter(Boolean).map(String), {
    cwd: cwd
  });

  var stream = new Readable().wrap(git.stdout);

  var gitError;

  readStream(git.stderr).then(function(stderr) {
    if (stderr) {
      gitError = new Error(String(stderr));
    }
  });

  git.on('error', function(error) {
    gitError = error;
  });

  git.on('exit', function(code) {
    if (!code) {
      stream.emit('finish');
      return;
    }
    if (!gitError) {
      gitError = new Error('Command failed: ' + git.spawnargs.join(' ').trim());
    }
    stream.emit('error', gitError);
  });

  stream.stdin = git.stdin;

  // console.log(stream.spawnargs.join(' '));

  return stream;
};
