
export default function (Vue: GlobalAPI): Object {
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
      return h(tag, tag === 'form' ? { attrs: { novalidate: true }} : {}, children)
    }
  }
}

function walkChildren (validation: Validation, name: ?string, children: Array<VNode>): void {
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
