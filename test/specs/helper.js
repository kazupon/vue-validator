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
 * @params {Function} el
 * @params {String} target | template
 * @params {Object} validator
 * @params {Object} data
 * @return {Object} created Vue component instance
 */

exports.createInstance = function (params) {
  params = params || {}
  var options = {}

  options.el = params.el || function () {
    var el = document.createElement('div')
    document.body.appendChild(el)
    return el
  }

  options.data = function () {
    return params.data || {}
  }

  options.template = wrapTemplate(params.target || params.template || '')
  options.validator = params.validator || {}

  var Validator = Vue.extend(options)
  return new Validator()
}
