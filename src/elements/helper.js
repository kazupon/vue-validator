/* @flow */
import { looseEqual, MODEL_NOTIFY_EVENT } from '../util'

export function addEventInfo (e: HTMLEvents) {
  e[MODEL_NOTIFY_EVENT] = 'DOM'
}

export function modelValueEqual (vnode: VNode): ?boolean {
  const directives: Array<VNodeDirective> = (vnode.data && vnode.data.directives) || []
  const directive: ?VNodeDirective = directives.find((dir: VNodeDirective) => {
    return dir.name === 'model'
  })
  return !directive
    ? null
    : looseEqual(directive.value, directive.oldValue)
}
