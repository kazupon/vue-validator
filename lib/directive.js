/**
 * Export(s)
 */


/**
 * `v-validate` directive
 */

module.exports = {
  priority: 1024,

  bind: function () {
    var vm = this.vm
    var el = this.el
    var validationName = vm._getValidationNamespace('validation')
    // want to use Vue.config.prefix ...
    var modelKey = this._parseModelAttribute(el.getAttribute('v-model'))
    var validator = this.arg ? this.arg : this.expression
    var arg = this.arg ? this.expression : null
    var initVal = el.getAttribute('value') || vm[modelKey]

    if (!vm[validationName][modelKey]) {
      vm._defineModelValidationScope(modelKey, initVal)
    }

    if (!vm[validationName][modelKey][validator]) {
      vm._defineValidatorToValidationScope(modelKey, validator)
      vm._addValidator(modelKey, validator, arg)
    }

    vm._doValidate(modelKey, initVal, vm[modelKey])
  },

  _parseModelAttribute: function (attr) {
    // want to use expression parser of vue.js ...
    return attr.split(',')[0].split('|')[0].split(':')[0].trim(' ')
  }
}
