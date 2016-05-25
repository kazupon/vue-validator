import util, { warn } from './util'
import Asset from './asset'
import Override from './override'
import ValidateClass from './directives/validate-class'
import Validate from './directives/validate'
import Validator from './directives/validator'
import Errors from './components/errors'


/**
 * plugin
 *
 * @param {Function} Vue
 * @param {Object} options
 */

function plugin (Vue, options = {}) {
  if (plugin.installed) {
    warn('already installed.')
    return
  }

  util.Vue = Vue
  Asset(Vue)
  Errors(Vue)

  Override(Vue)
  Validator(Vue)
  ValidateClass(Vue)
  Validate(Vue)
}

plugin.version = '2.1.2'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
