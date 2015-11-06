import util, { warn } from './util'
import Asset from './asset'
import Validate from './directives/validate'
import Validator from './directives/validator'
import Validation from './validation'


/**
 * VueValidator class
 */

export default class VueValidator {

  /**
   * @param {Object} options
   */

  constructor (options = {}) {
    this._validationContainer = Object.create(null)
  }

  /**
   * Install
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

    Validator(Vue)
    Validate(Vue)
  }

  /**
   * find a validation
   * 
   * @param {String} name
   * @param {Object} dir
   */

  findValidation (name, dir) {
    return util.Vue.util.indexOf(this._validationContainer[name] || [], dir)
  }

  /**
   * add a validation
   *
   * @param {String} name
   * @param {Object} validation
   */

  addValidation (name, validation) {
    let validations = this._validationContainer[name] || []
    validations.push(validation)
    this._validationContainer[name] = validations
  }

  /**
   * remove a validation
   *
   * @param {String} name
   * @param {Object} validation
   */

  removeValidation (name, validation) {
    if (!~util.Vue.util.indexOf(this._validationContainer[name] || [], validation)) {
      warn('not managed ' + name + ' validations')
      return
    }

    let validations = this._validationContainer[name]
    validations.$remove(validation)

    if (validations.length === 0) {
      this._validationContainer[name] = null
    }
  }
}
