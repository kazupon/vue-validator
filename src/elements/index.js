/* @flow */
import SingleElementClass from './single'
import MultiElementClass from './multi'

export default function (Vue: GlobalAPI): Object {
  const SingleElement = SingleElementClass(Vue)
  const MultiElement = MultiElementClass(Vue)

  return {
    SingleElement,
    MultiElement
  }
}
