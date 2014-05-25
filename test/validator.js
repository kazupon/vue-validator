/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('validator', function () {
    var input = mock(
        'validator-validator',
        '<form v-validate>' +
        'comment: <input type="text" v-model="comment | validator validateCustom" /><br />' +
        '</form>'
    ).getElementsByTagName('input')[0]

    Vue.use(validator)

    var form = new Vue({
        el: '#validator-validator',
        data: {
            comment: ''
        },
        methods: {
            validateCustom: function (val) {
                this.$validation.comment.validator.required = (val.length === 0)
                this.$validation.comment.validator.min = (val.length < 3)
                return val
            }
        }
    })

    before(function (done) {
        input.value = 'aa'
        input.dispatchEvent(mockHTMLEvent('input'))
        done()
    })

    describe('$validation.comment.validator.required', function () {
        it('should be false', function (done) {
            nextTick(function () {
                expect(form.$validation.comment.validator.required).to.be(false)
                done()
            })
        })
    })

    describe('$validation.comment.validator.min', function () {
        it('should be true', function (done) {
            nextTick(function () {
                expect(form.$validation.comment.validator.min).to.be(true)
                done()
            })
        })
    })
})
