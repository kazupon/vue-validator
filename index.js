var slice = [].slice,
    hasOwn = ({}).hasOwnProperty


/**
 * export(s)
 */

exports.install = function (Vue) {
    var utils = Vue.require('utils'),
        Directive = Vue.require('directive'),
        Binding = Vue.require('binding'),
        Observer = Vue.require('observer')

    var validationKey = '$validation',
        validationPropertyName = validationKey.split('$')[1],
        validKey = '$valid'

    Vue.filter('required', validateRequired)
    Vue.filter('pattern', validatePattern)
    Vue.filter('length', validateLength)
    Vue.filter('numeric', validateNumeric)
    Vue.filter('validator', validateCustom)

    Vue.directive('validate', {
        bind: function () {
            var compiler = this.compiler,
                $validation = compiler[validationPropertyName] || {},
                el = this.el, vm = this.vm, observer = compiler.observer,
                validationBindings = this.validationBindings = {}

            // enable $validation
            vm[validationKey] = compiler[validationPropertyName] = $validation
            Observer.observe($validation, validationKey, compiler.observer)
            compiler.bindings[validationKey] = new Binding(compiler, validationKey)
            validationBindings[validationKey] = compiler.bindings[validationKey]

            // register validation state from v-model directive
            function registerValidation (element) {
                if (element.nodeType === 1 
                  && element.tagName !== 'SCRIPT' 
                  && element.hasChildNodes()) {
                    slice.call(element.childNodes).forEach(function (node) {
                        if (node.nodeType === 1) {
                            if (node.hasChildNodes()) {
                                registerValidation(node)
                            } else {
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
                                            if (filters) {
                                                initValidationState($validation, key, filters, compiler, validationBindings)
                                                attr.value = makeFilterExpression($validation, key, filters)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
            registerValidation(el)

            // enable $valid
            var validBinding = compiler.bindings[validKey] = new Binding(compiler, validKey)
            validationBindings[validKey] = validBinding
            Object.defineProperty(vm, validKey, {
                enumerable: true,
                configurable: true,
                get: function () {
                    observer.emit('get', validKey)
                    return validBinding.value
                }
            })

            // inject validation checking handle
            function updateValid () {
                var valid = true
                for (var key in $validation) {
                    if ($validation[key]) {
                        valid = false
                        break
                    }
                }
                validBinding.update(valid)
            }
            this._handleValid = function (key) {
                if (validationKey === key || validKey === key) { return }
                if (key in validationBindings) {
                    updateValid()
                }
            }
            observer.on('set', this._handleValid)
        },

        unbind: function () {
            var compiler = this.compiler, vm = this.vm,
                observer = compiler.observer,
                $validation = compiler[validationPropertyName],
                validationBindings = this.validationBindings,
                bindings = compiler.bindings

            // disable $valid
            observer.off(this._handleValid)
            delete this._handleValid
            delete vm[validKey]

            // release bindings
            for (var key in validationBindings) {
                var binding = bindings[key]
                if (binding) {
                    binding.unbind()
                    delete bindings[key]
                }
                validationBindings[key] = null
            }
            delete this.validationBindings

            // disable $validation
            Observer.unobserve($validation, validationKey, compiler.observer)
            delete compiler[validationPropertyName]
            delete vm[validationKey]
        }
    })


    function initValidationState ($validation, key, filters, compiler, validationBindings) {
        var path, bindingPath, args = []
        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i].name
            if (filterName === 'required' || filterName === 'pattern') {
                path = [key, filterName].join('.')
                bindingPath = [validationKey, key, filterName].join('.')
                makeBinding(path, bindingPath)
            } else if (filterName === 'length' || filterName === 'numeric') {
                args = parseFilterArgs(filters[i].args)
                if (filterName === 'numeric') { args.push('value') }
                for (var j = 0; j < args.length; j++) {
                    path = [key, filterName, args[j]].join('.')
                    bindingPath = [validationKey, key, filterName, args[j]].join('.')
                    makeBinding(path, bindingPath)
                }
            } else if (filterName === 'validator') {
                path = [key, filterName, filters[i].args[0]].join('.')
                bindingPath = [validationKey, key, filterName, filters[i].args[0]].join('.')
                makeBinding(path, bindingPath)
            }
        }

        function makeBinding (path, bindingPath) {
            var binding = validationBindings[bindingPath] || new Binding(compiler, bindingPath)
            compiler.bindings[bindingPath] = validationBindings[bindingPath] = binding
            defineProperty($validation, path, binding)
        }
    }

    function parseFilterArgs (args) {
        var ret = []

        for (var i = 0; i < args.length; i++) {
            var arg = args[i], parsed = arg.split(':')
            if (parsed.length !== 2) { continue }
            ret.push(parsed[0])
        }

        return ret
    }

    function makeFilterExpression ($validation, key, filters) {
        var elements = [key], ret = ''

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

    function defineProperty ($validation, key, binding) {
        var observer = $validation.__emitter__

        if (!(hasOwn.call($validation, key))) {
            $validation[key] = undefined
        }

        if (observer && !(hasOwn.call(observer.values, key))) {
            Observer.convertKey($validation, key)
        }

        binding.value = $validation[key]
    }
}


/**
 * validate filters
 */

function validateRequired (val, key) {
    try {
        this.$validation[[key, 'required'].join('.')] = (val.length === 0)
    } catch (e) {
        console.error('required filter error:', e)
    }

    return val
}

function validatePattern (val) {
    try {
        var key = arguments[arguments.length - 1],
            pattern = arguments[1].replace(/^'/, "").replace(/'$/, "")

        var match = pattern.match(/^\/(.*)\/([gim]*)$/)
        if (match) {
            var re = new RegExp(match[1], match[2])
            this.$validation[[key, 'pattern'].join('.')] = !re.test(val)
        }
    } catch (e) {
        console.error('pattern filter error:', e)
    }

    return val
}

function validateLength (val) {
    try {
        var key = arguments[arguments.length - 1],
            minKey = [key, 'length', 'min'].join('.'),
            maxKey = [key, 'length', 'max'].join('.'),
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
            this.$validation[minKey] = (val.length < args['min'])
        }

        // validate max
        if ('max' in args) {
            this.$validation[maxKey] = (val.length > args['max'])
        }
    } catch (e) {
        console.error('length filter error:', e)
    }

    return val
}

function validateNumeric (val) {
    try {
        var key = arguments[arguments.length - 1],
            minKey = [key, 'numeric', 'min'].join('.'),
            maxKey = [key, 'numeric', 'max'].join('.'),
            valueKey = [key, 'numeric', 'value'].join('.'),
            args = {}
        
        // parse numeric condition arguments
        for (var i = 1; i < arguments.length - 1; i++) {
            var parsed = arguments[i].split(':')
            if (parsed.length !== 2) { continue }
            if (isNaN(parsed[1])) { continue }
            args[parsed[0]] = parseInt(parsed[1])
        }

        if (isNaN(val)) {
            this.$validation[valueKey] = true
            if ('min' in args) {
              this.$validation[minKey] = false
            }
            if ('max' in args) {
              this.$validation[maxKey] = false
            }
        } else {
            this.$validation[valueKey] = false

            var value = parseInt(val)

            // validate min
            if ('min' in args) {
                this.$validation[minKey] = (value < args['min'])
            }

            // validate max
            if ('max' in args) {
                this.$validation[maxKey] = (value > args['max'])
            }
        }
    } catch (e) {
        console.error('numeric filter error:', e)
    }

    return val
}

function validateCustom (val, custom) {
    try {
        var fn = this.$options.methods[custom]
        if (typeof fn === 'function') {
            val = fn.call(this, val)
        }
    } catch (e) {
        console.error('custom filter error:', e)
    }

    return val
}
