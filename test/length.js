/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('length', function () {

    describe('when min and max arguments specify', function () {
        var input = mock(
            'validator-length1',
            '<form v-validate>' +
            'comment: <input type="text" v-model="comment | length min:4 max:8" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-length1',
            data: {
                comment: ''
            }
        })

        describe('when input 3 length string', function () {
            before(function (done) {
                input.value = 'aaa'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.min).to.be(true)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.max).to.be(false)
                        done()
                    })
                })
            })
        })

        describe('when input 4 length string', function () {
            before(function (done) {
                input.value = 'aaaa'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.min).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.max).to.be(false)
                        done()
                    })
                })
            })
        })

        describe('when input 8 length string', function () {
            before(function (done) {
                input.value = 'aaaabbbb'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.min).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.max).to.be(false)
                        done()
                    })
                })
            })
        })

        describe('when input 9 length string', function () {
            before(function (done) {
                input.value = 'aaaabbbbc'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.min).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.comment.length.max).to.be(true)
                        done()
                    })
                })
            })
        })
    })

    describe('when single argument specify', function () {
        var input = mock(
            'validator-length2',
            '<form v-validate>' +
            'comment: <input type="text" v-model="comment | length min:4" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-length2',
            data: {
                comment: ''
            }
        })

        before(function (done) {
            input.value = 'aaaa'
            input.dispatchEvent(mockHTMLEvent('input'))
            done()
        })

        describe('$validation.comment.length.min', function () {
            it('should be false', function (done) {
                nextTick(function () {
                    expect(form.$validation.comment.length.min).to.be(false)
                    done()
                })
            })
        })

        describe('$validation.comment.length.max', function () {
            it('should be undefined', function (done) {
                nextTick(function () {
                    expect(form.$validation.comment.length.max).to.be(undefined)
                    done()
                })
            })
        })
    })
})
