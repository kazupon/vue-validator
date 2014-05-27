/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('length', function () {
    var input, form, span_min, span_max

    describe('when min and max arguments specify', function () {
        before(function (done) {
            input = mock(
                'validator-length1',
                '<form v-validate>' +
                'comment: <input type="text" v-model="comment | length min:4 max:8" /><br />' +
                '<div><span v-show="$validation.comment.length.min">too short</span></div>' +
                '<div><span v-show="$validation.comment.length.max">too long</span></div>' +
                '</form>'
            ).getElementsByTagName('input')[0]

            Vue.use(validator)

            form = new Vue({
                el: '#validator-length1',
                data: {
                    comment: ''
                }
            })

            done()
        })

        after(function (done) {
            form.$destroy()
            done()
        })


        describe('when input 3 length string', function () {
            before(function (done) {
                input.value = 'aaa'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.min']).to.be(true)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.max']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate comment min message span tag', function () {
                it('should be shown', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('')
                        done()
                    })
                })
            })

            describe('validate comment max message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('none')
                        done()
                    })
                })
            })
        })


        describe('when input 4 length string', function () {
            before(function (done) {
                input.value = 'aaaa'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.min']).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.max']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate comment min message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('none')
                        done()
                    })
                })
            })

            describe('validate comment max message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('none')
                        done()
                    })
                })
            })
        })


        describe('when input 8 length string', function () {
            before(function (done) {
                input.value = 'aaaabbbb'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.min']).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.max']).to.be(false)
                        done()
                    })
                })
            })

            describe('validate comment min message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('none')
                        done()
                    })
                })
            })

            describe('validate comment max message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('none')
                        done()
                    })
                })
            })
        })


        describe('when input 9 length string', function () {
            before(function (done) {
                input.value = 'aaaabbbbc'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                span_max = form.$el.getElementsByTagName('span')[1]
                done()
            })

            describe('$validation.comment.length.min', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.min']).to.be(false)
                        done()
                    })
                })
            })

            describe('$validation.comment.length.max', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation['comment.length.max']).to.be(true)
                        done()
                    })
                })
            })

            describe('validate comment min message span tag', function () {
                it('should be hidden', function (done) {
                    nextTick(function () {
                        expect(span_min.style.display).to.be('none')
                        done()
                    })
                })
            })

            describe('validate comment max message span tag', function () {
                it('should be shown', function (done) {
                    nextTick(function () {
                        expect(span_max.style.display).to.be('')
                        done()
                    })
                })
            })
        })
    })


    describe('when single argument specify', function () {
        before(function (done) {
            input = mock(
                'validator-length2',
                '<form v-validate>' +
                'comment: <input type="text" v-model="comment | length min:4" /><br />' +
                '<div><span v-show="$validation.comment.length.min">too short</span></div>' +
                '</form>'
            ).getElementsByTagName('input')[0]

            Vue.use(validator)

            form = new Vue({
                el: '#validator-length2',
                data: {
                    comment: ''
                }
            })

            nextTick(function () {
                input.value = 'aaaa'
                input.dispatchEvent(mockHTMLEvent('input'))
                span_min = form.$el.getElementsByTagName('span')[0]
                done()
            })
        })

        after(function (done) {
            form.$destroy()
            done()
        })

        
        describe('$validation.comment.length.min', function () {
            it('should be false', function (done) {
                nextTick(function () {
                    expect(form.$validation['comment.length.min']).to.be(false)
                    done()
                })
            })
        })

        describe('$validation.comment.length.max', function () {
            it('should be undefined', function (done) {
                nextTick(function () {
                    expect(form.$validation['comment.length.max']).to.be(undefined)
                    done()
                })
            })
        })

        describe('validate comment min message span tag', function () {
            it('should be hidden', function (done) {
                nextTick(function () {
                    expect(span_min.style.display).to.be('none')
                    done()
                })
            })
        })
    })
})
