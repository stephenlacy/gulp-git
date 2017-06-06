'use strict';
/**
 * lsFiles
 * @module gulp-git/lib/util/lsFiles
 */

var spawn = require('./spawn');
var readStream = require('./readStream');
var RE_LS_FILES_RESULT = /(?:(\w+) )?(\w+) (\w+) (\w+)\t(.+?)\u0000/g;

function getReaslt(data) {
  var result = [];
  if (data && data.length) {
    var str = data.toString();
    var match;
    RE_LS_FILES_RESULT.lastIndex = 0;
    while ((match = RE_LS_FILES_RESULT.exec(str))) {
      result.push({
        // mode for compare "src"
        tag: match[1],
        // mode for compare "dst"
        mode: match[2],
        // sha1 for compare "src"
        hash: match[3],
        // sha1 for compare "dst"
        stage: match[4],
        // status
        path: match[5],
      });
    }
  }
  return result;
}

/**
 * @typedef {Object} File
 * @property {string} [tag] commit hash
 * @property {string} mode  file mode
 * @property {string} hash  commit hash
 * @property {string} stage file stage
 * @property {string} path  file path
 */

/**
 * Get commit logs
 * @param   {string[]}       [args]    Command parameter
 * @param   {string}         [cwd]     Current working directory of the child process
 * @param   {Object}         [config]  config object of git
 * @returns {Promise.<File[]>}         List of files [File]{@link module:gulp-git/lib/util/lsFiles~File}
 */

module.exports = function (args, cwd, config) {
  return readStream(spawn(['ls-files', '--stage', '-z'].concat(args), cwd, config)).then(getReaslt);
};
