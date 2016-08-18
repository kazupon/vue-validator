/* @flow */

import Validity from './validity/index'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  const validity = Validity(Vue)
  const props: Object = {
    field: {
      type: String,
      required: true
    },
    validators: {
      type: [String, Array, Object],
      required: true
    }
  }

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
