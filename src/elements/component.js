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
      this._vm = vm
      this._vnode = vnode
      this.initValue = this.getValue()
      this._watchers = []
      this.attachValidity()
    }

    attachValidity (): void {
      this._vm.$el.$validity = this._vm
    }

    getValidatorProps (): Array<string> {
      const vm = this._vm
      return vm._validatorProps(vm._uid.toString(), vm.validators)
    }

    getValue (): any {
      const value: Dictionary<string> = {}
      this.getValidatorProps().forEach((prop: string) => {
        value[prop] = this._vnode.child[prop]
      })
      return value
    }

    checkModified (): boolean {
      return !looseEqual(this.initValue, this.getValue())
    }

    listenToucheableEvent (): void {
      this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched)
    }

    unlistenToucheableEvent (): void {
      this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched)
    }

    listenInputableEvent (): void {
      this.getValidatorProps().forEach((prop: string) => {
        this._watchers.push(this._vnode.child.$watch(prop, this._vm.watchInputable))
      })
    }

    unlistenInputableEvent (): void {
      this._watchers.forEach(watcher => { watcher() })
      this._watchers = []
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
