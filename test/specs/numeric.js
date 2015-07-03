/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('min', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })


  describe('boundary', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="threshold" v-validate="min: 0">',
        data: { threshold: null }
      })
      targetVM = vm.$children[0]
    })


    describe('value - 1', function () {
      beforeEach(function (done) {
        vm.threshold = '-1'

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.threshold.min).to.be(true)
      })
    })


    describe('just value', function () {
      beforeEach(function (done) {
        vm.threshold = '0'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.threshold.min).to.be(false)
      })
    })


    describe('value + 1', function () {
      beforeEach(function (done) {
        vm.threshold = '1'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.threshold.min).to.be(false)
      })
    })


    describe('not numeric value', function () {
      beforeEach(function (done) {
        vm.threshold = 'hello'

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.threshold.min).to.be(true)
      })
    })
  })
})



describe('max', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })
  

  describe('boundary', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="threshold" v-validate="max: 100">',
        data: { threshold: null }
      })
      targetVM = vm.$children[0]
    })


    describe('value - 1', function () {
      beforeEach(function (done) {
        vm.threshold = '99'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.threshold.max).to.be(false)
      })
    })


    describe('just value', function () {
      beforeEach(function (done) {
        vm.threshold = '100'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.threshold.max).to.be(false)
      })
    })


    describe('value + 1', function () {
      beforeEach(function (done) {
        vm.threshold = '101'

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.threshold.max).to.be(true)
      })
    })


    describe('not numeric value', function () {
      beforeEach(function (done) {
        vm.threshold = 'hello'

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.threshold.max).to.be(true)
      })
    })
  })
})
