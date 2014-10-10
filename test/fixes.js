/**
 * import(s)
 */

var Vue = require('vue')
var nextTick = Vue.require('utils').nextTick
var validator = require('vue-validator')


describe('bug-fixes', function () {
  var input_comment1
  var input_comment2
  var form
  var span_comment1
  var span_comment2

  describe('issue #1: Cannot run the validator', function () {
    before(function (done) {
      var body = mock(
        'validator-container-layout',
        '<form v-validate>' +
        '<div>' + 
        'comment: <input type="text" v-model="comment1 | required">' +
        '</div>' +
        '<div>' + 
        'comment: <input type="text" v-model="comment2 | required">' +
        '</div>' +
        '<div><span v-show="$validation.comment1.required">comment1 required</span></div>' +
        '<div><span v-show="$validation.comment2.required">comment2 required</span></div>' +
        '</form>'
      )

      Vue.use(validator)

      form = new Vue({
        el: '#validator-container-layout',
        data: {
          comment1: 'foo',
          comment2: ''
        }
      })

      nextTick(function () {
        input_comment1 = body.getElementsByTagName('input')[0]
        input_comment2 = body.getElementsByTagName('input')[1]
        input_comment1.value = ''
        input_comment1.dispatchEvent(mockHTMLEvent('input'))
        input_comment2.value = 'foo'
        input_comment2.dispatchEvent(mockHTMLEvent('input'))
        span_comment1 = body.getElementsByTagName('span')[0]
        span_comment2 = body.getElementsByTagName('span')[1]

        done()
      })
    })

    after(function (done) {
      form.$destroy()
      done()
    })


    describe('$validation.comment1.required', function () {
      it('should be true', function (done) {
        nextTick(function () {
          expect(form.$validation['comment1.required']).to.be(true)
          done()
        })
      })
    })

    describe('$validation.comment2.required', function () {
      it('should be false', function (done) {
        nextTick(function () {
          expect(form.$validation['comment2.required']).to.be(false)
          done()
        })
      })
    })

    describe('validate comment1 required message span tag', function () {
      it('should be shown', function (done) {
        nextTick(function () {
          expect(span_comment1.style.display).to.be('')
          done()
        })
      })
    })

    describe('validate comment2 required message span tag', function () {
      it('should be hidden', function (done) {
        nextTick(function () {
          expect(span_comment2.style.display).to.be('none')
          done()
        })
      })
    })
  })
})
