/* @flow */
import { warn } from './util'
import Config from './config'
import Asset from './asset'
import Mixin from './mixin'
import Component from './components/index'
import { mapValidation } from './util'

let installed: Boolean = false

function plugin (Vue: GlobalAPI, options: Object = {}): void {
  if (installed) {
    warn('already installed.')
    return
  }

  Config(Vue)
  Asset(Vue)
  installMixin(Vue)
  installComponent(Vue)
  installed = true
}

function installMixin (Vue: GlobalAPI): void {
  Vue.mixin(Mixin(Vue))
}

function installComponent (Vue: GlobalAPI): void {
  const components: Object = Component(Vue)
  Object.keys(components).forEach((id: string) => {
    Vue.component(id, components[id])
  })
}

plugin.mapValidation = mapValidation // for standalone
plugin.version = '3.0.0-alpha.1'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default {
  install: plugin,
  mapValidation
}
