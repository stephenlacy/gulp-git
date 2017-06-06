'use strict';
/**
 * log
 * @module gulp-git/lib/util/log
 */

var spawn = require('./spawn');
var readStream = require('./readStream');
var parseDate = require('./parseDate');

var formats = [
  '%H',
  '%T',
  '%P',
  '%aN',
  '%aE',
  '%at',
  '%cN',
  '%cE',
  '%ct',
  '%B'
].join('```git.log.split.prop```') + '```git.log.split.log```';
function getReaslt(data) {
  var result = [];
  if (data && data.length) {
    return data.toString().split('```git.log.split.log```\n').filter(Boolean).map(function(log) {
      log = log.trim().split('```git.log.split.prop```');
      return {
        hash: log[0],
        treeHash: log[1],
        parentHash: log[2].split(' '),
        author: {
          name: log[3],
          email: log[4],
          time: parseDate(log[5]),
        },
        committer: {
          name: log[6],
          email: log[7],
          time: parseDate(log[8]),
        },
        message: log[9],
      };
    });
  }
  return result;
}

/**
 * @typedef {Object} User
 * @property {string}           name     name (respecting .mailmap)
 * @property {string}           email    email (respecting .mailmap)
 * @property {Date}             time     author or committer time
 */

/**
 * @typedef {Object} Log
 * @property {string}           hash        commit hash
 * @property {string}           treeHash    tree hash
 * @property {string[]}         parentHash  list of parent hashes
 * @property {User}             author      author [User]{@link module:gulp-git/lib/util/log~User}
 * @property {User}             committer   committer [User]{@link module:gulp-git/lib/util/log~User}
 * @property {string}           message     commit message
 */

/**
 * Get commit logs
 * @param   {string[]}       [args]    Command parameter
 * @param   {string}         [cwd]     Current working directory of the child process
 * @param   {Object}         [config]  config object of git
 * @returns {Promise.<Log[]>}          List of logs [Log]{@link module:gulp-git/lib/util/log~Log}
 */

module.exports = function (args, cwd, config) {
  return readStream(spawn(['log', '--format=' + formats].concat(args), cwd, config)).then(getReaslt);
};
