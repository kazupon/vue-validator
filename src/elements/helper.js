/* @flow */
import { looseEqual, MODEL_NOTIFY_EVENT } from '../util'

export function addEventInfo (e: any) {
  e[MODEL_NOTIFY_EVENT] = 'DOM'
}

export function modelValueEqual (vnode: VNode): ?boolean {
  const directives: Array<VNodeDirective> = (vnode.data && vnode.data.directives) || []
  const directive: ?VNodeDirective = directives.find((dir: VNodeDirective) => {
    return dir.name === 'model'
  })
  return (!directive || directive.oldValue === undefined)
    ? null
    : looseEqual(directive.value, directive.oldValue)
}
