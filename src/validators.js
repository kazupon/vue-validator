/**
 * Fundamental validate functions
 */


/**
 * required
 *
 * This function validate whether the value has been filled out.
 *
 * @param {*} val
 * @return {Boolean}
 */

export function required (val) {
  if (Array.isArray(val)) {
    if (val.length !== 0) {
      let valid = true
      for (let i = 0, l = val.length; i < l; i++) {
        valid = required(val[i])
        if (!valid) {
          break
        }
      }
      return valid
    } else {
      return false
    }
  } else if (typeof val === 'number' || typeof val === 'function') {
    return true
  } else if (typeof val === 'boolean') {
    return val
  } else if (typeof val === 'string') {
    return val.length > 0
  } else if (val !== null && typeof val === 'object') {
    return Object.keys(val).length > 0
  } else if (val === null || val === undefined) {
    return false
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

export function pattern (val, pat) {
  if (typeof pat !== 'string') { return false }

  let match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'))
  if (!match) { return false }

  return new RegExp(match[1], match[2]).test(val)
}


/**
 * minlength
 *
 * This function validate whether the minimum length.
 *
 * @param {String|Array} val
 * @param {String|Number} min
 * @return {Boolean}
 */

export function minlength (val, min) {
  if (typeof val === 'string') {
    return isInteger(min, 10) && val.length >= parseInt(min, 10)
  } else if (Array.isArray(val)) {
    return val.length >= parseInt(min, 10)
  } else {
    return false
  }
}


/**
 * maxlength
 *
 * This function validate whether the maximum length.
 *
 * @param {String|Array} val
 * @param {String|Number} max
 * @return {Boolean}
 */

export function maxlength (val, max) {
  if (typeof val === 'string') {
    return isInteger(max, 10) && val.length <= parseInt(max, 10)
  } else if (Array.isArray(val)) {
    return val.length <= parseInt(max, 10)
  } else {
    return false
  }
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

export function min (val, arg) {
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

export function max (val, arg) {
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
