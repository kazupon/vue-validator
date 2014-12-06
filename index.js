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
      var validator = this.arg ? this.arg : this.expression
      var arg = this.arg ? this.expression : null
      var init = el.getAttribute('value') || vm[model]

      if (!$validator[validation][model]) {
        $validator._defineModelValidationScope(model, init)
      }

      if (!$validator[validation][model][validator]) {
        $validator._defineValidatorToValidationScope(model, validator)
        $validator._addValidators(model, validator, arg)
      }

      $validator._doValidate(model, init, $validator[model])
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
