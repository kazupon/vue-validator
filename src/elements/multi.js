/* @flow */
import { looseEqual } from '../util'

export default class MultiElement {
  _vm: ValidityComponent
  initValue: any
  constructor (vm: ValidityComponent) {
    // TODO: should be checked whether included radio or checkbox
    this._vm = vm
    this.initValue = this.getValue()
  }

  getValue (): any {
    return this.getCheckedValue()
  }

  checkModified (): boolean {
    return !looseEqual(this.initValue, this.getCheckedValue())
  }

  listenToucheableEvent (): void {
    this.eachItems(item => {
      item.addEventListener('focusout', this._vm.willUpdateTouched)
    })
  }

  unlistenToucheableEvent (): void {
    this.eachItems(item => {
      item.removeEventListener('focusout', this._vm.willUpdateTouched)
    })
  }

  listenInputableEvent (): void {
    this.eachItems(item => {
      item.addEventListener('change', this._vm.handleInputable)
    })
  }

  unlistenInputableEvent (): void {
    this.eachItems(item => {
      item.removeEventListener('change', this._vm.handleInputable)
    })
  }

  getCheckedValue (): Array<any> {
    const value: Array<any> = []
    this.eachItems(item => {
      if (!item.disabled && item.checked) {
        value.push(item.value)
      }
    })
    return value
  }

  getItems (): Array<any> {
    return this._vm.$el.querySelectorAll('input[type="checkbox"], input[type="radio"]')
  }

  eachItems (cb: Function): void {
    const items = this.getItems()
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      cb(item)
    }
  }
}
