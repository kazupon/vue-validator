/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')


/**
 * export(s)
 */


/**
 * wrap template
 */

var wrapTemplate = exports.wrapTemplate = function (inject, name, tag) {
  name = name || 'vue-validator'
  tag = tag || 'form'
  return '<' + tag + ' v-component="' + name + '">' +
    inject + '</' + tag + '>'
}

/**
 * create instance
 */

exports.createInstance = function (inject, data) {
  var Validator = Vue.extend({
    template: wrapTemplate(inject),
    el: function () {
      var el = document.createElement('div')
      document.body.appendChild(el)
      return el
    },
    data: data
  })

  return new Validator()
}
