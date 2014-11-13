/**
 * export(s)
 */


/**
 * wrap template
 */

exports.wrapTemplate = function (inject, name, tag) {
  name = name || 'vue-validator'
  tag = tag || 'form'
  return '<' + tag + ' v-component="' + name + '">' +
    inject + '</' + tag + '>'
}
