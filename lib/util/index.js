'use strict';
/**
 * readStream
 * @module gulp-git/lib/util
 * @property {Function} blame       {@link module:gulp-git/lib/util/blame}
 * @property {Function} diff        {@link module:gulp-git/lib/util/diff}
 * @property {Function} log         {@link module:gulp-git/lib/util/log}
 * @property {Function} lsFiles     {@link module:gulp-git/lib/util/lsFiles}
 * @property {Function} mapStream   {@link module:gulp-git/lib/util/mapStream}
 * @property {Function} parseDate   {@link module:gulp-git/lib/util/parseDate}
 * @property {Function} readStream  {@link module:gulp-git/lib/util/readStream}
 * @property {Function} spawn       {@link module:gulp-git/lib/util/spawn}
 */
var requireDir = require('require-dir');
module.exports = requireDir(__dirname);
