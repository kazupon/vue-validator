/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('pattern', function () {
  var vm, targetVM
  
  before(function () {
    Vue.config.async = false
  })

  after(function () {
    Vue.config.async = true
  })


  describe('regex basic', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="msg" v-validate="pattern: /^[0-9a-zA-Z]+$/">',
        component: validator,
        data: function () { return { msg: '111' } }
      })
      targetVM = vm._children[0]
    })

    describe('valid', function () {
      beforeEach(function () {
        vm.msg = 'foo11'
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(targetVM.validation.msg.pattern).to.be(false)
      })
    })

    describe('invalid', function () {
      beforeEach(function () {
        vm.msg = ''
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(targetVM.validation.msg.pattern).to.be(true)
      })
    })
  })


  describe('regex flag', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="msg" v-validate="pattern: /hello/i">',
        component: validator,
        data: function () { return { msg: null } }
      })
      targetVM = vm._children[0]
    })

    describe('valid', function () {
      beforeEach(function () {
        vm.msg = 'HELLO'
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(targetVM.validation.msg.pattern).to.be(false)
      })
    })

    describe('invalid', function () {
      beforeEach(function () {
        vm.msg = ''
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(targetVM.validation.msg.pattern).to.be(true)
      })
    })
  })
})
