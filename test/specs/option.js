/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('option', function () {
  var vm, targetVM


  describe('component', function () {
    describe('no specify', function () {
      beforeEach(function (done) {
        Vue.use(plugin)

        vm = createInstance({
          target: '<input type="text" v-model="msg" v-validate="required">',
          data: { msg: '' }
        })

        Vue.nextTick(done)
      })

      it('should be assigned $validator', function () {
        expect(vm).to.have.key('$validator')
      })
    })

    describe('specify name', function () {
      beforeEach(function (done) {
        Vue.use(plugin, { component: '$validator1' })

        vm = createInstance({
          target: '<input type="text" v-model="msg" v-validate="required">',
          data: { msg: '' }
        })

        Vue.nextTick(done)
      })

      it('should be assigned $validator1', function () {
        expect(vm).to.have.key('$validator1')
      })
    })
  })


  describe('directive', function () {
    describe('no specify', function () {
      beforeEach(function (done) {
        Vue.use(plugin)

        vm = createInstance({
          target: '<input type="text" v-model="msg" v-validate="required">',
          data: { msg: '' }
        })
        targetVM = vm._children[0]
        vm.msg = 'hello'

        Vue.nextTick(done)
      })

      it('should be run "v-validate"', function () {
        expect(targetVM.validation.msg.required).to.be(false)
      })
    })

    describe('specify name', function () {
      beforeEach(function (done) {
        Vue.use(plugin, { directive: 'validate1' })

        vm = createInstance({
          target: '<input type="text" v-model="msg" v-validate1="required">',
          data: { msg: '' }
        })
        targetVM = vm._children[0]
        vm.msg = 'hello'

        Vue.nextTick(done)
      })

      it('should be run "v-validate1"', function () {
        expect(targetVM.validation.msg.required).to.be(false)
      })
    })
  })
})
