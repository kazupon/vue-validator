/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('dirty', function () {
  var vm, targetVM

  before(function () {
    Vue.config.async = false
  })

  after(function () {
    Vue.config.async = true
  })

  beforeEach(function () {
    vm = createInstance({
       target: '<input type="text" v-model="username" v-validate="required, minLength: 4, maxLength: 16">',
       component: validator,
       data: function () { return { username: '' } }
    })
    targetVM = vm._children[0]
  })

  
  describe('init instance', function () {
    describe('validation.username.dirty', function () {
      it('should be false', function () {
        expect(targetVM.validation.username.valid).to.be(false)
      })
    })
  })


  describe('edit username', function () {
    beforeEach(function () {
      vm.username = 'kazupon'
      vm._digest() // force update
    })

    describe('validation.username.dirty', function () {
      it('should be true', function () {
        expect(targetVM.validation.username.dirty).to.be(true)
      })
    })
  })


  describe('edit, and reset username', function () {
    beforeEach(function () {
      vm.username = 'kazupon'
      vm._digest() // force update

      vm.username = ''
      vm._digest() // force update
    })

    describe('validation.username.dirty', function () {
      it('should be false', function () {
        expect(targetVM.validation.username.dirty).to.be(false)
      })
    })
  })
})
