'use strict';
/**
 * blame
 * @module gulp-git/lib/blame
 */

var mapStream = require('./util/mapStream');
var blame = require('./util/blame');

/**
 * get a buffer.
 * @callback requestCallback
 * @param {buffer} buf
 */

/**
 * @typedef {object}    blameOptions
 * @property {boolean}  showEmail {@link https://git-scm.com/docs/git-blame#git-blame---show-email}
 */

/**
 * read blame from git
 * @param {blameOptions} opt [blameOptions]{@link module:gulp-git/lib/blame~blameOptions}
 * @returns {stream}       stream of vinyl `File` objects.
 */
module.exports = function (opt) {
  opt = Object.assign({
    showEmail: true,
  }, opt);

  return mapStream(function(file) {
    return blame(file, opt.showEmail, opt.config).then(function(blame) {
      if (!file.git) {
        file.git = {};
      }
      file.git.blame = blame;
    });
  });
};
