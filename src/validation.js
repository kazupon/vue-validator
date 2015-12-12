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

  setValidation (name, arg, msg, fn) {
    const resolveAsset = util.Vue.util.resolveAsset

    let validator = this.validators[name]
    if (!validator) {
      validator = this.validators[name] = {}
      validator.fn = resolveAsset(this.dir.vm.$options, 'validators', name)
    }
    
    validator.arg = arg
    if (msg) {
      validator.msg = msg
    }

    if (fn) {
      validator.fn = fn
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
    const extend = util.Vue.util.extend
    let ret = Object.create(null)
    let messages = Object.create(null)
    let valid = true

    each(this.validators, (descriptor, name) => {
      let res = descriptor.fn.call(this.dir.vm, this.el.value, descriptor.arg)
      if (!res) {
        valid = false
        let msg = descriptor.msg
        if (msg) {
          messages[name] = typeof msg === 'function' ? msg() : msg
        }
      }
      ret[name] = !res
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
    extend(ret, props)

    return ret
  }
}
