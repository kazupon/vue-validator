/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('required', function () {
  var vm, target

  before(function () {
    Vue.config.async = false
    Vue.use(validator)
  })

  after(function () {
    Vue.config.async = true
  })


  describe('model data', function () {
    describe('set no empty', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" v-model="msg" v-validate="required">',
          { msg: null }
        )
        target = vm._children[0]

        vm.msg = 'hello'
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.msg.required).to.be(false)
      })
    })

    describe('set empty', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" v-model="msg" v-validate="required">',
          { msg: 'hello' }
        )
        target = vm._children[0]

        vm.msg = ''
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.msg.required).to.be(true)
      })
    })
  })


  describe('input `value` attribute', function () {
    describe('set no empty', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" value="hello" v-model="msg" v-validate="required">',
          { msg: null }
        )
        target = vm._children[0]
      })

      it('should be false', function () {
        expect(target.validation.msg.required).to.be(false)
      })
    })

    describe('set empty', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" value="" v-model="msg" v-validate="required">',
          { msg: null }
        )
        target = vm._children[0]
      })

      it('should be true', function () {
        expect(target.validation.msg.required).to.be(true)
      })
    })
  })
})
