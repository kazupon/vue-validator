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
