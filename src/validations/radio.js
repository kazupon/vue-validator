import util, { each, attr } from '../util'
import BaseValidation from './base'


/**
 * RadioValidation class
 */

export default class RadioValidation extends BaseValidation {

  constructor (field, vm, el, scope, validator) {
    super(field, vm, el, scope, validator)

    this._inits = []
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

  manageElement (el) {
    const _ = util.Vue.util

    let item = this._addItem(el)
    let scope = this._getScope()
    let model = item.model = attr(el, 'v-model')
    if (model) {
      let value = scope.$get(model)
      this._setChecked(value, el, item)
      item.unwatch = scope.$watch(model, _.bind((val, old) => {
        if (val !== old) {
          this.handleValidate(el)
        }
      }, this))
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

  _getValue (el) {
    if (!this._inits || this._inits.length === 0) {
      return el.checked
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
