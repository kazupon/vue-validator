import util, { empty, each, trigger } from './util'


/**
 * Validation class
 */

export default class Validation {

  constructor (dir) {
    const camelize = util.Vue.util.camelize

    this.model = camelize(dir.arg)
    this.el = dir.el
    this.dir = dir
    this.init = dir.el.value
    this.touched = false
    this.dirty = false
    this.modified = false
    this.validators = Object.create(null)
  }

  setValidation (name, arg, msg) {
    let validator = this.validators[name]
    if (!validator) {
      validator = this.validators[name] = {}
      validator.name = name
    }
    
    validator.arg = arg
    if (msg) {
      validator.msg = msg
    }
  }

  listener (e) {
    if (e.relatedTarget && 
      (e.relatedTarget.tagName === 'A' || e.relatedTarget.tagName === 'BUTTON')) {
      return
    }

    if (e.type === 'blur') {
      this.touched = true
    }

    if (!this.dirty && this.el.value !== this.init) {
      this.dirty = true
    }

    this.modified = (this.el.value !== this.init)

    this.dir.validator.validate()
  }

  validate () {
    const _ = util.Vue.util

    let results = Object.create(null)
    let messages = Object.create(null)
    let valid = true

    each(this.validators, (descriptor, name) => {
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
        let ret = validator.call(this.dir.vm, this.el.value, descriptor.arg)
        if (!ret) {
          valid = false
          if (msg) {
            messages[name] = typeof msg === 'function' 
              ? msg.call(this.dir.vm, this.model, descriptor.arg) 
              : msg
          }
        }
        results[name] = !ret
      }
    }, this)

    trigger(this.el, valid ? 'valid' : 'invalid')

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

  _resolveValidator (name) {
    const resolveAsset = util.Vue.util.resolveAsset
    return resolveAsset(this.dir.vm.$options, 'validators', name)
  }
}
