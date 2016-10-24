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
    const modelHandler: Function = Array.isArray(orgListeners) ? orgListeners[0] : orgListeners
    const userHandler: ?Function = Array.isArray(orgListeners) ? orgListeners[1] : null

    let integrationMode = this._modelIntegrationMode
    if (modelHandler && userHandler) {
      integrationMode = this._modelIntegrationMode = 'MODEL_AND_USER'
    } else if (modelHandler && !userHandler) {
      integrationMode = this._modelIntegrationMode = 'MODEL'
    }

    const modelApplyer = (args) => {
      return (applicable: ?boolean) => {
        if (userHandler) {
          this._applyWithUserHandler = true
        }
        if (applicable === undefined || applicable === true) {
          modelHandler.apply(child.context, args)
        }
      }
    }

    const modifier: ?boolean = (dir.modifiers || {}).validity

    const validity = this
    listeners[type] = function () {
      const args: Array<any> = toArray(arguments, 0)
      if (integrationMode === 'MODEL_AND_USER') {
        const event: any = args[0]
        if (event[MODEL_NOTIFY_EVENT] === 'DOM') {
          delete event[MODEL_NOTIFY_EVENT]
          userHandler && userHandler.apply(child.context, args)
          return
        } else if (event[MODEL_NOTIFY_EVENT] === 'COMPONENT') {
          const value: any = event.value
          args[0] = value
          userHandler && userHandler.apply(child.context, args)
          return
        }

        if (modifier) {
          const fn = validity._applyer = modelApplyer(args)
          args.push(fn)
          userHandler && userHandler.apply(child.context, args)
        } else {
          userHandler && userHandler.apply(child.context, args)
          modelHandler.apply(child.context, args)
        }
      } else if (integrationMode === 'MODEL') {
        if (modifier) {
          validity._applyer = modelApplyer(args)
        } else {
          modelHandler.apply(child.context, args)
        }
      }
    }

    ret.dir = dir
    return ret
  }

  function pass (applicable: ?boolean) {
    // TODO: should be implementsed error cases
    if (this._modelIntegrationMode !== 'NONE' && this._applyer) {
      this._applyer(applicable)
    }
  }

  return {
    _fireEvent,
    _interceptEvents,
    _wrapEvent,
    pass
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
