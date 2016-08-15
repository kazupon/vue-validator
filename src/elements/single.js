/* @flow */
import { looseEqual } from '../util'

export default class SingleElement {
  _vm: ValidityComponent
  _vnode: any
  _unwatchInputable: Function | void
  initValue: any

  constructor (vm: ValidityComponent, vnode: any) {
    this._vm = vm
    this._vnode = vnode
    this.initValue = this.getValue()
    this.attachValidity()
  }

  get _isBuiltIn (): boolean {
    const vnode = this._vnode
    return !vnode.child &&
      !vnode.componentOptions &&
      vnode.tag
  }

  get _isComponent (): boolean {
    const vnode = this._vnode
    return vnode.child &&
      vnode.componentOptions &&
      vnode.tag.match(/vue-component/)
  }

  attachValidity (): void {
    this._vm.$el.$validity = this._vm
  }

  getValue (): any {
    if (this._isBuiltIn) {
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
    } else if (this._isComponent) {
      return this._vnode.child.value
    } else {
      // TODO: should be warn !!
      return ''
    }
  }

  checkModified (): boolean {
    if (this._isBuiltIn) {
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
    } else if (this._isComponent) {
      return !looseEqual(this.initValue, this._vnode.child.value)
    } else {
      // TODO: should be warn !!
      return false
    }
  }

  listenToucheableEvent (): void {
    this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched)
  }

  unlistenToucheableEvent (): void {
    this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched)
  }

  listenInputableEvent (): void {
    if (this._isBuiltIn) {
      const el = this._vm.$el
      if (el.tagName === 'SELECT') {
        el.addEventListener('change', this._vm.handleInputable)
      } else {
        if (el.type === 'checkbox') {
          el.addEventListener('change', this._vm.handleInputable)
        } else {
          el.addEventListener('input', this._vm.handleInputable)
        }
      }
    } else if (this._isComponent) {
      this._unwatchInputable = this._vnode.child.$watch('value', this._vm.watchInputable)
    } else {
      // TODO: should be warn !!
    }
  }

  unlistenInputableEvent (): void {
    if (this._isBuiltIn) {
      const el = this._vm.$el
      if (el.tagName === 'SELECT') {
        el.removeEventListener('change', this._vm.handleInputable)
      } else {
        if (el.type === 'checkbox') {
          el.removeEventListener('change', this._vm.handleInputable)
        } else {
          el.removeEventListener('input', this._vm.handleInputable)
        }
      }
    } else if (this._isComponent) {
      if (this._unwatchInputable) {
        this._unwatchInputable()
        this._unwatchInputable = undefined
        delete this['_unwatchInputable']
      }
    } else {
      // TODO: should be warn !!
    }
  }
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
