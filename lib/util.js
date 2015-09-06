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

exports.warn = function (msg, err) {
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
