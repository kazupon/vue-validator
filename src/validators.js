/* @flow */
/**
 * build-in validators
 */

/**
 * required
 * This function validate whether the value has been filled out.
 */
export function required (val: any): boolean {
  if (Array.isArray(val)) {
    if (val.length !== 0) {
      let valid: boolean = true
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
  } else {
    return false
  }
}

/**
 * pattern
 * This function validate whether the value matches the regex pattern
 */
export function pattern (val: any, pat: any): boolean {
  if (typeof pat !== 'string') { return false }

  const match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'))
  if (!match) { return false }

  return new RegExp(match[1], match[2]).test(val)
}

/**
 * minlength
 * This function validate whether the minimum length.
 */
export function minlength (val: string | Array<any>, min: any): boolean {
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
 * This function validate whether the maximum length.
 */
export function maxlength (val: string | Array<any>, max: any): boolean {
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
 * This function validate whether the minimum value of the numberable value.
 */
export function min (val: any, arg: any): boolean {
  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) >= +(arg))
}

/**
 * max
 * This function validate whether the maximum value of the numberable value.
 */
export function max (val: any, arg: any): boolean {
  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) <= +(arg))
}

/**
 * isInteger
 * This function check whether the value of the string is integer.
 */
function isInteger (val: string): boolean {
  return /^(-?[1-9]\d*|0)$/.test(val)
}
