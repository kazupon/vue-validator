/* @flow */
import props from './validity/props'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  return {
    functional: true,
    props,
    render (
      h: Function,
      { props, data, children }
    ): Array<VNode> {
      return children.map((child: VNode): VNode => {
        if (!child.tag) { return child }
        const newData: Object = extend({}, data)
        newData.props = extend({}, props)
        extend(newData.props.classes, Vue.config.validator.classes)
        newData.props.child = child
        return h('validity-control', newData)
      })
    }
  }
}
