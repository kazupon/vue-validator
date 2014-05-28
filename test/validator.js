/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('validator', function () {
    var input, form, span
    
    before(function (done) {
        input = mock(
            'validator-validator',
            '<form v-validate>' +
            'comment: <input type="text" v-model="comment | validator validateCustom" /><br />' +
            '<div><span v-show="$validation.comment.validator.validateCustom">invalid custom</span></div>' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        form = new Vue({
            el: '#validator-validator',
            data: {
                comment: ''
            },
            methods: {
                validateCustom: function (val) {
                    this.$validation['comment.validator.validateCustom'] = !(0 < val.length & val.length < 3)
                    return val
                }
            }
        })

        nextTick(function () {
            input.value = 'aaaa'
            input.dispatchEvent(mockHTMLEvent('input'))
            span = form.$el.getElementsByTagName('span')[0]
            done()
        })
    })

    after(function (done) {
        form.$destroy()
        done()
    })


    describe('$validation.comment.validator.validateCustom', function () {
        it('should be true', function (done) {
            nextTick(function () {
                expect(form.$validation['comment.validator.validateCustom']).to.be(true)
                done()
            })
        })
    })

    describe('validate comment validateCustom  message span tag', function () {
        it('should be shown', function (done) {
            nextTick(function () {
                expect(span.style.display).to.be('')
                done()
            })
        })
    })
})
