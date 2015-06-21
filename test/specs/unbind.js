/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('directive unbind', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)

    vm = createInstance({
      target: '<input type="text" v-model="msg" v-validate="required">',
       data: { msg: '' }
    })
  })


  describe('$destroy', function () {
    beforeEach(function (done) {
      vm.$destroy()

      Vue.nextTick(function () {
        done()
      })
    })

    describe('validator instance', function () {
      it('should not be exist', function () {
        expect(vm).not.to.have.key('$validator')
      })
    })
  })
})
