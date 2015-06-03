/**
 * Fundamental validate functions
 */


/**
 * required
 *
 * This function validate whether the value has been filled out.
 *
 * @param val
 * @return {Boolean}
 */

function required (val) {
  if (Object.prototype.toString.call(val) === '[object Array]') {
    return val.length > 0;
  } else if (typeof val === 'object') {
    return Object.keys(val).length > 0;
  } else {
    return !val ? false : true;
  }
}


/**
 * pattern
 *
 * This function validate whether the value matches the regex pattern
 *
 * @param val
 * @param {String} pat
 * @return {Boolean}
 */

function pattern (val, pat) {
  if (typeof(pat) !== 'string') { return false }

  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'))
  if (!match) { return false }

  return new RegExp(match[1], match[2]).test(val)
}


/**
 * minLength
 *
 * This function validate whether the minimum length of the string.
 *
 * @param {String} val
 * @param {String|Number} min
 * @return {Boolean}
 */

function minLength (val, min) {
  return typeof val === 'string' && isInteger(min) && val.length >= parseInt(min)
}


/**
 * maxLength
 *
 * This function validate whether the maximum length of the string.
 *
 * @param {String} val
 * @param {String|Number} max
 * @return {Boolean}
 */

function maxLength (val, max) {
  return typeof val === 'string' && isInteger(max) && val.length <= parseInt(max)
}


/**
 * min
 *
 * This function validate whether the minimum value of the numberable value.
 *
 * @param {*} val
 * @param {*} arg minimum
 * @return {Boolean}
 */

function min (val, arg) {
  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) >= +(arg))
}


/**
 * max
 *
 * This function validate whether the maximum value of the numberable value.
 *
 * @param {*} val
 * @param {*} arg maximum
 * @return {Boolean}
 */

function max (val, arg) {
  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) <= +(arg))
}


/**
 * isInteger
 *
 * This function check whether the value of the string is integer.
 *
 * @param {String} val
 * @return {Boolean}
 * @private
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
