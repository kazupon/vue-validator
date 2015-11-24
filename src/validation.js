import util, { empty, each, trigger } from './util'


/**
 * Validation class
 */

export default class Validation {

  constructor (dir) {
    this.model = dir.arg
    this.el = dir.el
    this.dir = dir
    this.init = dir.el.value
    this.touched = false
    this.dirty = false
    this.modified = false
    this.validates = this._buildValidates(dir)
  }

  _buildValidates (dir, arg = null) {
    const resolveAsset = util.Vue.util.resolveAsset
    const camelize = util.Vue.util.camelize

    let ret = Object.create(null)
    let validates = dir.modifiers

    for (let validate in validates) {
      let fn = resolveAsset(dir.vm.$options, 'validators', camelize(validate))
      if (fn) {
        ret[validate] = { arg: arg, fn: fn }
      }
    }

    return ret
  }

  updateValidate (name, arg, msg, fn) {
    if (this.validates[name]) {
      this.validates[name].arg = arg
      if (msg) {
        this.validates[name].msg = msg
      }
      if (fn) {
        this.validates[name].fn = fn
      }
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

    each(this.validates, (descriptor, name) => {
      let res = descriptor.fn(this.el.value, descriptor.arg)
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
