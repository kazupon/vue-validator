/* @flow */
import * as validators from './validators'

export default function (Vue: GlobalAPI): void {
  const { extend } = Vue.util

  // set global validators asset
  const assets: Object = Object.create(null)
  extend(assets, validators)
  Vue.options.validators = assets

  // set option merge strategy
  const strats = Vue.config.optionMergeStrategies
  if (strats) {
    strats.validators = (parent, child) => {
      if (!child) { return parent }
      if (!parent) { return child }
      const ret = Object.create(null)
      extend(ret, parent)
      let key
      for (key in child) {
        ret[key] = child[key]
      }
      return ret
    }
  }

  /**
   * Register or retrieve a global validator definition.
   */
  function validator (
    id: string,
    def?: Function | ValidatorDefinition
  ): Function | ValidatorDefinition | void {
    if (def === undefined) {
      return Vue.options['validators'][id]
    } else {
      Vue.options['validators'][id] = def
      if (def === null) {
        delete Vue.options['validators']['id']
      }
    }
  }
  Vue['validator'] = validator
}
