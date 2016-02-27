import util, { empty, each, pull } from './util'
import BaseValidation from './validations/base'
import CheckboxValidation from './validations/checkbox'
import RadioValidation from './validations/radio'
import SelectValidation from './validations/select'


const eventRE = /^v-on:|^@/


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
    this._events = {}
    this._modified = false

    each(groups, (group) => {
      this._groupValidations[group] = []
    }, this)
  }

  enableReactive () {
    // define the validation scope
    util.Vue.util.defineReactive(this._dir.vm, this.name, this._scope)
    this._dir.vm._validatorMaps[this.name] = this

    // define the validation resetting meta method to vue instance
    this._dir.vm.$resetValidation = () => {
      this.resetValidation()
    }

    // define the validate manually meta method to vue instance
    this._dir.vm.$validate = (...args) => {
      let field = null
      let touched = false

      if (args.length === 1) {
        if (typeof args[0] === 'string') {
          field = args[0]
        } else if (typeof args[0] === 'boolean') {
          touched = args[0]
        }
      } else if (args.length === 2) {
        field = args[0]
        touched = args[1]
      }

      this._validate(field, touched)
    }

    // define manually the validation errors
    this._dir.vm.$setValidationErrors = (errors) => {
      this._setValidationErrors(errors)
    }
  }

  disableReactive () {
    this._dir.vm.$setValidationErrors = undefined
    this._dir.vm.$validate = undefined
    this._dir.vm.$validatorReset = undefined
    this._dir.vm._validatorMaps[this.name] = null
    this._dir.vm[this.name] = null
  }

  registerEvents () {
    let attrs = this._dir.el.attributes
    for (let i = 0, l = attrs.length; i < l; i++) {
      let event = attrs[i].name
      if (eventRE.test(event)) {
        event = event.replace(eventRE, '')
        this._events[this._getEventName(event)] = this._dir.vm.$eval(attrs[i].value, true)
      }
    }
  }

  unregisterEvents () {
    each(this._events, (handler, event) => {
      this._events[event] = null
      delete this._events[event]
    }, this)
  }

  _validate (field, touched) {
    if (!field) { // all
      each(this.validations, (validation, key) => {
        validation.willUpdateFlags(touched)
      })
      this.validate()
    } else { // each field
      let validation = this._validations[field]
      if (!validation && this._checkboxValidations[field]) {
        validation = this._checkboxValidations[field].validation
      } else if (!validation && this._radioValidations[field]) {
        validation = this._radioValidations[field].validation
      }

      if (validation) {
        validation.willUpdateFlags(touched)
        let res = validation.validate()
        util.Vue.set(this._scope, field, res)

        if (this._scope.dirty) {
          this._fireEvent('dirty')
        }

        if (this._modified !== this._scope.modified) {
          this._fireEvent('modified', this._scope.modified)
          this._modified = this._scope.modified
        }

        let valid = this._scope.valid
        this._fireEvent((valid ? 'valid' : 'invalid'))
      }
    }
  }

  resetValidation () {
    each(this._validations, (validation, key) => {
      validation.reset()
    }, this)

    each(this._checkboxValidations, (dataset, key) => {
      dataset.validation.reset()
    }, this)

    each(this._radioValidations, (dataset, key) => {
      dataset.validation.reset()
    }, this)

    this.validate()
  }

  _setValidationErrors (errors) {
    const extend = util.Vue.util.extend

    // make tempolaly errors
    let temp = {}
    each(errors, (error, index) => {
      if (!temp[error.field]) {
        temp[error.field] = []
      }
      temp[error.field].push(error)
    })

    // set errors
    each(temp, (values, field) => {
      let validation = this._scope[field]
      let newValidation = {}
      each(values, (error) => {
        if (error.validator) {
          validation[error.validator] = error.message
        }
      })
      validation.valid = false
      validation.invalid = true
      validation.errors = values
      extend(newValidation, validation)
      util.Vue.set(this._scope, field, newValidation)
    }, this)
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

  manageValidation (field, model, vm, el, scope, detectBlur, detectChange) {
    let validation = null

    if (el.tagName === 'SELECT') {
      validation = this._manageSelectValidation(
        field, model, vm, el, scope, detectBlur, detectChange
      )
    } else if (el.type === 'checkbox') {
      validation = this._manageCheckboxValidation(
        field, model, vm, el, scope, detectBlur, detectChange
      )
    } else if (el.type === 'radio') {
      validation = this._manageRadioValidation(
        field, model, vm, el, scope, detectBlur, detectChange
      )
    } else {
      validation = this._manageBaseValidation(
        field, model, vm, el, scope, detectBlur, detectChange
      )
    }

    return validation
  }

  unmanageValidation (field, el) {
    if (el.type === 'checkbox') {
      this._unmanageCheckboxValidation(field, el)
    } else if (el.type === 'radio') {
      this._unmanageRadioValidation(field, el)
    } else if (el.tagName === 'SELECT') {
      this._unmanageSelectValidation(field, el)
    } else {
      this._unmanageBaseValidation(field, el)
    }
  }

  _manageBaseValidation (field, model, vm, el, scope, detectBlur, detectChange) {
    let validation = this._validations[field] = new BaseValidation(
      field, model, vm, el, scope, this, detectBlur, detectChange
    )
    validation.manageElement(el)
    return validation
  }

  _unmanageBaseValidation (field, el) {
    let validation = this._validations[field]
    if (validation) {
      validation.unmanageElement(el)
      util.Vue.delete(this._scope, field)
      this._validations[field] = null
      delete this._validations[field]
    }
  }

  _manageCheckboxValidation (field, model, vm, el, scope, detectBlur, detectChange) {
    let validationSet = this._checkboxValidations[field]
    if (!validationSet) {
      let validation = new CheckboxValidation(field, model, vm, el, scope, this, detectBlur, detectChange)
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
        delete this._checkboxValidations[field]
      }
    }
  }

  _manageRadioValidation (field, model, vm, el, scope, detectBlur, detectChange) {
    let validationSet = this._radioValidations[field]
    if (!validationSet) {
      let validation = new RadioValidation(field, model, vm, el, scope, this, detectBlur, detectChange)
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
        delete this._radioValidations[field]
      }
    }
  }

  _manageSelectValidation (field, model, vm, el, scope, detectBlur, detectChange) {
    let validation = this._validations[field] = new SelectValidation(
        field, model, vm, el, scope, this, detectBlur, detectChange
    )
    validation.manageElement(el)
    return validation
  }

  _unmanageSelectValidation (field, el) {
    let validation = this._validations[field]
    if (validation) {
      validation.unmanageElement(el)
      util.Vue.delete(this._scope, field)
      this._validations[field] = null
      delete this._validations[field]
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

  validate () {
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

    if (this._scope.touched) {
      this._fireEvent('touched')
    }

    if (this._scope.dirty) {
      this._fireEvent('dirty')
    }

    if (this._modified !== this._scope.modified) {
      this._fireEvent('modified', this._scope.modified)
      this._modified = this._scope.modified
    }

    let valid = this._scope.valid
    this._fireEvent((valid ? 'valid' : 'invalid'))
  }

  setupScope () {
    let validationsGetter = () => { return this.validations }
    let scopeGetter = () => { return this._scope }
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

  _fireEvent (type, ...args) {
    let handler = this._events[this._getEventName(type)]
    handler && handler.apply(null, args)
  }

  _getEventName (type) {
    return this.name + ':' + type
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
      errors: { fn: this._defineErrors, arg: validationsGetter }
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

  _defineErrors (validationsGetter) {
    const hasOwn = util.Vue.util.hasOwn
    const isPlainObject = util.Vue.util.isPlainObject
    let errors = []

    each(validationsGetter(), (validation, key) => {
      if (hasOwn(this._scope, validation.field)) {
        let target = this._scope[validation.field]
        if (target && !empty(target.errors)) {
          each(target.errors, (err, index) => {
            let error = { field: validation.field }
            if (isPlainObject(err)) {
              if (err.validator) {
                error.validator = err.validator
              }
              error.message = err.message
            } else if (typeof err === 'string') {
              error.message = err
            }
            errors.push(error)
          }, this)
        }
      }
    }, this)

    return empty(errors) ? undefined : errors
  }
}
