/**
 * Utilties
 */


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
 * Get target validatable object
 *
 * @param {Object} validation
 * @param {String} keypath
 * @return {Object} validatable object
 */

exports.getTarget = function (validation, keypath) {
  var last = validation
  var keys = keypath.split('.')
  var key, obj
  for (var i = 0; i < keys.length; i++) {
    key = keys[i]
    obj = last[key]
    last = obj
    if (!last) {
      break
    }
  }
  return last
}

/**
 * Get custom validators
 *
 * @param {Object} options
 * @return {Object}
 */

exports.getCustomValidators = function (options) {
  var opts = options
  var validators = {}
  var key
  var context
  do {
    if (opts['validator'] && opts['validator']['validates']) {
      for (key in opts['validator']['validates']) {
        if (!validators.hasOwnProperty(key)) {
          validators[key] = opts['validator']['validates'][key]
        }
      }
    }
    context = opts._context || opts._parent
    if (context) {
      opts = context.$options
    }
  } while (context || opts._parent)
  return validators
}
