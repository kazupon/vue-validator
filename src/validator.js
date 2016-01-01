import util, { empty, each, pull } from './util'
import BaseValidation from './validations/base'
import CheckboxValidation from './validations/checkbox'
import RadioValidation from './validations/radio'
import SelectValidation from './validations/select'


/**
 * Validator class
 */

export default class Validator {

  constructor (name, dir, groups) {
    this.name = name

    this._scope = {}
    this._dir = dir
    this._validations = {}
    this._checkboxValidations = {}
    this._radioValidations = {}
    this._groups = groups
    this._groupValidations = {}

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

  // TODO: should be improved performance (use cache)
  get validations () {
    const extend = util.Vue.util.extend

    let ret = {}
    extend(ret, this._validations)

    each(this._checkboxValidations, (dataset, key) => {
      ret[key] = dataset.validation
    }, this)

    each(this._radioValidations, (dataset, key) => {
      ret[key] = dataset.validation
    }, this)

    return ret
  }

  manageValidation (field, vm, el) {
    let validation = null

    if (el.tagName === 'SELECT') {
      validation = this._validations[field] = new SelectValidation(field, vm, el, this)
    } else if (el.type === 'checkbox') {
      validation = this._manageCheckboxValidation(field, vm, el)
    } else if (el.type === 'radio') {
      validation = this._manageRadioValidation(field, vm, el)
    } else {
      validation = this._validations[field] = new BaseValidation(field, vm, el, this)
    }

    return validation
  }

  unmanageValidation (field, el) {
    if (el.type === 'checkbox') {
      this._unmanageCheckboxValidation(field, el)
    } else if (el.type === 'radio') {
      this._unmanageRadioValidation(field, el)
    } else {
      util.Vue.delete(this._scope, field)
      this._validations[field] = null
    }
  }

  _manageCheckboxValidation (field, vm, el) {
    let validationSet = this._checkboxValidations[field]
    if (!validationSet) {
      let validation = new CheckboxValidation(field, vm, el, this)
      validationSet = { validation: validation, elements: 0 }
      this._checkboxValidations[field] = validationSet
    }

    validationSet.elements++
    validationSet.validation.manageElement(el)
    return validationSet.validation
  }

  _unmanageCheckboxValidation (field, el) {
    let validationSet = this._checkboxValidations[field]
    if (validationSet) {
      validationSet.elements--
      validationSet.validation.unmanageElement(el)
      if (validationSet.elements === 0) {
        util.Vue.delete(this._scope, field)
        this._checkboxValidations[field] = null
      }
    }
  }

  _manageRadioValidation (field, vm, el) {
    let validationSet = this._radioValidations[field]
    if (!validationSet) {
      let validation = new RadioValidation(field, vm, el, this)
      validationSet = { validation: validation, elements: 0 }
      this._radioValidations[field] = validationSet
    }

    validationSet.elements++
    validationSet.validation.manageElement(el)
    return validationSet.validation
  }

  _unmanageRadioValidation (field, el) {
    let validationSet = this._radioValidations[field]
    if (validationSet) {
      validationSet.elements--
      validationSet.validation.unmanageElement(el)
      if (validationSet.elements === 0) {
        util.Vue.delete(this._scope, field)
        this._radioValidations[field] = null
      }
    }
  }

  addGroupValidation (group, field) {
    const indexOf = util.Vue.util.indexOf

    let validation = this._validations[field] 
      || this._checkboxValidations[field].validation 
      || this._radioValidations[field].validation
    let validations = this._groupValidations[group]
    if (validations) {
      if (!~indexOf(validations, validation)) {
        validations.push(validation)
      }
    }
  }

  removeGroupValidation (group, field) {
    let validation = this._validations[field] 
      || this._checkboxValidations[field].validation 
      || this._radioValidations[field].validation
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

    each(this._checkboxValidations, (dataset, key) => {
      let res = dataset.validation.validate()
      util.Vue.set(this._scope, key, res)
    }, this)

    each(this._radioValidations, (dataset, key) => {
      let res = dataset.validation.validate()
      util.Vue.set(this._scope, key, res)
    }, this)
  }

  setupScope () {
    const bind = util.Vue.util.bind

    let validationsGetter = bind(() => { return this.validations }, this)
    let scopeGetter = bind(() => { return this._scope }, this)
    this._defineProperties(validationsGetter, scopeGetter)

    each(this._groups, (name) => {
      let validations = this._groupValidations[name]
      let group = {}
      util.Vue.set(this._scope, name, group)
      this._defineProperties(() => { return validations }, () => { return group })
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

  _defineProperties (validationsGetter, targetGetter) {
    const bind = util.Vue.util.bind

    each({
      valid: { fn: this._defineValid, arg: validationsGetter },
      invalid: { fn: this._defineInvalid, arg: targetGetter },
      touched: { fn: this._defineTouched, arg: validationsGetter },
      untouched: { fn: this._defineUntouched, arg: targetGetter },
      modified: { fn: this._defineModified, arg: validationsGetter },
      dirty: { fn: this._defineDirty, arg: validationsGetter },
      pristine: { fn: this._definePristine, arg: targetGetter },
      messages: { fn: this._defineMessages, arg: validationsGetter }
    }, (descriptor, name) => {
      Object.defineProperty(targetGetter(), name, {
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

  _defineValid (validationsGetter) {
    return this._walkValidations(validationsGetter(), 'valid', true)
  }

  _defineInvalid (scopeGetter) {
    return !scopeGetter().valid
  }

  _defineTouched (validationsGetter) {
    return this._walkValidations(validationsGetter(), 'touched', false)
  }

  _defineUntouched (scopeGetter) {
    return !scopeGetter().touched
  }

  _defineModified (validationsGetter) {
    return this._walkValidations(validationsGetter(), 'modified', false)
  }

  _defineDirty (validationsGetter) {
    return this._walkValidations(validationsGetter(), 'dirty', false)
  }

  _definePristine (scopeGetter) {
    return !scopeGetter().dirty
  }

  _defineMessages (validationsGetter) {
    const extend = util.Vue.util.extend
    const hasOwn = util.Vue.util.hasOwn
    let ret = {}

    each(validationsGetter(), (validation, key) => {
      if (hasOwn(this._scope, validation.field)) {
        let target = this._scope[validation.field]
        if (target && !empty(target['messages'])) {
          ret[validation.field] = extend({}, target['messages'])
        }
      }
    }, this)

    return empty(ret) ? undefined : ret
  }
}
