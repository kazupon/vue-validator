import * as validators from './validators'

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
    Vue.options.validators = validators
    VueValidator.Vue = Vue
  }

  /**
   * assets
   *
   * @param {String} id
   * @param {Function} definition
   * @return {Function} validator
   */
  static assets (id, definition) {
    let asset = null
    let Vue = VueValidator.Vue

    if (!definition) {
      asset = Vue.util.resolveAsset(Vue.options, 'validators', id)
    } else {
      Vue.options.validators[id] = definition
    }

    return asset
  }
}
