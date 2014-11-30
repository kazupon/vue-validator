/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')


/**
 * Export(s)
 */


/**
 * Wrap template
 *
 * @param {String} target
 * @param {String} name
 * @param {tag} tag
 * @return {String} validator tag
 */

var wrapTemplate = exports.wrapTemplate = function (target, name, tag) {
  name = name || 'vue-validator'
  tag = tag || 'form'
  return '<' + tag + ' v-component="' + name + '">' +
    target + '</' + tag + '>'
}


/**
 * Create instance
 *
 * @params {String} target
 * @params {String} name
 * @params {String} component
 * @params {Object} validator
 * @params {Object} data
 * @return {Object} created Vue component instance
 */

exports.createInstance = function (params) {
  params = params || {}
  params.target = params.target || ''
  params.name = params.name || 'vue-validator'
  params.component = params.component || {}
  params.validator = params.validator || {}
  params.data = params.data || {}

  var components = {}
  components[params.name] = params.component

  var Validator = Vue.extend({
    components: components,
    validator: params.validator,
    template: wrapTemplate(params.target, params.name),
    el: function () {
      var el = document.createElement('div')
      document.body.appendChild(el)
      return el
    },
    data: params.data
  })

  return new Validator()
}
