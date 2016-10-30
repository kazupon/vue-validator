/* @flow */
import { triggerEvent } from '../util'
import Helper from './helper'

export default function (Vue: GlobalAPI): any {
  const { looseEqual } = Vue.util
  const { addEventInfo, modelValueEqual } = Helper(Vue)

  class SingleElement {
    _vm: ValidityComponent
    _unwatchInputable: Function | void
    initValue: any

    constructor (vm: ValidityComponent) {
      this._vm = vm
      this.initValue = this.getValue()
      this.attachValidity()
    }

    attachValidity (): void {
      this._vm.$el.$validity = this._vm
    }

    getValue (): any {
      const el = this._vm.$el
      if (el.tagName === 'SELECT') {
        return getSelectValue(el)
      } else {
        if (el.type === 'checkbox') {
          return el.checked
        } else {
          return el.value
        }
      }
    }

    checkModified (): boolean {
      const el = this._vm.$el
      if (el.tagName === 'SELECT') {
        return !looseEqual(this.initValue, getSelectValue(el))
      } else {
        if (el.type === 'checkbox') {
          return !looseEqual(this.initValue, el.checked)
        } else {
          return !looseEqual(this.initValue, el.value)
        }
      }
    }

    listenToucheableEvent (): void {
      this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched)
    }

    unlistenToucheableEvent (): void {
      this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched)
    }

    listenInputableEvent (): void {
      const vm = this._vm
      const el = vm.$el
      if (el.tagName === 'SELECT') {
        el.addEventListener('change', vm.handleInputable)
      } else {
        if (el.type === 'checkbox') {
          el.addEventListener('change', vm.handleInputable)
        } else {
          el.addEventListener('input', vm.handleInputable)
        }
      }
    }

    unlistenInputableEvent (): void {
      const vm = this._vm
      const el = vm.$el
      if (el.tagName === 'SELECT') {
        el.removeEventListener('change', vm.handleInputable)
      } else {
        if (el.type === 'checkbox') {
          el.removeEventListener('change', vm.handleInputable)
        } else {
          el.removeEventListener('input', vm.handleInputable)
        }
      }
    }

    fireInputableEvent (): void {
      const el = this._vm.$el
      if (el.tagName === 'SELECT') {
        triggerEvent(el, 'change', addEventInfo)
      } else {
        if (el.type === 'checkbox') {
          triggerEvent(el, 'change', addEventInfo)
        } else {
          triggerEvent(el, 'input', addEventInfo)
        }
      }
    }

    modelValueEqual (vnode: VNode): ?boolean {
      return modelValueEqual(vnode)
    }
  }

  return SingleElement
}

function getSelectValue (el): Array<any> {
  const value: Array<any> = []
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i]
    if (!option.disabled && option.selected) {
      value.push(option.value)
    }
  }
  return value
}
