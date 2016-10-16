/* @flow */

export default function (Vue: GlobalAPI): Object {
  const { toArray } = Vue.util

  function _fireEvent (type: string, ...args: Array<any>): void {
    this.$emit(type, ...args)
  }

  function _interceptEvents (child: VNode): Object {
    const ret: Object = {}
    if (!child.tag || !child.data) { return ret }

    const dir: ?VNodeDirective = getModelDirective(child)
    if (!dir) { return ret }

    const { type, orgListeners, listeners } = getEventSources(child)
    if (!Array.isArray(orgListeners)) { return ret }

    const modelHandler: Function = orgListeners[0]
    const userHandler: Function = orgListeners[1]
    const modelApplyer = (args) => {
      return () => { modelHandler.apply(child.context, args) }
    }
    const modifier: ?boolean = (dir.modifiers || {}).validity
    listeners[type] = function () {
      const args: Array<any> = toArray(arguments, 0)

      if (modifier) {
        args.push(modelApplyer(args))
        userHandler.apply(child.context, args)
      } else {
        userHandler.apply(child.context, args)
        modelHandler.apply(child.context, args)
      }
    }

    ret.dir = dir
    return ret
  }

  return {
    _fireEvent,
    _interceptEvents
  }
}

function getModelDirective (child: VNode): ?VNodeDirective {
  return (child.data.directives || []).find(dir => { return dir.name === 'model' })
}

function getEventSources (child: VNode): Object {
  const sources: Object = {}
  const listeners = sources.listeners = child.componentOptions
      ? child.componentOptions.listeners
      : child.data.on
  sources.type = 
    (child.tag === 'input' && child.data.attrs.type === 'text') ||
    child.tag.match(/vue-component/)
      ? 'input'
      : 'change'
  if (listeners) {
    sources.orgListeners = listeners[sources.type]
  }
  return sources
}
