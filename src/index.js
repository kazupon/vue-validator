import util, { warn } from './util'
import Asset from './asset'


/**
 * VueValidator class
 */

export default class VueValidator {

  /**
   * install
   *
   * @param {Function} Vue
   * @param {Object} options
   */

  static install (Vue, options = {}) {
    if (VueValidator.installed) {
      warn('already installed.')
      return
    }

    Asset(Vue)
    util.Vue = Vue
  }
}
