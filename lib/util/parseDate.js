'use strict';
/**
 * readStream
 * @module gulp-git/lib/util/parseDate
 */

/**
 * Converting strings to time, relative to native Date objects, adds extra GIT timestamp support
 *
 * @param   {String} [date] Time information, strings, formats git, timestamp, or other standard time information
 * @returns {Date}          Time object
 */

module.exports = function parseDate(date) {
  if (!date) {
    return;
  }
  if (/^@?(\d+)(?:\s+[+-]\d+)?$/.test(date)) {
    date = RegExp.$1 * 1000;
  }
  return new Date(date);
};