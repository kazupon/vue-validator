/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


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
        before(function (done) {
            input.value = ''
            input.dispatchEvent(mockHTMLEvent('input'))
            done()
        })

        describe('$validation.password.required', function () {
            it('should be true', function (done) {
                nextTick(function () {
                    expect(form.$validation.password.required).to.be(true)
                    done()
                })
            })
        })
    })

    describe('when input text some value', function () {
        before(function (done) {
            input.value = 'bar'
            input.dispatchEvent(mockHTMLEvent('input'))
            done()
        })

        describe('$validation.password.required', function () {
            it('should be false', function (done) {
                nextTick(function () {
                    expect(form.$validation.password.required).to.be(false)
                    done()
                })
            })
        })
    })
})
