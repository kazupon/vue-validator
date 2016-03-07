import { each } from '../util'
import BaseValidation from './base'


/**
 * RadioValidation class
 */

export default class RadioValidation extends BaseValidation {

  constructor (field, model, vm, el, scope, validator, detectBlur, detectChange) {
    super(field, model, vm, el, scope, validator, detectBlur, detectChange)

    this._inits = []
  }

  manageElement (el) {
    const scope = this._getScope()
    let item = this._addItem(el)
    const model = item.model = this._model
    if (model) {
      let value = scope.$get(model)
      this._setChecked(value, el, item)
      item.unwatch = scope.$watch(model, (val, old) => {
        if (val !== old) {
          if (this.guardValidate(item.el, 'change')) {
            return
          }
          this.handleValidate(el)
        }
      })
    } else {
      this._validator.validate()
    }
  }

  unmanageElement (el) {
    let found = -1
    each(this._inits, (item, index) => {
      if (item.el === el) {
        found = index
      }
    })
    if (found === -1) { return }

    this._inits.splice(found, 1)
    this._validator.validate()
  }

  willUpdateFlags () {
    each(this._inits, (item, index) => {
      this.willUpdateDirty(item.el)
      this.willUpdateModified(item.el)
    })
  }

  reset () {
    this.resetFlags()
    each(this._inits, (item, index) => {
      item.init = item.el.checked
      item.value = item.el.value
    })
  }

  _addItem (el) {
    let item = {
      el: el,
      init: el.checked,
      value: el.value
    }
    this._inits.push(item)
    return item
  }

  _setChecked (value, el, item) {
    if (el.value === value) {
      el.checked = true
      this._init = el.checked
      item.init = el.checked
      item.value = value
    }
  }

  _getValue (el) {
    if (!this._inits || this._inits.length === 0) {
      return el.checked
    } else {
      let vals = []
      each(this._inits, (item, index) => {
        item.el.checked && vals.push(item.el.value)
      })
      return vals
    }
  }

  _checkModified (target) {
    if (this._inits.length === 0) {
      return this._init !== target.checked
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
}
