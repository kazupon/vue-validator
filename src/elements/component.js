/* @flow */
import { MODEL_NOTIFY_EVENT } from '../util'
import Helper from './helper'

export default function (Vue: GlobalAPI): any {
  const { looseEqual } = Vue.util
  const { modelValueEqual } = Helper(Vue)

  class ComponentElement {
    _vm: ValidityComponent
    _vnode: any
    _unwatchInputable: Function | void
    initValue: any

    constructor (vm: ValidityComponent, vnode: any) {
      console.log('ComponentElement#constructor')
      this._vm = vm
      this._vnode = vnode
      this.initValue = this.getValue()
      this.attachValidity()
    }

    attachValidity (): void {
      this._vm.$el.$validity = this._vm
    }

    getValue (): any {
      return this._vnode.child.value
    }

    checkModified (): boolean {
      return !looseEqual(this.initValue, this._vnode.child.value)
    }

    listenToucheableEvent (): void {
      this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched)
    }

    unlistenToucheableEvent (): void {
      this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched)
    }

    listenInputableEvent (): void {
      this._unwatchInputable = this._vnode.child.$watch('value', this._vm.watchInputable)
    }

    unlistenInputableEvent (): void {
      if (this._unwatchInputable) {
        this._unwatchInputable()
        this._unwatchInputable = undefined
        delete this._unwatchInputable
      }
    }

    fireInputableEvent (): void {
      const args = { value: this.getValue() }
      args[MODEL_NOTIFY_EVENT] = 'COMPONENT'
      this._vnode.child.$emit('input', args)
    }

    modelValueEqual (vnode: VNode): ?boolean {
      return modelValueEqual(vnode)
    }
  }

  return ComponentElement
}
