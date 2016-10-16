/* @flow */
import baseProps from './validity/props'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  const props: Object = extend({
    tag: {
      type: String,
      default: 'fieldset'
    }
  }, baseProps)

  return {
    functional: true,
    props,
    render (
      h: Function,
      { props, data, children }
    ): Array<VNode> {
      const child = h(props.tag, children)
      const newData: Object = extend({}, data)
      newData.props = extend({}, props)
      extend(newData.props.classes, Vue.config.validator.classes)
      newData.props.child = child
      newData.props.multiple = true
      return h('validity-control', newData)
    }
  }
}
