import util, { empty, each, pull } from './util'
import Validation from './validation'
import MultipleValidation from './multiple_validation'


/**
 * Validator class
 */

export default class Validator {

  constructor (name, dir, groups) {
    this.name = name

    this._scope = Object.create(null)
    this._dir = dir
    this._validations = Object.create(null)
    this._multipleValidations = Object.create(null)
    this._groups = groups
    this._groupValidations = Object.create(null)

    each(groups, (group) => {
      this._groupValidations[group] = []
    }, this)
  }

  enableReactive () {
    util.Vue.util.defineReactive(this._dir.vm, this.name, this._scope)
    this._dir.vm._validatorMaps[this.name] = this
  }

  disableReactive () {
    this._dir.vm._validatorMaps[this.name] = null
    this._dir.vm[this.name] = null
  }

  addValidation (field, vm, el) {
    let validation = this._validations[field] = new Validation(field, vm, el, this)
    return validation
  }

  removeValidation (field) {
    util.Vue.delete(this._scope, field)
    this._validations[field] = null
  }

  manageMultipleValidation (field, vm, el) {
    let validationSet = this._multipleValidations[field]
    if (!validationSet) {
      let validation = new MultipleValidation(field, vm, el, this)
      validationSet = { validation: validation, elements: 0 }
      this._multipleValidations[field] = validationSet
      this._defineProperties(this._multipleValidations[field].validation, this._scope)
    }

    validationSet.elements++
    validationSet.validation.manageElement(el)
    return validationSet.validation
  }

  unmanageMultipleValidation (field, el) {
    let validationSet = this._multipleValidations[field]
    if (validationSet) {
      validationSet.elements--
      validationSet.validation.unmanageElement(el)
      if (validationSet.elements === 0) {
        util.Vue.delete(this._scope, field)
        this._multipleValidations[field] = null
      }
    }
  }

  addGroupValidation (group, field) {
    const indexOf = util.Vue.util.indexOf

    let validation = this._validations[field] || this._multipleValidations[field].validation
    let validations = this._groupValidations[group]
    if (validations) {
      if (!~indexOf(validations, validation)) {
        validations.push(validation)
      }
    }
  }

  removeGroupValidation (group, field) {
    let validation = this._validations[field] || this._multipleValidations[field].validation
    let validations = this._groupValidations[group]
    if (validations) {
      pull(validations, validation)
    }
  }

  validate (validation) {
    each(this._validations, (validation, key) => {
      let res = validation.validate()
      util.Vue.set(this._scope, key, res)
    }, this)

    each(this._multipleValidations, (dataset, key) => {
      let res = dataset.validation.validate()
      util.Vue.set(this._scope, key, res)
    }, this)
  }

  setupScope () {
    this._defineProperties(this._validations, this._scope)

    each(this._groups, (name) => {
      let validations = this._groupValidations[name]
      let group = Object.create(null)
      util.Vue.set(this._scope, name, group)
      this._defineProperties(validations, group)
    }, this)
  }

  waitFor (cb) {
    let vm = this._dir.vm
    let method = '$activateValidator'

    this._dir.vm[method] = () => {
      cb()
      vm[method] = null
    }
  }

  _defineProperties (validations, target) {
    const bind = util.Vue.util.bind

    each({
      valid: { fn: this._defineValid, arg: validations },
      invalid: { fn: this._defineInvalid, arg: target },
      touched: { fn: this._defineTouched, arg: validations },
      untouched: { fn: this._defineUntouched, arg: target },
      modified: { fn: this._defineModified, arg: validations },
      dirty: { fn: this._defineDirty, arg: validations },
      pristine: { fn: this._definePristine, arg: target },
      messages: { fn: this._defineMessages, arg: validations }
    }, (descriptor, name) => {
      Object.defineProperty(target, name, {
        enumerable: true,
        configurable: true,
        get: () => {
          return bind(descriptor.fn, this)(descriptor.arg)
        }
      })
    }, this)
  }

  _walkValidations (validations, property, condition) {
    const hasOwn = util.Vue.util.hasOwn
    let ret = condition

    each(validations, (validation, key) => {
      if (ret === !condition) { return }
      if (hasOwn(this._scope, validation.field)) {
        var target = this._scope[validation.field]
        if (target && target[property] === !condition) {
          ret = !condition
        }
      }
    }, this)

    return ret
  }

  _defineValid (validations) {
    return this._walkValidations(validations, 'valid', true)
  }

  _defineInvalid (scope) {
    return !scope.valid
  }

  _defineTouched (validations) {
    return this._walkValidations(validations, 'touched', false)
  }

  _defineUntouched (scope) {
    return !scope.touched
  }

  _defineModified (validations) {
    return this._walkValidations(validations, 'modified', false)
  }

  _defineDirty (validations) {
    return this._walkValidations(validations, 'dirty', false)
  }

  _definePristine (scope) {
    return !scope.dirty
  }

  _defineMessages (validations) {
    const extend = util.Vue.util.extend
    const hasOwn = util.Vue.util.hasOwn
    let ret = Object.create(null)

    each(validations, (validation, key) => {
      if (hasOwn(this._scope, validation.field)) {
        let target = this._scope[validation.field]
        if (target && !empty(target['messages'])) {
          ret[validation.field] = extend(Object.create(null), target['messages'])
        }
      }
    }, this)

    return empty(ret) ? undefined : ret
  }
}
