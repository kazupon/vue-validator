/* @flow */

import States from './states'
import Computed from './computed'
import Render from './render'
import Lifecycles from './lifecycles'
import Methods from './methods'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  const { props, data } = States(Vue)
  const computed = Computed(Vue)
  const lifecycles = Lifecycles(Vue)
  const { render } = Render(Vue)
  const methods = Methods(Vue)

  const validity: Object = {
    props,
    data,
    render,
    computed,
    methods
  }
  extend(validity, lifecycles)

  return validity
}
