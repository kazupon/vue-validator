/* @flow */
import { SingleElement, MultiElement } from '../../elements/index'
import { addClass, removeClass, toggleClasses } from '../../util'

export default function (Vue: GlobalAPI): Object {
  function created (): void {
    this._elementable = null

    this._keysCached = memoize(results => {
      return Object.keys(results)
    })

    // for event control flags
    this._modified = false

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

  return {
    created,
    destroyed,
    mounted
  }
}

function memoize (fn: Function): Function {
  const cache = Object.create(null)
  return function memoizeFn (id: string, ...args): any {
    const hit = cache[id]
    return hit || (cache[id] = fn(...args))
  }
}

function createValidityElement (vm: ValidityComponent): ValidityElement {
  const vnode = vm.child
  return !vnode.children
    ? new SingleElement(vm, vnode)
    : new MultiElement(vm)
}
