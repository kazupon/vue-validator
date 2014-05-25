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

    /**
     * required validate filter
     */
    Vue.filter('required', function (val, key) {
        utils.log('required filter: ' + val + ', ' + key)
        this.$validation[key]['required'] = (val.length === 0)
        return val
    })

    /**
     * pattern validate filter
     */
    Vue.filter('pattern', function (val) {
        try {
            var key = arguments[arguments.length - 1],
                pattern = arguments[1].replace(/^'/, "").replace(/'$/, ""),
                re = (arguments.length === 4 ? new RegExp(pattern, arguments[2])
                                             : new RegExp(pattern))
            this.$validation[key]['pattern'] = !re.test(val)
        } catch (e) {
            console.error('pattern filter error:', e)
        }
        return val
    })

    /**
     * length validate filter
     */
    Vue.filter('length', function (val) {
        try {
            var key = arguments[arguments.length - 1],
                args = {}

            // parse length condition arguments
            for (var i = 1; i < arguments.length - 1; i++) {
                var parsed = arguments[i].split(':')
                if (parsed.length !== 2) { continue }
                if (isNaN(parsed[1])) { continue }
                args[parsed[0]] = parseInt(parsed[1])
            }

            // validate min
            if ('min' in args) {
                this.$validation[key]['length']['min'] = (val.length < args['min'])
            }

            // validate max
            if ('max' in args) {
                this.$validation[key]['length']['max'] = (val.length > args['max'])
            }
        } catch (e) {
            console.error('length filter error:', e)
        }

        return val
    })

    /**
     * numeric validate filter
     */
    Vue.filter('numeric', function (val) {
        try {
            var key = arguments[arguments.length - 1],
                args = {}
            
            if (isNaN(val)) {
                this.$validation[key]['numeric']['value'] = true
                this.$validation[key]['numeric']['min'] = false
                this.$validation[key]['numeric']['max'] = false
            } else {
                this.$validation[key]['numeric']['value'] = false
                
                var value = parseInt(val)

                // parse numeric condition arguments
                for (var i = 1; i < arguments.length - 1; i++) {
                    var parsed = arguments[i].split(':')
                    if (parsed.length !== 2) { continue }
                    if (isNaN(parsed[1])) { continue }
                    args[parsed[0]] = parseInt(parsed[1])
                }

                // validate min
                if ('min' in args) {
                    this.$validation[key]['numeric']['min'] = (value < args['min'])
                }

                // validate max
                if ('max' in args) {
                    this.$validation[key]['numeric']['max'] = (value > args['max'])
                }
            }
        } catch (e) {
            console.error('numeric filter error:', e)
        }

        return val
    })

    /**
     * validator filter
     */
    Vue.filter('validator', function (val, custom) {
        try {
            var func = this.$options.methods[custom]
            if (typeof func === 'function') {
                val = func.call(this, val)
            }
        } catch (e) {
            console.error('custom filter error:', e)
        }

        return val
    })

    function initValidationState ($validation, key, filters) {
        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i].name
            if (filterName === 'required' || filterName === 'pattern') {
                $validation[key][filterName] = false
            } else if (filterName === 'length' || filterName === 'numeric') {
                $validation[key][filterName] = initValidationArgsState(filters[i].args)
            } else if (filterName === 'validator') {
                $validation[key][filterName] = {}
            } else {
                $validation[key][filterName] = {}
            }
        }
    }

    function initValidationArgsState (args) {
        var state = {}

        for (var i = 0; i < args.length; i++) {
            var arg = args[i],
                parsed = arg.split(':')
            if (parsed.length !== 2) { continue }
            state[parsed[0]] = false
        }

        return state
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

            try {
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
            } catch (e) {
              console.error('bind', e);
            }
            
            this.vm.$validation = $validation
        },

        update: function (val, init) {
            console.log('update', val, init)
            /*
            if (typeof handle !== 'function') { return }

            var name = this.el.getAttribute('name')
            if (!name) { return }

            var $validation = this.vm.$validation
            if (this.arg) {
              $validation[name][this.arg] = handle.call(this.vm)
            } else {
              $validation[name] = handle.call(this.vm)
            }

            this.vm.$validation = $validation
            */
        }
    })
}
