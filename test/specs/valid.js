/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('valid', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })


  beforeEach(function (done) {
    var inputs = '<input type="text" v-model="username" v-validate="required, minLength: 4, maxLength: 16">'
      + '<input type="text" v-model="zip" v-validate="required, pattern: \'/^[0-9]{3}-[0-9]{4}$/\'"'
    vm = createInstance({
       target: inputs, data: { username: '', zip: '' }
    })
    targetVM = vm._children[0]

    Vue.nextTick(function () { done() })
  })

  
  describe('init instance', function () {
    describe('validation.username.valid', function () {
      it('should be false', function () {
        expect(targetVM.validation.username.valid).to.be(false)
      })
    })

    describe('validation.zip.valid', function () {
      it('should be false', function () {
        expect(targetVM.validation.zip.valid).to.be(false)
      })
    })

    describe('valid', function () {
      it('should be false', function () {
        expect(targetVM.valid).to.be(false)
      })
    })
  })


  describe('pass username validation', function () {
    beforeEach(function (done) {
      vm.username = 'kazupon'

      Vue.nextTick(function () { done() })
    })

    describe('validation.username.valid', function () {
      it('should be true', function () {
        expect(targetVM.validation.username.valid).to.be(true)
      })
    })

    describe('validation.zip.valid', function () {
      it('should be false', function () {
        expect(targetVM.validation.zip.valid).to.be(false)
      })
    })

    describe('valid', function () {
      it('should be false', function () {
        expect(targetVM.valid).to.be(false)
      })
    })
  })


  describe('pass username and zip validation', function () {
    beforeEach(function (done) {
      vm.username = 'kazupon'
      vm.zip = '111-2222'
      
      Vue.nextTick(function () { done() })
    })

    describe('validation.username.valid', function () {
      it('should be true', function () {
        expect(targetVM.validation.username.valid).to.be(true)
      })
    })

    describe('validation.zip.valid', function () {
      it('should be true', function () {
        expect(targetVM.validation.zip.valid).to.be(true)
      })
    })

    describe('valid', function () {
      it('should be true', function () {
        expect(targetVM.valid).to.be(true)
      })
    })
  })
})
