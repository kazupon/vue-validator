/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var wrapTemplate = require('./helper').wrapTemplate
var nextTick = Vue.util.nextTick


describe('required', function () {
  var vm, target

  function createInstance (inject, data) {
    var Validator = Vue.extend({
      template: wrapTemplate(inject),
      el: function () { return document.createElement('div') },
      data: data
    })
    return new Validator()
  }

  before(function () {
    Vue.use(validator)
  })


  describe('model data', function () {
    describe('set no empty', function () {
      beforeEach(function (done) {
        vm = createInstance(
          '<input type="text" v-model="msg" v-validate="required">',
          { msg: null }
        )
        target = vm._children[0]
        vm.msg = 'hello'
        vm._digest() // force update
        nextTick(done)
      })

      it('should be false', function () {
        expect(target.validation.msg.required).to.be(false)
      })
    })

    describe('set empty', function () {
      beforeEach(function (done) {
        vm = createInstance(
          '<input type="text" v-model="msg" v-validate="required">',
          { msg: 'hello' }
        )
        target = vm._children[0]
        vm.msg = ''
        vm._digest() // force update
        nextTick(done)
      })

      it('should be true', function () {
        expect(target.validation.msg.required).to.be(true)
      })
    })
  })


  describe('input `value` attribute', function () {
    describe('set no empty', function () {
      beforeEach(function (done) {
        vm = createInstance(
          '<input type="text" value="hello" v-model="msg" v-validate="required">',
          { msg: null }
        )
        target = vm._children[0]
        nextTick(done)
      })

      it('should be false', function () {
        expect(target.validation.msg.required).to.be(false)
      })
    })

    describe('set empty', function () {
      beforeEach(function (done) {
        vm = createInstance(
          '<input type="text" value="" v-model="msg" v-validate="required">',
          { msg: null }
        )
        target = vm._children[0]
        nextTick(done)
      })

      it('should be true', function () {
        expect(target.validation.msg.required).to.be(true)
      })
    })
  })
})
