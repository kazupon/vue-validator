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
 * @param {tag} tag
 * @return {String} validator tag
 */

var wrapTemplate = exports.wrapTemplate = function (target, tag) {
  tag = tag || 'form'
  return '<' + tag + '>' + target + '</' + tag + '>'
}


/**
 * Create instance
 *
 * @params {String} target
 * @params {Object} validator
 * @params {Object} data
 * @return {Object} created Vue component instance
 */

exports.createInstance = function (params) {
  params = params || {}
  params.target = params.target || ''
  params.validator = params.validator || {}
  params.data = params.data || {}

  var Validator = Vue.extend({
    validator: params.validator,
    template: wrapTemplate(params.target),
    el: function () {
      var el = document.createElement('div')
      document.body.appendChild(el)
      return el
    },
    data: function () { return params.data }
  })

  return new Validator()
}
