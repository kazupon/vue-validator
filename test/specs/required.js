/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('required', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })


  describe('model data', function () {
    describe('string', function () {
      describe('set no empty', function () {
        beforeEach(function (done) {
          vm = createInstance({
            target: '<input type="text" v-model="msg" v-validate="required">',
            data: { msg: null }
          })
          targetVM = vm._children[0]
          vm.msg = 'hello'

          Vue.nextTick(done)
        })

        it('should be false', function () {
          expect(targetVM.validation.msg.required).to.be(false)
        })
      })

      describe('set empty', function () {
        beforeEach(function (done) {
          vm = createInstance({
            target: '<input type="text" v-model="msg" v-validate="required">',
            data: { msg: 'hello' }
          })
          targetVM = vm._children[0]
          vm.msg = ''

          Vue.nextTick(done)
        })

        it('should be true', function () {
          expect(targetVM.validation.msg.required).to.be(true)
        })
      })
    })

    describe('array', function () {
      describe('set no empty', function () {
        beforeEach(function (done) {
          var input = '<select v-model="multiSelect" v-validate="required", multiple>'
            + '<option>one</option></select>'
          vm = createInstance({
            target: input,
            data: { multiSelect: [] }
          })
          targetVM = vm._children[0]
          vm.multiSelect.push('one')

          Vue.nextTick(done)
        })

        it('should be false', function () {
          expect(targetVM.validation.multiSelect.required).to.be(false)
        })
      })

      describe('set empty', function () {
        beforeEach(function (done) {
          var input = '<select v-model="multiSelect" v-validate="required", multiple>'
            + '<option>one</option></select>'
          vm = createInstance({
            target: input,
            data: { multiSelect: ['onw'] }
          })
          targetVM = vm._children[0]
          vm.multiSelect.pop()

          Vue.nextTick(done)
        })

        it('should be true', function () {
          expect(targetVM.validation.multiSelect.required).to.be(true)
        })
      })
    })
  })


  describe('input `value` attribute', function () {
    describe('set no empty', function () {
      beforeEach(function (done) {
        vm = createInstance({
          target: '<input type="text" value="hello" v-model="msg" v-validate="required">',
          data: { msg: null }
        })
        targetVM = vm._children[0]

        Vue.nextTick(done)
      })

      it('should be false', function () {
        expect(targetVM.validation.msg.required).to.be(false)
      })
    })

    describe('set empty', function () {
      beforeEach(function (done) {
        vm = createInstance({
          target: '<input type="text" value="" v-model="msg" v-validate="required">',
          data: { msg: 'hello' }
        })
        targetVM = vm._children[0]

        Vue.nextTick(done)
      })

      it('should be true', function () {
        expect(targetVM.validation.msg.required).to.be(true)
      })
    })
  })
})
