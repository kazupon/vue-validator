/**
 * import(s)
 */

var slice = [].slice


/**
 * export(s)
 */

exports.install = function (Vue) {
    var utils = Vue.require('utils'),
        Directive = Vue.require('directive')


    Vue.filter('required', function (val, key) {
        utils.log('required filter: ' + val + ', ' + key)
        this.$validation[key]['required'] = (val.length > 0)
        return val
    })

    Vue.filter('pattern', function (val, pattern, key) {
        utils.log('pattern filter: ' + val + ', ' + pattern + ', ' + key)
        try {
            this.$validation[key]['pattern'] = new RegExp(pattern).test(val)
        } catch (e) {
            console.error('pattern filter error:', e)
        }
        return val
    })


    function initValidationState ($validation, key, filters) {
        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i].name
            if (filterName === 'required' || filterName === 'pattern') {
                $validation[key][filterName] = true
            } else {
                $validation[key][filterName] = {}
            }
        }
    }

    function makeFilterExpression ($validation, key, filters) {
        var elements = [key],
            ret = ''

        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i].name
            if (filters[i].args) {
                elements.push([filterName].concat(filters[i].args).concat([key]).join(' '))
            } else {
                elements.push(filterName + ' ' + key)
            }
        }

        ret = elements.join('|')
        utils.log('makeFilterExpression: ' + ret)

        return ret
    }


    Vue.directive('validate', {
        bind: function () {
            var $validation = this.vm.$validation || {},
                el = this.el

            if (el.nodeType === 1 && el.tagName !== 'SCRIPT' && el.hasChildNodes()) {
                slice.call(el.childNodes).forEach(function (node) {
                    if (node.nodeType === 1) {
                        var tag = node.tagName
                        if ((tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') 
                          && node.hasAttributes) {
                            var attrs = slice.call(node.attributes)
                            for (var i = 0; i < attrs.length; i++) {
                                var attr = attrs[i]
                                if (attr.name === 'v-model') {
                                    var asts = Directive.parse(attr.value),
                                        key = asts[0].key,
                                        filters = asts[0].filters
                                    console.log(asts)
                                    console.log(key, filters)
                                    $validation[key] = {}
                                    if (filters) {
                                        initValidationState($validation, key, filters)
                                        attr.value = makeFilterExpression($validation, key, filters)
                                    }
                                }
                            }
                        }
                    }
                })
            }
            
            this.vm.$validation = $validation;
        },

        update: function (val, init) {
            console.log('update', val, init)
        }
    })
}
