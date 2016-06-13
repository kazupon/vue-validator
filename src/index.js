/* @flow */
function plugin (Vue, options: Object = {}): number {
  Vue.prototype.$add = (a: number, b: number) => {
    return a + b
  }
}

plugin.version = '2.1.3'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
