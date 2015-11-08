import util, { warn, each, pull } from './util'


/**
 * Validator class
 */

export default class Validator {

  constructor (name, dir) {
    this.name = name
    this.scope = { a: 1 }

    this._dir = dir // TODO: need ?
    this._validations = []
  }

  setupScope () {
    const bind = util.Vue.util.bind

    each({
      valid: this._defineValid,
      invalid: this._defineInvalid,
      touched: this._defineTouched,
      untouched: this._defineUntouched,
      modified: this._defineModified,
      dirty: this._defineDirty,
      pristine: this._definePristine
    }, (getter, name) => {
      Object.defineProperty(this.scope, name, {
        enumerable: true,
        configurable: true,
        get: bind(getter, this)
      })
    }, this)
  }

  _defineValid () {
    let ret = true

    each(this._validations, (validation, index) => {
      if (!ret) { return }
      let target = this.scope[validation.model]
      if (!target.valid) {
        ret = false
      }
    }, this)

    return ret
  }

  _defineInvalid () {
    return !this.scope.valid
  }

  _defineTouched () {
    let ret = false

    each(this._validations, (validation, index) => {
      if (ret) { return }
      let target = this.scope[validation.model]
      if (target.touched) {
        ret = true
      }
    }, this)

    return ret
  }

  _defineUntouched () {
    return !this.scope.touched
  }

  _defineModified () {
    let ret = false

    each(this._validations, (validation, index) => {
      if (ret) { return }
      let target = this.scope[validation.model]
      if (target.modified) {
        ret = true
      }
    }, this)

    return ret
  }

  _defineDirty () {
    let ret = false

    each(this._validations, (validation, index) => {
      if (ret) { return }
      let target = this.scope[validation.model]
      if (target.dirty) {
        ret = true
      }
    }, this)

    return ret
  }

  _definePristine () {
    return !this.scope.dirty
  }

  addValidation (validation) {
    this._validations.push(validation)
  }

  removeValidation (validation) {
    util.Vue.util.delete(this.scope, validation.model)
    pull(this._validations, validation)
  }

  validate (validation) {
    each(this._validations, (validation, index) => {
      let res = validation.validate()
      util.Vue.util.set(this.scope, validation.model, res)
    }, this)
  }
}
