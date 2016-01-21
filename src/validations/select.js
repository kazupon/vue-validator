import util, { attr } from '../util'
import BaseValidation from './base'


/**
 * SelectValidation class
 */

export default class SelectValidation extends BaseValidation {

  constructor (field, vm, el, scope, validator) {
    super(field, vm, el, scope, validator)

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

  _setOption (values, el) {
    for (let i = 0, l = values.length; i < l; i++) {
      let value = values[i]
      for (let j = 0, m = el.options.length; j < m; j++) {
        let option = el.options[j]
        if (!option.disabled && option.value === value && 
            (!option.hasAttribute('selected') || !option.selected)) {
          option.selected = true
        }
      }
    }
  }

  manageElement (el) {
    const _ = util.Vue.util

    let scope = this._getScope()
    let model = attr(el, 'v-model')
    if (model) {
      let value = scope.$get(model)
      let values = !Array.isArray(value) ? [value] : value
      this._setOption(values, el)
      this._unwatch = scope.$watch(model, _.bind((val, old) => {
        let values1 = !Array.isArray(val) ? [val] : val
        let values2 = !Array.isArray(old) ? [old] : old
        if (values1.slice().sort().toString() !== values2.slice().sort().toString()) {
          this.handleValidate(el)
        }
      }, this))
    }
  }

  unmanageElement (el) {
    if (this._unwatch) {
      this._unwatch()
    }
  }

  _checkModified (target) {
    let values = this._getValue(target).slice().sort()
    if (this._init.length !== values.length) {
      return true
    } else {
      let inits = this._init.slice().sort()
      return inits.toString() !== values.toString()
    }
  }
}
