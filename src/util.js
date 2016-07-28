/* @flow */

/**
 * Utilties
 */

// export default for holding the Vue reference
var exports: any = {}
export default exports

/**
 * warn
 */
export function warn (msg: string, err?: Error) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}

/**
 * empty
 */
export function empty (target: Array<any> | Object): boolean {
  if (target === null || target === undefined) { return true }

  if (Array.isArray(target)) {
    if (target.length > 0) { return false }
    if (target.length === 0) { return true }
  } else if (exports.Vue.util.isPlainObject(target)) {
    let key
    for (key in target) {
      if (exports.Vue.util.hasOwn(target, key)) { return false }
    }
  }

  return true
}

/**
 * each
 */
export function each (target: Array<any> | Object, iterator: Function, context?: Object) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      iterator.call(context || target[i], target[i], i)
    }
  } else if (exports.Vue.util.isPlainObject(target)) {
    const hasOwn = exports.Vue.util.hasOwn
    let key
    for (key in target) {
      if (hasOwn(target, key)) {
        iterator.call(context || target[key], target[key], key)
      }
    }
  }
}

/**
 * pull
 */
export function pull (arr: Array<any>, item: Object): any | null {
  const index = exports.Vue.util.indexOf(arr, item)
  return ~index ? arr.splice(index, 1) : null
}

/**
 * attr
 *
 */
export function attr (el: any, name: string): string | null {
  return el ? el.getAttribute(name) : null
}

/**
 * trigger
 */
export function trigger (el: any, event: string, args?: Object) {
  const e: any = document.createEvent('HTMLEvents')
  e.initEvent(event, true, false)

  if (args) {
    let prop
    for (prop in args) {
      e[prop] = args[prop]
    }
  }

  // Due to Firefox bug, events fired on disabled
  // non-attached form controls can throw errors
  try { el.dispatchEvent(e) } catch (e) {}
}

/**
 * Togging classes
 */
export function toggleClasses (el: Element, key: string, fn: Function) {
  key = key.trim()
  if (key.indexOf(' ') === -1) {
    fn(el, key)
    return
  }

  const keys = key.split(/\s+/)
  for (let i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i])
  }
}
