'use strict';
/**
 * git.util.
 * @module gulp-git/lib/util/spawn
 */

var childProcess = require('child_process');
var readStream = require('./readStream');
var Readable = require('stream').Readable;

/**
 * Run git actions
 * @param   {string[]}       args                                Command parameter
 * @param   {string}         [cwd]                               Current working directory of the child process
 * @param   {Object}         [config]                            config object of git
 * @param   {boolean}        [config.diff.mnemonicprefix=false]  config.diff.mnemonicprefix
 * @param   {boolean}        [config.core.quotepath=false]       core.quotepath
 * @returns {stream}                                             stream of process's stdout.
 * @memberof git.util
 */
function spawn(args, cwd, config) {
  config = Object.assign({
    'diff.mnemonicprefix': false,
    'core.quotepath': false
  }, config);

  let configArgs = [];

  Object.keys(config).forEach(function(key) {
    configArgs.push('-c', key + '=' + String(config[key]));
  });

  var git = childProcess.spawn('git', configArgs.concat(args).filter(Boolean).map(String), {
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
}

module.exports = spawn;
