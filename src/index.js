/* @flow */
import { warn } from './util'
import Asset from './asset'

function plugin (Vue: GlobalAPI, options: Object = {}) {
  if (plugin.installed) {
    warn('already installed.')
    return
  }

  Asset(Vue)
}

plugin.version = '3.0.0-alpha.1'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
