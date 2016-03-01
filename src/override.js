export default function (Vue) {
  // override _init
  const init = Vue.prototype._init
  Vue.prototype._init = function (options) {
    if (!this._validatorMaps) {
      this._validatorMaps = Object.create(null)
    }
    init.call(this, options)
  }

  // override _destroy
  const destroy = Vue.prototype._destroy
  Vue.prototype._destroy = function () {
    destroy.apply(this, arguments)
    this._validatorMaps = null
  }
}
