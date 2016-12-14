/* @flow */
import Elements from '../../elements/index'
import { addClass, toggleClasses, memoize } from '../../util'

export default function (Vue: GlobalAPI): Object {
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

  function watchModelable (val: any): void {
    this.$emit('input', {
      result: this.result,
      progress: this.progress,
      progresses: this.progresses
    })
  }

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
      instance.unregister(this.field, { named: name, group })
    }

    if (this._unwatchResultProp) {
      this._unwatchResultProp()
      this._unwatchResultProp = null
    }

    if (this._unwatchProgressProp) {
      this._unwatchProgressProp()
      this._unwatchProgressProp = null
    }

    this._unwatchValidationRawResults()

    this._elementable.unlistenInputableEvent()
    if (this.autotouch === 'on') {
      this._elementable.unlistenToucheableEvent()
    }
    this._elementable = null
  }

  function mounted (): void {
    this._elementable = createValidityElement(this, this._vnode)
    if (this._elementable) {
      if (this.autotouch === 'on') {
        this._elementable.listenToucheableEvent()
      }
      this._elementable.listenInputableEvent()
    } else {
      // TODO: should be warn
    }

    if (hasModelDirective(this.$vnode)) {
      this._unwatchResultProp = this.$watch('result', watchModelable)
      this._unwatchProgressProp = this.$watch('progress', watchModelable)
    }

    toggleClasses(this.$el, this.classes.untouched, addClass)
    toggleClasses(this.$el, this.classes.pristine, addClass)
  }

  return {
    created,
    destroyed,
    mounted
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

function hasModelDirective (vnode: VNode): any {
  return ((vnode && vnode.data && vnode.data.directives) || []).find(dir => dir.name === 'model')
}
