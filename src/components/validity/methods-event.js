/* @flow */
import { MODEL_NOTIFY_EVENT } from '../../util'

export default function (Vue: GlobalAPI): Object {
  const { toArray } = Vue.util

  function _fireEvent (type: string, ...args: Array<any>): void {
    this.$emit(type, ...args)
  }

  function _interceptEvents (child: VNode, multiple: boolean): void {
    (multiple ? (child.children || []) : [child]).forEach((child: VNode) => { this._wrapEvent(child) })
  }

  function _wrapEvent (child: VNode): Object {
    const ret: Object = {}
    if (!child.tag || !child.data) { return ret }

    const dir: ?VNodeDirective = getModelDirective(child)
    if (!dir) { return ret }
      
    const { type, orgListeners, listeners } = getEventSources(child)
    if (!Array.isArray(orgListeners)) { return ret }

    const modelHandler: Function = orgListeners[0]
    const userHandler: Function = orgListeners[1]
    const modelApplyer = (args) => {
      return (applicable: ?boolean) => {
        this._applyWithUserHandler = true
        if (applicable === undefined || applicable === true) {
          modelHandler.apply(child.context, args)
        }
      }
    }
    const modifier: ?boolean = (dir.modifiers || {}).validity
    listeners[type] = function () {
      const args: Array<any> = toArray(arguments, 0)
      const event: any = args[0]
      if (event[MODEL_NOTIFY_EVENT] === 'DOM') {
        delete event[MODEL_NOTIFY_EVENT]
        userHandler.apply(child.context, args)
        return
      } else if (event[MODEL_NOTIFY_EVENT] === 'COMPONENT') {
        const value: any = event.value
        args[0] = value
        userHandler.apply(child.context, args)
        return
      }

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
    _interceptEvents,
    _wrapEvent
  }
}

function getModelDirective (child: VNode): ?VNodeDirective {
  return ((child.data && child.data.directives) || []).find(dir => { return dir.name === 'model' })
}

function getEventSources (child: VNode): Object {
  const sources: Object = {}
  const listeners = sources.listeners = child.componentOptions
      ? child.componentOptions.listeners
      : (child.data && child.data.on)
  sources.type =
    (child.tag === 'input' && (child.data && child.data.attrs && child.data.attrs.type) === 'text') ||
    (child.tag && child.tag.match(/vue-component/))
      ? 'input'
      : 'change'
  if (listeners) {
    sources.orgListeners = listeners[sources.type]
  }
  return sources
}
