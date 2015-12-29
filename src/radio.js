import util, { empty, each, trigger } from './util'
import Validation from './validation'


/**
 * RadioValidation class
 */

export default class RadioValidation extends Validation {

  constructor (field, vm, el, validator) {
    super(field, vm, el, validator)

    this._init = el.checked
    this._inits = []
  }

  manageElement (el) {
    let item = {
      el: el,
      init: el.checked,
      value: el.value
    }
    this._inits.push(item)
    this._validator.validate()
  }

  unmanageElement (el) {
    let found = -1
    each(this._inits, (item, index) => {
      if (item.el === el) {
        found = index
      }
    })
    if (found === -1) { return false }

    this._inits.splice(found, 1)
    this._validator.validate()
    return true
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
    if (this._inits.length === 0) {
      return target.checked
    } else {
      let modified = false
      each(this._inits, (item, index) => {
        if (!modified) {
          modified = (item.init !== item.el.checked)
        }
      })
      return modified
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
        let ret = validator.call(this._vm, this._getValue(), descriptor.arg)
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

  _getValue () {
    if (this._inits.length === 0) {
      return this._init
    } else {
      let vals = []
      each(this._inits, (item, index) => {
        if (item.el.checked) {
          vals.push(item.el.value)
        }
      })
      return vals
    }
  }
}
