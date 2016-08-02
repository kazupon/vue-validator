/* @flow */
import { looseEqual } from '../util'

export default class MultiElement {
  _vm: ValidityComponent
  initValue: any
  constructor (vm: ValidityComponent) {
    this._vm = vm
    this.initValue = this.getValue()
  }

  getValue (): any {
    return getCheckedValue(this._vm.$el)
  }

  checkModified (): boolean {
    return !looseEqual(this.initValue, getCheckedValue(this._vm.$el))
  }

  listenToucheableEvent (): void {
    this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched)
  }

  unlistenToucheableEvent (): void {
    this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched)
  }

  listenInputableEvent (): void {
    this._vm.$el.addEventListener('change', this._vm.handleInputable)
  }

  unlistenInputableEvent (): void {
    this._vm.$el.removeEventListener('change', this._vm.handleInputable)
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
