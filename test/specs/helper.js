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
 * @params {Function} ready
 * @return {Object} created Vue component instance
 */

exports.createInstance = function (params, extend) {
  params = params || {}
  extend = (extend === undefined ? true : extend)
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

  if (params.components) {
    options.components = params.components
  }

  if (params.computed) {
    options.computed = params.computed
  }

  if (params.methods) {
    options.methods = params.methods
  }

  if (params.validator) {
    options.validator = params.validator
  }

  var events = ['created', 'compiled', 'ready']
  events.forEach(function (event) {
    if (params[event]) {
      options[event] = params[event]
    }
  })

  if (extend) {
    var Ctor = Vue.extend(options)
    return new Ctor()
  } else {
    return new Vue(options)
  }
}
