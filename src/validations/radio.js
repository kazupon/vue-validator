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

  manageElement (el, initial) {
    const scope = this._getScope()
    let item = this._addItem(el, initial)

    const model = item.model = this._model
    if (model) {
      let value = this._evalModel(model, this._filters)
      this._setChecked(value, el, item)
      item.unwatch = scope.$watch(model, (val, old) => {
        if (val !== old) {
          if (this.guardValidate(item.el, 'change')) {
            return
          }

          this.handleValidate(el, { noopable: item.initial })
          if (item.initial) {
            item.initial = null
          }
        }
      })
    } else {
      let options = { field: this.field, noopable: initial }
      if (this._checkClassIds(el)) {
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

  willUpdateFlags (touched = false) {
    each(this._inits, (item, index) => {
      touched && this.willUpdateTouched(item.el, 'blur')
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
    if (el) { // for another element
      this._updateClasses(el, results)
    } else {
      each(this._inits, (item, index) => {
        this._updateClasses(item.el, results)
      })
    }
  }

  _addItem (el, initial) {
    let item = {
      el: el,
      init: el.checked,
      value: el.value,
      initial: initial
    }

    const classIds = el.getAttribute(VALIDATE_UPDATE)
    if (classIds) {
      el.removeAttribute(VALIDATE_UPDATE)
      item.classIds = classIds.split(',')
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

  _getClassIds (el) {
    let classIds
    each(this._inits, (item, index) => {
      if (item.el === el) {
        classIds = item.classIds
      }
    })
    return classIds
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
