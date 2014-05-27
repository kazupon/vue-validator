/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('pattern', function () {
    var input, form, span

    describe('basic', function () {
        before(function (done) {
            input = mock(
                'validator-pattern1',
                '<form v-validate>' +
                'value: <input type="text" v-model="value | pattern /[0-9]+/" /><br />' +
                '<div><span v-show="$validation.value.pattern">invalid format!!</span></div>' +
                '</form>'
            ).getElementsByTagName('input')[0]

            Vue.use(validator)

            form = new Vue({
                el: '#validator-pattern1',
                data: {
                    value: ''
                }
            })
            
            // adjust timing
            nextTick(function () { done() })
        })

        after(function (done) {
            form.$destroy()
            done()
        })


        describe('when input invalid pattern', function () {
            before(function (done) {
                input.value = 'hoge'
                input.dispatchEvent(mockHTMLEvent('input'))
                span = form.$el.getElementsByTagName('span')[0]
                done()
            })

            describe('$validation.value.pattern', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation['value.pattern']).to.be(true)
                        done()
                    })
                })
            })

            describe('validate message span tag', function () {
                it('should be shown', function (done) {
                    nextTick(function () {
                        expect(span.style.display).to.be('')
                        done()
                    })
                })
            })
        })

        describe('when input valid pattern', function () {
            before(function (done) {
                input.value = '1111'
                input.dispatchEvent(mockHTMLEvent('input'))
                span = form.$el.getElementsByTagName('span')[0]
                done()
            })

            describe('$validation.value.pattern', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['value.pattern']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span.style.display).to.be('none')
                        done()
                    })
                })
            })
        })
    })


    describe('Regex flag', function () {
        before(function (done) {
            input = mock(
                'validator-pattern2',
                '<form v-validate>' +
                '<div><span v-show="$validation.message.pattern">invalid message format!!</span></div>' +
                'message: <input type="text" v-model="message | pattern \'/hello|world/i\'" /><br />' +
                '</form>'
            ).getElementsByTagName('input')[0]

            Vue.use(validator)

            form = new Vue({
                el: '#validator-pattern2',
                data: {
                    message: ''
                }
            })
            
            // adjust timing
            nextTick(function () { done() })
        })

        after(function (done) {
            form.$destroy()
            done()
        })


        describe('when input HELLO', function () {
            before(function (done) {
                input.value = 'HELLO'
                input.dispatchEvent(mockHTMLEvent('input'))
                span = form.$el.getElementsByTagName('span')[0]
                done()
            })

            describe('$validation.message.pattern', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['message.pattern']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span.style.display).to.be('none')
                        done()
                    })
                })
            })
        })
    })
})
