import BaseValidation from './base'


/**
 * SelectValidation class
 */

export default class SelectValidation extends BaseValidation {

  constructor (field, vm, el, validator) {
    super(field, vm, el, validator)

    this._multiple = this._el.hasAttribute('multiple')
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

  _checkModified (target) {
    let values = this._getValue(target).sort()
    if (this._init.length !== values.length) {
      return true
    } else {
      let inits = this._init.sort()
      return inits.toString() !== values.toString()
    }
  }
}
