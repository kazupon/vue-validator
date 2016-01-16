import * as validators from './validators'


export default function (Vue) {
  const extend = Vue.util.extend

  // set global validators asset
  let assets = Object.create(null)
  extend(assets, validators)
  Vue.options.validators = assets

  // set option merge strategy
  let strats = Vue.config.optionMergeStrategies
  if (strats) {
    strats.validators = (parent, child) => {
      if (!child) { return parent }
      if (!parent) { return child }
      const ret = Object.create(null)
      extend(ret, parent)
      for (let key in child) {
        ret[key] = child[key]
      }
      return ret
    }
  }

  /**
   * Register or retrieve a global validator definition.
   *
   * @param {String} id
   * @param {Function} definition
   */
  
  Vue.validator = (id, definition) => {
    if (!definition) {
      return Vue.options['validators'][id]
    } else {
      Vue.options['validators'][id] = definition
    }
  }
}
