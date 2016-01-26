/**
 * Utilties
 */

// export default for holding the Vue reference
const exports = {}
export default exports


/**
 * warn
 *
 * @param {String} msg
 * @param {Error} [err]
 *
 */

export function warn (msg, err) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}

/**
 * empty
 *
 * @param {Array|Object} target
 * @return {Boolean}
 */

export function empty (target) {
  if (target === null) { return true }

  if (Array.isArray(target)) {
    if (target.length > 0) { return false }
    if (target.length === 0) { return true }
  } else if (exports.Vue.util.isPlainObject(target)) {
    for (let key in target) {
      if (exports.Vue.util.hasOwn(target, key)) { return false }
    }
  }

  return true
}

/**
 * each
 *
 * @param {Array|Object} target
 * @param {Function} iterator
 * @param {Object} [context]
 */

export function each (target, iterator, context) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      iterator.call(context || target[i], target[i], i)
    }
  } else if (exports.Vue.util.isPlainObject(target)) {
    const hasOwn = exports.Vue.util.hasOwn
    for (let key in target) {
      if (hasOwn(target, key)) {
        iterator.call(context || target[key], target[key], key)
      }
    }
  }
}

/**
 * pull
 *
 * @param {Array} arr
 * @param {Object} item
 * @return {Object|null}
 */

export function pull (arr, item) {
  let index = exports.Vue.util.indexOf(arr, item)
  return ~index ? arr.splice(index, 1) : null
}

/**
 * attr
 *
 * @param {Element} el
 * @param {String} name
 * @return {String|null}
 */

export function attr (el, name) {
  return el ? el.getAttribute(name) : null
}

/**
 * trigger
 *
 * @param {Element} el
 * @param {String} event
 * @param {Object} [args]
 */

export function trigger (el, event, args) {
  let e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, false)

  if (args) {
    for (let prop in args) {
      e[prop] = args[prop]
    }
  }

  // Due to Firefox bug, events fired on disabled
  // non-attached form controls can throw errors
  try { el.dispatchEvent(e) } catch (e) {}
}
