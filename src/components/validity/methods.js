/* @flow */

import Event from './methods-event'
import State from './methods-state'
import Validate from './methods-validate'

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  const methods: Object = {}
  extend(methods, Event(Vue))
  extend(methods, State(Vue))
  extend(methods, Validate(Vue))

  return methods
}
