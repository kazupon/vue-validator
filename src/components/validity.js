/* @flow */

import props from './validity/props'
import Validity from './validity/index'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  const validity = Validity(Vue)
  return {
    functional: true,
    props,
    render (
      h: Function,
      { props, data, parent, children }
    ): Array<VNode> {
      return children.map((child: VNode): VNode => {
        if (!child.tag) { return child }
        const newData: Object = extend({}, data)
        newData.props = extend({}, props)
        newData.props.child = child
        return h(validity, newData)
      })
    }
  }
}
