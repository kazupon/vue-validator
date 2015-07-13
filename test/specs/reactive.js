/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('reactive', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  beforeEach(function (done) {
    vm = createInstance({
      template: '<input type="text" v-model="comment" v-validate="required, minLength: min, maxLength: max">',
      data: { comment: '', min: 4, max: 255 }
    })

    Vue.nextTick(done)
  })

  describe('default', function () {
    it('should be expected', function () {
      expect(vm.validation.comment.required).to.be(true)
      expect(vm.validation.comment.minLength).to.be(true)
      expect(vm.validation.comment.maxLength).to.be(false)
      expect(vm.validation.comment.valid).to.be(false)
      expect(vm.validation.comment.invalid).to.be(true)
      expect(vm.validation.comment.dirty).to.be(false)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(false)
    })

    describe('change validator argument', function () {
      beforeEach(function (done) {
        vm.$set('comment', 'hello')
        vm.$set('min', 0)
        vm.$set('max', 8)

        Vue.nextTick(done)
      })

      it('should be expected', function () {
        expect(vm.validation.comment.required).to.be(false)
        expect(vm.validation.comment.minLength).to.be(false)
        expect(vm.validation.comment.maxLength).to.be(false)
        expect(vm.validation.comment.valid).to.be(true)
        expect(vm.validation.comment.invalid).to.be(false)
        expect(vm.validation.comment.dirty).to.be(true)
        expect(vm.valid).to.be(true)
        expect(vm.invalid).to.be(false)
        expect(vm.dirty).to.be(true)
      })

      describe('more change validator argument', function () {
        beforeEach(function (done) {
          vm.$set('comment', 'foo')
          vm.$set('min', 10)
          vm.$set('max', 255)
          
          Vue.nextTick(done)
        })

        it('should be expected', function () {
          expect(vm.validation.comment.required).to.be(false)
          expect(vm.validation.comment.minLength).to.be(true)
          expect(vm.validation.comment.maxLength).to.be(false)
          expect(vm.validation.comment.valid).to.be(false)
          expect(vm.validation.comment.invalid).to.be(true)
          expect(vm.validation.comment.dirty).to.be(true)
          expect(vm.valid).to.be(false)
          expect(vm.invalid).to.be(true)
          expect(vm.dirty).to.be(true)
        })
      })
    })
  })
})
