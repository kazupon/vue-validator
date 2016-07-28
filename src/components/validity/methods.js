/* @flow */

import State from './methods-state'
import Validate from './methods-validate'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  const methods: Object = {}
  extend(methods, State(Vue))
  extend(methods, Validate(Vue))

  return methods
}
