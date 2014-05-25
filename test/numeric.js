/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('numeric', function () {

    describe('when min and max arguments specify', function () {
        var input = mock(
            'validator-numeric1',
            '<form v-validate>' +
            'threshold: <input type="text" v-model="threshold | numeric min:0 max:100" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-numeric1',
            data: {
                threshold: '50'
            }
        })

        describe('when input -1', function () {
            before(function (done) {
                input.value = '-1'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.min).to.be(true)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.max).to.be(false)
                        done()
                    })
                })
            })
        })

        describe('when input 0', function () {
            before(function (done) {
                input.value = '0'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.min).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.max).to.be(false)
                        done()
                    })
                })
            })
        })

        describe('when input 100', function () {
            before(function (done) {
                input.value = '100'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.min).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.max).to.be(false)
                        done()
                    })
                })
            })
        })

        describe('when input 101', function () {
            before(function (done) {
                input.value = '101'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.min).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.max).to.be(true)
                        done()
                    })
                })
            })
        })

        describe('when input string', function () {
            before(function (done) {
                input.value = 'foo'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.threshold.numeric.value', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.threshold.numeric.value).to.be(true)
                        done()
                    })
                })
            })
        })
    })

    describe('when single argument specify', function () {
        var input = mock(
            'validator-numeric2',
            '<form v-validate>' +
            'comment: <input type="text" v-model="threshold | numeric min:4" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-numeric2',
            data: {
                comment: ''
            }
        })

        before(function (done) {
            input.value = '3'
            input.dispatchEvent(mockHTMLEvent('input'))
            done()
        })

        describe('$validation.threshold.numeric.min', function () {
            it('should be true', function (done) {
                nextTick(function () {
                    expect(form.$validation.threshold.numeric.min).to.be(true)
                    done()
                })
            })
        })

        describe('$validation.threshold.numeric.max', function () {
            it('should be undefined', function (done) {
                nextTick(function () {
                    expect(form.$validation.threshold.numeric.max).to.be(false)
                    done()
                })
            })
        })

        describe('$validation.threshold.numeric.value', function () {
            it('should be undefined', function (done) {
                nextTick(function () {
                    expect(form.$validation.threshold.numeric.value).to.be(false)
                    done()
                })
            })
        })
    })
})
