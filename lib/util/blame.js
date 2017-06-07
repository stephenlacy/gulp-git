'use strict';
var spawn = require('./spawn');
var readStream = require('./readStream');
var parseDate = require('./parseDate');
var RE_BLAME = /(?:^|\n)\^?(\w+)(?:\s.+?)?\s+\((?:<(.+?)>|(.+?))\s+((?:@?\d+|\d+\D\d+\D\d+\s\d+\D\d+\D\d+)(?:\s+[+-]\d+)?)\s+(\d+)\)/gm;

function getReaslt(data) {
  var result = [];
  if (data && data.length) {
    var str = data.toString();
    var match;
    RE_BLAME.lastIndex = 0;
    while ((match = RE_BLAME.exec(str))) {
      var lineNumber = +match[5];
      var blame = result[lineNumber] = {
        hash: match[1],
        time: parseDate(match[4]),
      };
      if (match[2]) {
        blame.email = match[2];
      } else {
        blame.name = match[3];
      }
    }
  }
  return result;
}

/**
 * @typedef {Object} Line
 * @property {string}           hash     commit hash
 * @property {string}           [name]   author name (respecting .mailmap)
 * @property {string}           [email]  author email (respecting .mailmap)
 * @property {Date}             time     author time
 */

/**
 * Get what revision and author last modified each line of a file
 * @param   {vinyl}    file              `vinyl` file
 * @param   {boolean}  [showEmail=false] {@link https://git-scm.com/docs/git-blame#git-blame---show-email}
 * @param   {Object}   [config]          config object of git
 * @returns {Promise.<Line[]>}     List of lines [Line]{@link module:gulp-git/lib/util/blame~Line}
 * @memberof git.util
 */

function blame (file, showEmail, config) {
  var args = ['blame', '-l', '-t', '-w', '-C', '-M'];
  if (showEmail) {
    args.push('--show-email');
  }
  if (file.contents) {
    args.push('--contents');
    args.push('-');
  }
  args.push('--');
  args.push(file.path);

  var blame = spawn(args, file.cwd, config);

  if (file.isBuffer()) {
    blame.stdin.write(file.contents);
    blame.stdin.end();
  } else if (file.isStream()) {
    file.contents.pipe(blame.stdin);
  }

  return readStream(blame).then(getReaslt);
}

module.exports = blame;
