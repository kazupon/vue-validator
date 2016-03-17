import BaseValidation from './base'


/**
 * SelectValidation class
 */

export default class SelectValidation extends BaseValidation {

  constructor (field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
    super(field, model, vm, el, scope, validator, filters, detectBlur, detectChange)

    this._multiple = this._el.hasAttribute('multiple')
  }

  manageElement (el) {
    const scope = this._getScope()
    const model = this._model
    if (model) {
      const value = this._evalModel(model, this._filters)
      const values = !Array.isArray(value) ? [value] : value
      this._setOption(values, el)
      this._unwatch = scope.$watch(model, (val, old) => {
        let values1 = !Array.isArray(val) ? [val] : val
        let values2 = !Array.isArray(old) ? [old] : old
        if (values1.slice().sort().toString() !== values2.slice().sort().toString()) {
          if (this.guardValidate(el, 'change')) {
            return
          }
          this.handleValidate(el)
        }
      })
    }
  }

  unmanageElement (el) {
    this._unwatch && this._unwatch()
  }

  reset () {
    this.resetFlags()
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
        if (!option.disabled && option.value === value
          && (!option.hasAttribute('selected') || !option.selected)) {
          option.selected = true
        }
      }
    }
  }

  _checkModified (target) {
    const values = this._getValue(target).slice().sort()
    if (this._init.length !== values.length) {
      return true
    } else {
      let inits = this._init.slice().sort()
      return inits.toString() !== values.toString()
    }
  }
}
