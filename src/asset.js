import * as validators from './validators'


export default function (Vue) {

  // register validator asset
  Vue.config._assetTypes.push('validator')

  // set global validators asset
  let assets = Object.create(null)
  Vue.util.extend(assets, validators)
  Vue.options.validators = assets

  // set option merge strategy
  let strats = Vue.config.optionMergeStrategies
  if (strats) {
    strats.validators = strats.methods
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
