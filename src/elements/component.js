/* @flow */
import { memoize } from '../util'

export default function (Vue: GlobalAPI): any {
  const { looseEqual, isPlainObject } = Vue.util

  function getValidatorProps (validators: any): Array<string> {
    const normalized: any = typeof validators === 'string' ? [validators] : validators
    const targets: Array<string> = []
    if (isPlainObject(normalized)) {
      Object.keys(normalized).forEach((validator: string) => {
        const props: ?Object = (normalized[validator] &&
          normalized[validator]['props'] &&
          isPlainObject(normalized[validator]['props']))
            ? normalized[validator]['props']
            : null
        if (props) {
          Object.keys(props).forEach((prop: string) => {
            if (!~targets.indexOf(prop)) {
              targets.push(prop)
            }
          })
        }
      })
    }
    return targets
  }

  class ComponentElement {
    _vm: ValidityComponent
    _vnode: any
    _unwatchInputable: Function | void
    _watchers: Array<Function>
    _validatorProps: Function
    initValue: any

    constructor (vm: ValidityComponent, vnode: any, validatorProps: ?Function) {
      this._vm = vm
      this._vnode = vnode
      this._validatorProps = validatorProps || memoize(getValidatorProps)
      this.initValue = this.getValue()
      this._watchers = []
      this.attachValidity()
    }

    attachValidity (): void {
      this._vm.$el.$validity = this._vm
    }

    getValidatorProps (): Array<string> {
      const vm = this._vm
      return this._validatorProps(vm._uid.toString(), vm.validators)
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
  }

  return ComponentElement
}
