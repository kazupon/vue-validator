/* @flow */
import { looseEqual } from '../util'

export default class MultiElement {
  _vm: Component
  initValue: any

  constructor (vm: Component) {
    this._vm = vm
    this.initValue = this.getValue()
  }

  getValue (): any {
    return getCheckedValue(this._vm.$el)
  }

  checkModified (): boolean {
    return !looseEqual(this.initValue, getCheckedValue(this._vm.$el))
  }
}

function getCheckedValue (el): Array<any> {
  const value: Array<any> = []
  const items = el.querySelectorAll('input[type="checkbox"], input[type="radio"]')
  items.forEach(item => {
    if (!item.disabled && item.checked) {
      value.push(item.value)
    }
  })
  return value
}
