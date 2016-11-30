/* @flow */
import Elements from '../../elements/index'
import { addClass, toggleClasses } from '../../util'

export default function (Vue: GlobalAPI): Object {
  const { isPlainObject } = Vue.util
  const { SingleElement, MultiElement, ComponentElement } = Elements(Vue)

  function createValidityElement (vm: ValidityComponent, vnode: VNode): ?ValidityElement {
    return vm.multiple
      ? new MultiElement(vm)
      : checkBuiltInElement(vnode)
        ? new SingleElement(vm)
        : checkComponentElement(vnode)
          ? new ComponentElement(vm, vnode)
          : null
  }

  function getValidatorProps (validators: any): Array<string> {
    const normalized = typeof validators === 'string' ? [validators] : validators
    const targets: Array<string> = []
    if (isPlainObject(normalized)) {
      Object.keys(normalized).forEach((validator: string) => {
        const props: ?Object = (normalized[validator]
          && normalized[validator]['props']
          && isPlainObject(normalized[validator]['props']))
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

  function created (): void {
    this._elementable = null

    this._keysCached = memoize(results => {
      return Object.keys(results)
    })

    this._validatorProps = memoize(getValidatorProps)

    // for event control flags
    this._modified = false

    // for v-model integration flag
    this._modelIntegrationMode = 'NONE'

    // watch validation raw results
    this._watchValidationRawResults()

    // watch validation raw progress
    this._watchValidationRawProgresses()

    const validation = this.$options.propsData ? this.$options.propsData.validation : null
    if (validation) {
      const { instance, name } = validation
      const group = this.group
      instance.register(this.field, this, { named: name, group })
    }
  }

  function destroyed (): void {
    const validation = this.$options.propsData ? this.$options.propsData.validation : null
    if (validation) {
      const { instance, name } = validation
      const group = this.group
      instance.unregister(this.field, this, { named: name, group })
    }

    this._unwatchValidationRawProgresses()
    this._unwatchValidationRawResults()

    this._elementable.unlistenInputableEvent()
    this._elementable.unlistenToucheableEvent()
    this._elementable = null
  }

  function mounted (): void {
    this._elementable = createValidityElement(this, this._vnode)
    if (this._elementable) {
      this._elementable.listenToucheableEvent()
      this._elementable.listenInputableEvent()
    } else {
      // TODO: should be warn
    }

    toggleClasses(this.$el, this.classes.untouched, addClass)
    toggleClasses(this.$el, this.classes.pristine, addClass)
  }

  function updated () {
    if (this._modelIntegrationMode === 'MODEL_AND_USER') {
      const maybeChangeModel: ?boolean = this._elementable.modelValueEqual(this._vnode)
      if (!this._applyWithUserHandler && maybeChangeModel !== null && !maybeChangeModel) {
        this._elementable.fireInputableEvent()
      }
      delete this._applyWithUserHandler
    } else if (this._modelIntegrationMode === 'MODEL') {
      const maybeChangeModel: ?boolean = this._elementable.modelValueEqual(this._vnode)
      if (maybeChangeModel !== null && !maybeChangeModel) {
        this._elementable.fireInputableEvent()
      }
    }
  }

  return {
    created,
    destroyed,
    mounted,
    updated
  }
}

function memoize (fn: Function): Function {
  const cache = Object.create(null)
  return function memoizeFn (id: string, ...args): any {
    const hit = cache[id]
    return hit || (cache[id] = fn(...args))
  }
}

function checkComponentElement (vnode: VNode): any {
  return vnode.child &&
    vnode.componentOptions &&
    vnode.tag &&
    vnode.tag.match(/vue-component/)
}

function checkBuiltInElement (vnode: VNode): any {
  return !vnode.child &&
    !vnode.componentOptions &&
    vnode.tag
}
