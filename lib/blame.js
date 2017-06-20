'use strict';
var mapStream = require('./util/mapStream');
var blameHelper = require('./util/blame');

/**
 * Get what revision and author last modified each line of a file
 * @param    {object}  [opt]                  options
 * @param    {boolean} [opt.showEmail=true]   {@link https://git-scm.com/docs/git-blame#git-blame---show-email}
 * @returns  {stream}                         stream that add `git.blame` to `vinyl` file objects.
 * @memberof git
 */
function blame(opt) {
  opt = Object.assign({
    showEmail: true,
  }, opt);

  return mapStream(function(file) {
    return blameHelper(file, opt.showEmail, opt.config).then(function(blame) {
      if (!file.git) {
        file.git = {};
      }
      file.git.blame = blame;
    });
  });
}
module.exports = blame;
