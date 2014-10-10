/**
 * import(s)
 */

var Vue = require('vue')
var nextTick = Vue.require('utils').nextTick
var validator = require('vue-validator')


describe('required', function () {
  var input
  var form
  var span

  before(function (done) {
    input = mock(
      'validator-required',
      '<form v-validate>' +
      'Password: <input type="password" v-model="password | required" /><br />' +
      '<div><span v-show="$validation.password.required">required !!</span></div>' +
      '</form>'
    ).getElementsByTagName('input')[0]

    Vue.use(validator)

    form = new Vue({
      el: '#validator-required',
      data: {
        password: ''
      }
    })

    done();
  })

  after(function (done) {
    form.$destroy()
    done()
  })


  describe('when input text empty', function () {
    before(function (done) {
      input.value = ''
      input.dispatchEvent(mockHTMLEvent('input'))
      span = form.$el.getElementsByTagName('span')[0]
      done()
    })
  
    describe('$validation.password.required', function () {
      it('should be true', function (done) {
        nextTick(function () {
          expect(form.$validation['password.required']).to.be(true)
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
  
  describe('when input text some value', function () {
    before(function (done) {
      input.value = 'bar'
      input.dispatchEvent(mockHTMLEvent('input'))
      span = form.$el.getElementsByTagName('span')[0]
      done()
    })
  
    describe('$validation.password.required', function () {
      it('should be false', function (done) {
        nextTick(function () {
          expect(form.$validation['password.required']).to.be(false)
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
