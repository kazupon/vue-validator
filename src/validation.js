import util, { warn, each } from './util'


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

    console.log('Validation', this)
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

  updateValidate (name, arg, fn) {
    if (this.validates[name]) {
      this.validates[name].arg = arg
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
      this.dirty = true;
    }

    this.modified = (this.el.value !== this.init)

    this.dir.validator.validate()
  }

  validate () {
    const extend = util.Vue.util.extend
    let ret = {}
    let valid = true

    each(this.validates, (descriptor, name) => {
      let res = descriptor.fn(this.el.value, descriptor.arg)
      if (!res) {
        valid = false
      }
      ret[name] = !res
    }, this)

    extend(ret, {
      valid: valid,
      invalid: !valid,
      touched: this.touched,
      untouched: !this.touched,
      dirty: this.dirty,
      pristine: !this.dirty,
      modified: this.modified
    })

    return ret
  }
}
