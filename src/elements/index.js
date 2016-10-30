/* @flow */
import SingleElementClass from './single'
import MultiElementClass from './multi'
import ComponentElementClass from './component'

export default function (Vue: GlobalAPI): Object {
  const SingleElement = SingleElementClass(Vue)
  const MultiElement = MultiElementClass(Vue)
  const ComponentElement = ComponentElementClass(Vue)

  return {
    SingleElement,
    MultiElement,
    ComponentElement
  }
}
