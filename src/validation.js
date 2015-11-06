import util, { warn } from './util'


/**
 * Validation class
 */

export default class Validation {

  constructor (name, value, el) {
    this.name = name
    this.value = value
    this.el = el
    this.touched = false
    this.dirty = false
    this.modified = false
    this.validates = Object.create(null)

    //let keys = Object.keys(dir.vm.$options.validators)
    //for (let key of keys) {
    //  this._validators[key] = util.Vue.util.resolveAsset(dir.vm.$options, 'validators', key)
    //}
  }

  addValidator ({ name, fn, constraint } = {}) {
    console.log('addValidator', name, fn, constraint)
    // TODO: check argument (name, fn)

    this._validators[name] = { fn, constraint }
    console.log('addValidator', this._validators[name])
  }

  updateValidator ({ name, fn, constraint } = {}) {
    // TODO: check argument (name, fn)
    let validator = this._validators[name]
    if (fn) {
      validator.fn = fn
    }
    if (constraint) {
      validator.constraint = constraint
    }
  }

  listener (e) {
    console.log('input event', e.type, this.el.value)

    if (e.relatedTarget && 
      (e.relatedTarget.tagName === 'A' || e.relatedTarget.tagName === 'BUTTON')) {
      return
    }

    if (e.type === 'blur') {
      console.log('blur event !!', this)
      this.touched = true
    }

    //if (this.el.value != this.value) {
    //  this.dirty = true;
    //}
    this.validate()
  }

  validate () {
  }
}
