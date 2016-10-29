/* @flow */
import { triggerEvent } from '../util'
import Helper from './helper'

export default function (Vue: GlobalAPI): any {
  const { looseEqual } = Vue.util
  const { addEventInfo, modelValueEqual } = Helper(Vue)

  class MultiElement {
    _vm: ValidityComponent
    initValue: any

    constructor (vm: ValidityComponent) {
      // TODO: should be checked whether included radio or checkbox
      this._vm = vm
      this.initValue = this.getValue()
      this.attachValidity()
    }

    attachValidity (): void {
      this._vm.$el.$validity = this._vm
      this._eachItems(item => {
        item.$validity = this._vm
      })
    }

    getValue (): any {
      return this._getCheckedValue()
    }

    checkModified (): boolean {
      return !looseEqual(this.initValue, this._getCheckedValue())
    }

    listenToucheableEvent (): void {
      this._eachItems(item => {
        item.addEventListener('focusout', this._vm.willUpdateTouched)
      })
    }

    unlistenToucheableEvent (): void {
      this._eachItems(item => {
        item.removeEventListener('focusout', this._vm.willUpdateTouched)
      })
    }

    listenInputableEvent (): void {
      this._eachItems(item => {
        item.addEventListener('change', this._vm.handleInputable)
      })
    }

    unlistenInputableEvent (): void {
      this._eachItems(item => {
        item.removeEventListener('change', this._vm.handleInputable)
      })
    }

    fireInputableEvent (): void {
      this._eachItems(item => {
        triggerEvent(item, 'change', addEventInfo)
      })
    }

    modelValueEqual (vnode: VNode): ?boolean {
      let ret: ?boolean = null
      const children: Array<VNode> = (this._vm.child && this._vm.child.children) || []
      for (let i = 0; i < children.length; i++) {
        const maybeEqual: ?boolean = modelValueEqual(children[i])
        if (!maybeEqual) {
          ret = maybeEqual
          break
        }
      }
      return ret
    }

    _getCheckedValue (): Array<any> {
      const value: Array<any> = []
      this._eachItems(item => {
        if (!item.disabled && item.checked) {
          value.push(item.value)
        }
      })
      return value
    }

    _getItems (): Array<any> {
      return this._vm.$el.querySelectorAll('input[type="checkbox"], input[type="radio"]')
    }

    _eachItems (cb: Function): void {
      const items = this._getItems()
      for (let i = 0; i < items.length; i++) {
        cb(items[i])
      }
    }
  }

  return MultiElement
}
