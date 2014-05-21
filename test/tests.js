/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


    /*
function mockDirective (dirName, tag, type) {
    var dir = Vue.directive(dirName),
        ret = {
            binding: { compiler: { vm: {} } },
            compiler: { vm: {}, options: {}, execHook: function () {} },
            el: document.createElement(tag || 'div')
        }
    if (typeof dir === 'function') {
        ret.update = dir
    } else {
        for (var key in dir) {
            ret[key] = dir[key]
            ret._update = dir.update
            ret._unbind = dir.unbind
        }
    }
    if (tag === 'input') ret.el.type = type || 'text'
    return ret
}
*/


describe('vue-validator', function () {
    describe('required', function () {
        var input = mock(
            'validator-required',
            '<form v-validate>' +
            'Password: <input type="password" v-model="password | required" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-required',
            data: {
                password: ''
            }
        })

        describe('when input text empty', function () {
            it('should set false value to $validation.password.required', function (done) {
                input.value = ''
                input.dispatchEvent(mockHTMLEvent('input'))
                nextTick(function () {
                    expect(form.$validation.password.required).to.be(false)
                    done()
                })
            })
        })

        describe('when input text some value', function () {
            it('should set true value to $validation.password.required', function (done) {
                input.value = 'bar'
                input.dispatchEvent(mockHTMLEvent('input'))
                nextTick(function () {
                    expect(form.$validation.password.required).to.be(true)
                    done()
                })
            })
        })
    })


    describe('pattern', function () {
        var input = mock(
            'validator-pattern',
            '<form v-validate>' +
            'value: <input type="text" v-model="value | pattern [0-9]+" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-pattern',
            data: {
                value: ''
            }
        })

        describe('when input invalid pattern', function () {
            it('should set false value to $validation.value.pattern', function (done) {
                input.value = 'hoge'
                input.dispatchEvent(mockHTMLEvent('input'))
                nextTick(function () {
                    expect(form.$validation.value.pattern).to.be(false)
                    done()
                })
            })
        })

        describe('when input valid pattern', function () {
            it('should set true value to $validation.value.pattern', function (done) {
                input.value = '1111'
                input.dispatchEvent(mockHTMLEvent('input'))
                nextTick(function () {
                    expect(form.$validation.value.pattern).to.be(true)
                    done()
                })
            })
        })
    })


    describe('length', function () {
        var input = mock(
            'validator-length',
            '<form v-validate>' +
            'comment: <input type="text" v-model="comment | length min=4 max=8" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-comment',
            data: {
                comment: ''
            }
        })

        describe('when input invalid pattern', function () {
            it('should set false value to $validation.value.pattern', function (done) {
                input.value = 'hoge'
                input.dispatchEvent(mockHTMLEvent('input'))
                nextTick(function () {
                    expect(form.$validation.value.pattern).to.be(false)
                    done()
                })
            })
        })

        describe('when input valid pattern', function () {
            it('should set true value to $validation.value.pattern', function (done) {
                input.value = '1111'
                input.dispatchEvent(mockHTMLEvent('input'))
                nextTick(function () {
                    expect(form.$validation.value.pattern).to.be(true)
                    done()
                })
            })
        })
    })
})
