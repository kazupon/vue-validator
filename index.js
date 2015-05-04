/**
 * Export(s)
 */

module.exports = install


/**
 * Install plugin
 */

function install (Vue, options) {
  options = options || {}
  var componentName = options.component = options.component || '$validator'
  var directiveName = options.directive = options.directive || 'validate'
  var path = Vue.parsers.path

  function getVal (obj, keypath) {
    var ret = null
    try {
      ret = path.get(obj, keypath)
    } catch (e) { }
    return ret
  }

  Vue.directive(directiveName, {
    priority: 1024,

    bind: function () {
      var vm = this.vm
      
      if (!vm[componentName]) {
        vm[componentName] = vm.$addChild({
          validator: vm.$options.validator
        }, Vue.extend(require('./lib/validator')))
      }

      var $validator = vm[componentName]
      var el = this.el
      var validation = $validator._getValidationNamespace('validation')
      var model = this._parseModelAttribute(el.getAttribute(Vue.config.prefix + 'model'))
      var keypath = this._parseModelAttribute(el.getAttribute(Vue.config.prefix + 'model'))
      var validator = this.arg ? this.arg : this.expression
      var arg = this.arg ? this.expression : null
      var init = el.getAttribute('value') || vm.$get(keypath)

      if (!getVal($validator[validation], keypath)) {
        $validator._defineModelValidationScope(keypath, init)
      }

      if (!getVal($validator[validation], keypath + '.' + validator)) {
        $validator._defineValidatorToValidationScope(keypath, validator)
        $validator._addValidators(keypath, validator, arg)
      }

      $validator._doValidate(keypath, init, $validator.$get(keypath))
    },

    unbind: function () {
      var vm = this.vm
      var $validator = vm[componentName]

      if ($validator) {
        $validator.$destroy()
        vm[componentName] = null
        delete vm[componentName]
      }
    },

    _parseModelAttribute: function (attr) {
      var res = Vue.parsers.directive.parse(attr)
      return res[0].arg ? res[0].arg : res[0].expression
    }
  })
}
