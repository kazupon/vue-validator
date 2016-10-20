/* @flow */
import ValidityControl from './validity/index'
import Validity from './validity.js'
import ValidityGroup from './validity-group'
import Validation from './validation'

export default function (Vue: GlobalAPI): Object {
  return {
    'validity-control': ValidityControl(Vue),
    'validity': Validity(Vue),
    'validity-group': ValidityGroup(Vue),
    'validation': Validation(Vue)
  }
}
