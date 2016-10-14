/* @flow */

export default function (Vue: GlobalAPI): Object {
  const { toArray } = Vue.util

  function interceptEvents (child: VNode): void {
    if (!child.tag || !child.data) { return }

    const dir: ?VNodeDirective = getModelDirective(child)
    if (!dir) { return }

    const { type, orgListeners, listeners } = getEventSources(child)
    if (!Array.isArray(orgListeners)) { return }

    const modelHandler: Function = orgListeners[0]
    const userHandler: Function = orgListeners[1]
    const modifier: ?boolean = (dir.modifiers || {}).validity
    listeners[type] = function () {
      const args: Array<any> = toArray(arguments, 0)
      if (modifier) {
        const $apply = () => { modelHandler.apply(child.context, args) }
        args.push($apply)
        userHandler.apply(child.context, args)
      } else {
        userHandler.apply(child.context, args)
        modelHandler.apply(child.context, args)
      }
    }
  }

  return {
    render (h: Function): VNode {
      interceptEvents(this.child)
      return this.child
    }
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
