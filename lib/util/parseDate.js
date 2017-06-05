'use strict';

/**
 * 将字符串转换为时间，相对原生Date对象，额外增加了GIT时间戳的支持
 *
 * @param   {String} date 时间信息，字符串，格式为git时间戳或其他标准的时间信息
 * @returns {Date} 时间对象
 */
function parseDate(date) {
  if (!date) {
    return;
  }
  if (/^@?(\d+)(?:\s+[+-]\d+)?$/.test(date)) {
    date = RegExp.$1 * 1000;
  }
  return new Date(date);
}
module.exports = parseDate;
