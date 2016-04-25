import { VALIDATE_UPDATE } from '../const'
import { each } from '../util'
import BaseValidation from './base'


/**
 * RadioValidation class
 */

export default class RadioValidation extends BaseValidation {

  constructor (field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
    super(field, model, vm, el, scope, validator, filters, detectBlur, detectChange)

    this._inits = []
  }

  manageElement (el) {
    const scope = this._getScope()
    let item = this._addItem(el)

    const model = item.model = this._model
    if (model) {
      let value = this._evalModel(model, this._filters)
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
      let options = { field: this.field }
      if (this._checkActiveIds(el)) {
        options.el = el
      }
      this._validator.validate(options)
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
    this._validator.validate({ field: this.field })
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

  updateClasses (results, el = null) {
    if (el) { // for validation active classes
      this._updateClasses(el, results)
    } else {
      each(this._inits, (item, index) => {
        this._updateClasses(item.el, results)
      })
    }
  }

  _addItem (el) {
    let item = {
      el: el,
      init: el.checked,
      value: el.value
    }

    const activeIds = el.getAttribute(VALIDATE_UPDATE)
    if (activeIds) {
      el.removeAttribute(VALIDATE_UPDATE)
      item.activeIds = activeIds.split(',')
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

  _getActiveIds (el) {
    let activeIds
    each(this._inits, (item, index) => {
      if (item.el === el) {
        activeIds = item.activeIds
      }
    })
    return activeIds
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

  _checkActiveIds (el) {
    return this._getActiveIds(el)
  }
}
