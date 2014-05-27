/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('numeric', function () {
    var input, form, span_min, span_max, span_value

    describe('when min and max arguments specify', function () {
        before(function (done) {
            input = mock(
                'validator-numeric1',
                '<form v-validate>' +
                'threshold: <input type="text" v-model="threshold | numeric min:0 max:100" /><br />' +
                '<div><span v-show="$validation.threshold.numeric.min">too small</span></div>' +
                '<div><span v-show="$validation.threshold.numeric.max">too small</span></div>' +
                '<div><span v-show="$validation.threshold.numeric.value">invalid value</span></div>' +
                '</form>'
            ).getElementsByTagName('input')[0]

            Vue.use(validator)

            form = new Vue({
                el: '#validator-numeric1',
                data: {
                    threshold: '50'
                }
            })

            // adjust timing
            nextTick(function () { done() })
        })

        after(function (done) {
            form.$destroy()
            done()
        })


        describe('when input -1', function () {
            before(function (done) {
                input.value = '-1'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.min']).to.be(true)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.max']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate threshold min message span tag', function () {
                it('should be shown', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('')
                        done()
                    })
                })
            })

            describe('validate threshold max message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('none')
                        done()
                    })
                })
            })
        })


        describe('when input 0', function () {
            before(function (done) {
                input.value = '0'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.min']).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.max']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate threshold min message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('none')
                        done()
                    })
                })
            })

            describe('validate threshold max message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('none')
                        done()
                    })
                })
            })
        })


        describe('when input 100', function () {
            before(function (done) {
                input.value = '100'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.min']).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.max']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate threshold min message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('none')
                        done()
                    })
                })
            })

            describe('validate threshold max message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('none')
                        done()
                    })
                })
            })
        })


        describe('when input 101', function () {
            before(function (done) {
                input.value = '101'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.threshold.numeric.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.min']).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.threshold.numeric.max', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.max']).to.be(true)
                        done()
                    })
                })
            })
        })

        describe('when input string', function () {
            before(function (done) {
                input.value = 'foo'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_value = form.$el.getElementsByTagName('span')[2]
                done()
            })

            describe('$validation.threshold.numeric.value', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation['threshold.numeric.value']).to.be(true)
                        done()
                    })
                })
            })

            describe('validate threshold value message span tag', function () {
                it('should be shown', function (done) {
                    nextTick(function () {
                        expect(span_value.style.display).to.be('')
                        done()
                    })
                })
            })
        })
    })


    /*
    describe('when single argument specify', function () {
        before(function (done) {
            input = mock(
                'validator-numeric2',
                '<form v-validate>' +
                'comment: <input type="text" v-model="threshold | numeric min:4" /><br />' +
                '<div><span v-show="$validation.threshold.numeric.min">too small</span></div>' +
                '<div><span v-show="$validation.threshold.numeric.value">invalid value</span></div>' +
                '</form>'
            ).getElementsByTagName('input')[0]

            Vue.use(validator)

            form = new Vue({
                el: '#validator-numeric2',
                data: {
                    numeric: ''
                }
            })

            nextTick(function () {
                input.value = '3'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_value = form.$el.getElementsByTagName('span')[1]
                done()
            })
        })

        after(function (done) {
            form.$destroy()
            done()
        })


        describe('$validation.threshold.numeric.min', function () {
            it('should be true', function (done) {
                nextTick(function () {
                    expect(form.$validation['threshold.numeric.min']).to.be(true)
                    done()
                })
            })
        })

        describe('$validation.threshold.numeric.max', function () {
            it('should be undefined', function (done) {
                nextTick(function () {
                    expect(form.$validation['threshold.numeric.max']).to.be(undefined)
                    done()
                })
            })
        })

        describe('$validation.threshold.numeric.value', function () {
            it('should be false', function (done) {
                nextTick(function () {
                    expect(form.$validation['threshold.numeric.value']).to.be(false)
                    done()
                })
            })
        })

        describe('validate threshold min message span tag', function () {
            it('should be shown', function (done) {
                nextTick(function () {
                    expect(span_min.style.display).to.be('')
                    done()
                })
            })
        })

        describe('validate threshold value message span tag', function () {
            it('should be hidden', function (done) {
                nextTick(function () {
                    expect(span_value.style.display).to.be('none')
                    done()
                })
            })
        })
    })
    */
})
