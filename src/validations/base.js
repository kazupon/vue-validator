import util, { empty, each, trigger } from '../util'


/**
 * BaseValidation class
 */

export default class BaseValidation {

  constructor (field, model, vm, el, scope, validator) {
    this.field = field
    this.touched = false
    this.dirty = false
    this.modified = false

    this._modified = false
    this._model = model
    this._validator = validator
    this._vm = vm
    this._el = el
    this._forScope = scope
    this._init = this._getValue(el)
    this._validators = {}
  }

  manageElement (el) {
    let scope = this._getScope()
    let model = this._model
    if (model) {
      el.value = scope.$get(model) || ''
      this._unwatch = scope.$watch(model, (val, old) => {
        if (val !== old) {
          this.handleValidate(el)
        }
      }, { deep: true })
    }
  }

  unmanageElement (el) {
    if (this._unwatch) {
      this._unwatch()
    }
  }

  setValidation (name, arg, msg) {
    let validator = this._validators[name]
    if (!validator) {
      validator = this._validators[name] = {}
      validator.name = name
    }
    
    validator.arg = arg
    if (msg) {
      validator.msg = msg
    }
  }

  willUpdateFlags () {
    this.willUpdateDirty(this._el)
    this.willUpdateModified(this._el)
  }

  willUpdateTouched (el, type) {
    if (type && type === 'blur') {
      this.touched = true
      this._fireEvent(el, 'touched')
    }
  }

  willUpdateDirty (el) {
    if (!this.dirty && this._checkModified(el)) {
      this.dirty = true
      this._fireEvent(el, 'dirty')
    }
  }

  willUpdateModified (el) {
    this.modified = this._checkModified(el)
    if (this._modified !== this.modified) {
      this._fireEvent(el, 'modified', { modified: this.modified })
      this._modified = this.modified
    }
  }

  listener (e) {
    if (e.relatedTarget && 
      (e.relatedTarget.tagName === 'A' || e.relatedTarget.tagName === 'BUTTON')) {
      return
    }

    this.handleValidate(e.target, e.type)
  }

  handleValidate (el, type) {
    this.willUpdateTouched(el, type)
    this.willUpdateDirty(el)
    this.willUpdateModified(el)

    this._validator.validate()
  }

  validate () {
    const _ = util.Vue.util

    let results = {}
    let errors = []
    let valid = true

    each(this._validators, (descriptor, name) => {
      let asset = this._resolveValidator(name)
      let validator = null
      let msg = null

      if (_.isPlainObject(asset)) {
        if (asset.check && typeof asset.check === 'function') {
          validator = asset.check
        }
        if (asset.message) {
          msg = asset.message
        }
      } else if (typeof asset === 'function') {
        validator = asset
      }

      if (descriptor.msg) {
        msg = descriptor.msg
      }

      if (validator) {
        let ret = validator.call(this._vm, this._getValue(this._el), descriptor.arg)
        if (!ret) {
          valid = false
          if (msg) {
            let error = { validator: name }
            error.message = typeof msg === 'function' 
              ? msg.call(this._vm, this.field, descriptor.arg) 
              : msg
            errors.push(error)
            results[name] = error.message
          } else {
            results[name] = !ret
          }
        } else {
          results[name] = !ret
        }
      }
    }, this)

    this._fireEvent(this._el, valid ? 'valid' : 'invalid')

    let props = {
      valid: valid,
      invalid: !valid,
      touched: this.touched,
      untouched: !this.touched,
      dirty: this.dirty,
      pristine: !this.dirty,
      modified: this.modified
    }
    if (!empty(errors)) {
      props.errors = errors
    }
    _.extend(results, props)

    return results
  }

  resetFlags () {
    this.touched = false
    this.dirty = false
    this.modified = false
    this._modified = false
  }

  reset () {
    this.resetFlags()
    this._init = this._getValue(this._el)
  }

  _getValue (el) {
    return el.value
  }

  _getScope () {
    return this._forScope || this._vm
  }

  _checkModified (target) {
    return this._init !== this._getValue(target)
  }

  _fireEvent (el, type, args) {
    trigger(el, type, args)
  }

  _resolveValidator (name) {
    const resolveAsset = util.Vue.util.resolveAsset
    return resolveAsset(this._vm.$options, 'validators', name)
  }

}
