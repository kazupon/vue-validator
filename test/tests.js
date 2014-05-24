/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


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
            before (function (done) {
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
            before (function (done) {
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
            before (function (done) {
                input.value = 'hoge'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.value.pattern', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.value.pattern).to.be(true)
                        done()
                    })
                })
            })
        })

        describe('when input valid pattern', function () {
            before (function (done) {
                input.value = '1111'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.value.pattern', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.value.pattern).to.be(false)
                        done()
                    })
                })
            })
        })
    })


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


    describe('numeric', function () {

        describe('when min and max arguments specify', function () {
            var input = mock(
                'validator-numeric1',
                '<form v-validate>' +
                'comment: <input type="text" v-model="threshold | numeric min:0 max:100" /><br />' +
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
})
