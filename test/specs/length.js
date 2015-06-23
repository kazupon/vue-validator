/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('minLength', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })
  

  describe('boundary', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="comment" v-validate="minLength: 4">',
        data: { comment: null }
      })
      targetVM = vm._children[0]
    })


    describe('length - 1', function () {
      beforeEach(function (done) {
        vm.comment = 'aaa'

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.comment.minLength).to.be(true)
      })
    })


    describe('just length', function () {
      beforeEach(function (done) {
        vm.comment = 'aaaa'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.comment.minLength).to.be(false)
      })
    })


    describe('length + 1', function () {
      beforeEach(function (done) {
        vm.comment = 'aaaaa'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.comment.minLength).to.be(false)
      })
    })
  })
})



describe('maxLength', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })
  

  describe('boundary', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="comment" v-validate="maxLength: 4">',
        data: { comment: null }
      })
      targetVM = vm._children[0]
    })


    describe('length - 1', function () {
      beforeEach(function (done) {
        vm.comment = 'aaa'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.comment.maxLength).to.be(false)
      })
    })


    describe('just length', function () {
      beforeEach(function (done) {
        vm.comment = 'aaaa'

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.comment.maxLength).to.be(false)
      })
    })


    describe('length + 1', function () {
      beforeEach(function (done) {
        vm.comment = 'aaaaa'

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.comment.maxLength).to.be(true)
      })
    })
  })
})
