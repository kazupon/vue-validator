import util, { empty, each, trigger } from './util'
import Validation from './validation'


/**
 * SelectValidation class
 */

export default class SelectValidation extends Validation {

  constructor (field, vm, el, validator) {
    super(field, vm, el, validator)

    this._multiple = this._el.hasAttribute('multiple')
    this._init = this._getValue(this._el)
  }

  listener (e) {
    if (e.relatedTarget && 
      (e.relatedTarget.tagName === 'A' || e.relatedTarget.tagName === 'BUTTON')) {
      return
    }

    if (e.type === 'blur') {
      this.touched = true
    }

    if (!this.dirty && this._checkModified(e.target)) {
      this.dirty = true
    }

    this.modified = this._checkModified(e.target)

    this._validator.validate()
  }

  _checkModified (target) {
    let values = this._getValue(target).sort()
    if (this._init.length !== values.length) {
      return true
    } else {
      let inits = this._init.sort()
      return inits.toString() !== values.toString()
    }
  }

  validate () {
    const _ = util.Vue.util

    let results = {}
    let messages = {}
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
            messages[name] = typeof msg === 'function' 
              ? msg.call(this._vm, this.field, descriptor.arg) 
              : msg
          }
        }
        results[name] = !ret
      }
    }, this)

    trigger(this._el, valid ? 'valid' : 'invalid')

    let props = {
      valid: valid,
      invalid: !valid,
      touched: this.touched,
      untouched: !this.touched,
      dirty: this.dirty,
      pristine: !this.dirty,
      modified: this.modified
    }
    if (!empty(messages)) {
      props.messages = messages
    }
    _.extend(results, props)

    return results
  }

  _getValue (el) {
    let ret = []

    for (let i = 0, l = el.options.length; i < l; i++) {
      let option = el.options[i]
      if (!option.disabled && option.selected) {
        ret.push(option.value)
      }
    }

    return ret
  }
}
