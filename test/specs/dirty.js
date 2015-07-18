/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('dirty', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })


  beforeEach(function (done) {
    var inputs = '<input type="text" v-model="username" v-validate="required, minLength: 4, maxLength: 16">'
      + '<input type="text" v-model="zip" v-validate="required, pattern: \'/^[0-9]{3}-[0-9]{4}$/\'"'
    vm = createInstance({
       target: inputs,
       data: { username: '', zip: '' }
    })
    targetVM = vm.$children[0]

    Vue.nextTick(done)
  })

  
  describe('init instance', function () {
    describe('validation.username.dirty', function () {
      it('should be false', function () {
        expect(targetVM.validation.username.dirty).to.be(false)
      })
    })

    describe('validation.zip.dirty', function () {
      it('should be false', function () {
        expect(targetVM.validation.zip.dirty).to.be(false)
      })
    })

    describe('dirty', function () {
      it('should be false', function () {
        expect(targetVM.dirty).to.be(false)
      })
    })
  })


  describe('edit username, and zip', function () {
    beforeEach(function (done) {
      vm.username = 'kazupon'
      vm.zip = '111-2222'

      Vue.nextTick(done)
    })

    describe('validation.username.dirty', function () {
      it('should be true', function () {
        expect(targetVM.validation.username.dirty).to.be(true)
      })
    })

    describe('validation.zip.dirty', function () {
      it('should be true', function () {
        expect(targetVM.validation.zip.dirty).to.be(true)
      })
    })

    describe('dirty', function () {
      it('should be true', function () {
        expect(targetVM.dirty).to.be(true)
      })
    })

    describe('reset username', function () {
      beforeEach(function (done) {
        vm.username = ''

        Vue.nextTick(done)
      })

      describe('validation.username.dirty', function () {
        it('should be false', function () {
          expect(targetVM.validation.username.dirty).to.be(false)
        })
      })

      describe('validation.zip.dirty', function () {
        it('should be true', function () {
          expect(targetVM.validation.zip.dirty).to.be(true)
        })
      })

      describe('dirty', function () {
        it('should be true', function () {
          expect(targetVM.dirty).to.be(true)
        })
      })
    })
  })
})
