/* @flow */

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  return {
    functional: true,
    props: {
      name: {
        type: String
      },
      tag: {
        type: String,
        default: 'form'
      }
    },
    render (
      h: Function,
      { props, data, parent, children, slots }
    ): Array<VNode> {
      if (!parent._validation) {
        // TODO: should be warned
        return children
      }
      const tag = props.tag || 'form'
      walkChildren(parent._validation, props.name, children)
      const newData = extend({ attrs: {}}, data)
      if (tag === 'form') {
        newData.attrs.novalidate = true
      }
      return h(tag, newData, children)
    }
  }
}

function walkChildren (validation: Validationable, name: ?string, children: Array<VNode>): void {
  children.forEach((child: VNode) => {
    if (child &&
        child.componentOptions &&
        child.componentOptions.propsData && child.componentOptions.tag === 'validity-control') {
      child.componentOptions.propsData.validation = {
        instance: validation,
        name
      }
    }
    child.children && walkChildren(validation, name, child.children)
  })
}
