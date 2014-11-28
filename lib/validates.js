/**
 * Fundamental validate functions
 */


/**
 * required
 *
 * This function validate whether a input has been filled out.
 *
 * @param val
 * @return {Boolean}
 */

function required (val) {
  return !val ? false : true
}


/**
 * pattern
 *
 * This function validator whether an input matches a regex pattern
 *
 * @param val
 * @param {String} pattern
 * @return {Boolean}
 */

function pattern (val, pattern) {
  var match = pattern.match(new RegExp('^/(.*?)/([gimy]*)$'))
  return new RegExp(match[1], match[2]).test(val)
}


/**
 * minLength
 *
 * TODO: description !!
 *
 * @param {String} val
 * @param {String} min
 * @return {Boolean}
 */

function minLength (val, min) {
  return typeof(val) === 'string' && isInteger(min) && val.length >= parseInt(min)
}


/**
 * maxLength
 *
 * TODO: description !!
 *
 * @param {String} val
 * @param {String} max
 * @return {Boolean}
 */

function maxLength (val, max) {
  return typeof(val) === 'string' && isInteger(max) && val.length <= parseInt(max)
}


/**
 * min
 *
 * TODO: description !!
 *
 * @param {String} val
 * @param {String} min
 * @return {Boolean}
 */

function min (val, min) {
  return typeof(val) === 'string' && isInteger(min) && parseInt(val) >= parseInt(min)
}


/**
 * max
 *
 * TODO: description !!
 *
 * @param {String} val
 * @param {String} arg
 * @return {Boolean}
 */

function max (val, max) {
  return typeof(val) === 'string' && isInteger(max) && parseInt(val) <= parseInt(max)
}


/**
 * isInteger
 *
 * TODO: description
 *
 * @param val
 * @return {Boolean}
 * @private
 *
 */

function isInteger (val) {
  return /^(-?[1-9]\d*|0)$/.test(val)
}


/**
 * export(s)
 */
module.exports = {
  required: required,
  pattern: pattern,
  minLength: minLength,
  maxLength: maxLength,
  min: min,
  max: max
}
