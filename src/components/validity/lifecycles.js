/* @flow */
import Elements from '../../elements/index'
import { addClass, toggleClasses } from '../../util'

export default function (Vue: GlobalAPI): Object {
  const { SingleElement, MultiElement } = Elements(Vue)

  function createValidityElement (vm: ValidityComponent): ValidityElement {
    const vnode = vm._vnode
    return !vm.multiple
      ? new SingleElement(vm, vnode)
      : new MultiElement(vm)
  }

  function created (): void {
    this._elementable = null

    this._keysCached = memoize(results => {
      return Object.keys(results)
    })

    // for event control flags
    this._modified = false

    // for v-model integration flag
    this._modelIntegrationMode = 'NONE'

    // watch validation raw results
    this._watchValidationRawResults()

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

    this._unwatchValidationRawResults()

    this._elementable.unlistenInputableEvent()
    this._elementable.unlistenToucheableEvent()
    this._elementable = null
  }

  function mounted (): void {
    this._elementable = createValidityElement(this)
    this._elementable.listenToucheableEvent()
    this._elementable.listenInputableEvent()

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
