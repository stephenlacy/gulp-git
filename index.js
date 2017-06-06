'use strict';
var requireDir = require('require-dir');
/**
 * git
 * @module gulp-git
 * @property {Object} util              {@link module:gulp-git/lib/util}
 * @property {Function} add             {@link module:gulp-git/lib/add}
 * @property {Function} addRemote       {@link module:gulp-git/lib/addRemote}
 * @property {Function} addSubmodule    {@link module:gulp-git/lib/addSubmodule}
 * @property {Function} blame           {@link module:gulp-git/lib/blame}
 * @property {Function} branch          {@link module:gulp-git/lib/branch}
 * @property {Function} catFile         {@link module:gulp-git/lib/catFile}
 * @property {Function} checkout        {@link module:gulp-git/lib/checkout}
 * @property {Function} checkoutFiles   {@link module:gulp-git/lib/checkoutFiles}
 * @property {Function} clean           {@link module:gulp-git/lib/clean}
 * @property {Function} clone           {@link module:gulp-git/lib/clone}
 * @property {Function} commit          {@link module:gulp-git/lib/commit}
 * @property {Function} diff            {@link module:gulp-git/lib/diff}
 * @property {Function} exec            {@link module:gulp-git/lib/exec}
 * @property {Function} fetch           {@link module:gulp-git/lib/fetch}
 * @property {Function} init            {@link module:gulp-git/lib/init}
 * @property {Function} lsFiles         {@link module:gulp-git/lib/lsFiles}
 * @property {Function} merge           {@link module:gulp-git/lib/merge}
 * @property {Function} pull            {@link module:gulp-git/lib/pull}
 * @property {Function} push            {@link module:gulp-git/lib/push}
 * @property {Function} removeRemote    {@link module:gulp-git/lib/removeRemote}
 * @property {Function} reset           {@link module:gulp-git/lib/reset}
 * @property {Function} revParse        {@link module:gulp-git/lib/revParse}
 * @property {Function} rm              {@link module:gulp-git/lib/rm}
 * @property {Function} stash           {@link module:gulp-git/lib/stash}
 * @property {Function} status          {@link module:gulp-git/lib/status}
 * @property {Function} tag             {@link module:gulp-git/lib/tag}
 * @property {Function} updateSubmodule {@link module:gulp-git/lib/updateSubmodule}
 */
var git = requireDir('./lib');
git.util = require('./lib/util');
module.exports = git;
