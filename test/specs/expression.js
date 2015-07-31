/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('expression', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  describe('function', function () {
    beforeEach(function (done) {
      vm = createInstance({
        template: '<input type="text" v-model="comment" v-validate="required, minLength: 1, custom: conditional(\'foo\')">',
        validator: {
          validates: {
            custom: function (val, fn) {
              return fn(val)
            }
          }
        },
        data: { comment: '', maxLength: 4 },
        methods: {
          conditional: function (field) {
            var self = this
            return function (val) {
              if (field === 'foo') {
                return val.length <= self.maxLength
              } else {
                return false
              }
            }
          }
        }
      })

      vm.$set('comment', 'hello')
      Vue.nextTick(done)
    })

    it('should be validated', function () {
      expect(vm.validation.comment.required).to.be(false)
      expect(vm.validation.comment.minLength).to.be(false)
      expect(vm.validation.comment.custom).to.be(true)
      expect(vm.validation.comment.valid).to.be(false)
      expect(vm.validation.comment.invalid).to.be(true)
      expect(vm.validation.comment.dirty).to.be(true)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(true)
    })
  })


  describe('computed property', function () {
    beforeEach(function (done) {
      vm = createInstance({
        template: '<input type="text" v-model="age" number v-validate="required, min: 1, max: computedMax">',
        computed: {
          computedMax: function () {
            return this.n * 5
          }
        },
        data: { age: 0, n: 3 }
      })

      vm.$set('age', 16)
      Vue.nextTick(done)
    })

    it('should be validated', function () {
      expect(vm.validation.age.required).to.be(false)
      expect(vm.validation.age.min).to.be(false)
      expect(vm.validation.age.max).to.be(true)
      expect(vm.validation.age.valid).to.be(false)
      expect(vm.validation.age.invalid).to.be(true)
      expect(vm.validation.age.dirty).to.be(true)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(true)
    })

    describe('change property', function () {
      beforeEach(function (done) {
        vm.$set('n', 5)
        Vue.nextTick(done)
      })

      it('should be validated', function () {
        expect(vm.validation.age.required).to.be(false)
        expect(vm.validation.age.min).to.be(false)
        expect(vm.validation.age.max).to.be(false)
        expect(vm.validation.age.valid).to.be(true)
        expect(vm.validation.age.invalid).to.be(false)
        expect(vm.validation.age.dirty).to.be(true)
        expect(vm.valid).to.be(true)
        expect(vm.invalid).to.be(false)
        expect(vm.dirty).to.be(true)
      })
    })
  })


  describe('inline', function () {
    beforeEach(function (done) {
      vm = createInstance({
        template: '<input type="text" v-model="comment" v-validate="required, custom: comment === \'hello\'">',
        validator: {
          validates: {
            custom: function (val, condition) {
              return condition
            }
          }
        },
        data: { comment: '' }
      })

      vm.$set('comment', 'foo')
      Vue.nextTick(done)
    })

    it('should be validated', function () {
      expect(vm.validation.comment.required).to.be(false)
      expect(vm.validation.comment.custom).to.be(true)
      expect(vm.validation.comment.valid).to.be(false)
      expect(vm.validation.comment.invalid).to.be(true)
      expect(vm.validation.comment.dirty).to.be(true)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(true)
    })

    describe('change property', function () {
      beforeEach(function (done) {
        vm.$set('comment', 'hello')
        Vue.nextTick(done)
      })

      it('should be validated', function () {
        expect(vm.validation.comment.required).to.be(false)
        expect(vm.validation.comment.custom).to.be(false)
        expect(vm.validation.comment.valid).to.be(true)
        expect(vm.validation.comment.invalid).to.be(false)
        expect(vm.validation.comment.dirty).to.be(true)
        expect(vm.valid).to.be(true)
        expect(vm.invalid).to.be(false)
        expect(vm.dirty).to.be(true)
      })
    })
  })
})
