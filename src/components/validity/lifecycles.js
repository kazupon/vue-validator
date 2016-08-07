/* @flow */
import { SingleElement, MultiElement } from '../../elements/index'

export default function (Vue: GlobalAPI): Object {
  function created (): void {
    this._elementable = null

    this._keysCached = memoize(results => {
      return Object.keys(results)
    })

    // for event control flags
    this._modified = false

    // watch validation raw results
    this.watchValidationRawResults()
  }

  function destroyed (): void {
    this.unwatchValidationRawResults()
  }

  function mounted (): void {
    this._elementable = createValidityElement(this)
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
