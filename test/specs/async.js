/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('async', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  describe('resolve', function () {
    it('should be validated', function (done) {
      var callCount = 0

      vm = createInstance({
        template: '<input type="text" v-model="username" v-validate="required, exist">',
        validator: {
          validates: {
            exist: function (val) {
              callCount++
              return function (resolve, reject) {
                // emurate async validation logic
                setTimeout(function () {
                  resolve()

                  if (callCount === 2) { next() }
                }, 0)
              }
            }
          }
        },
        data: { username: '' }
      })

      vm.$set('username', 'kazupon')

      function next () {
        expect(vm.validation.username.required).to.be(false)
        expect(vm.validation.username.exist).to.be(false)
        expect(vm.validation.username.valid).to.be(true)
        expect(vm.validation.username.invalid).to.be(false)
        expect(vm.validation.username.dirty).to.be(true)
        expect(vm.valid).to.be(true)
        expect(vm.invalid).to.be(false)
        expect(vm.dirty).to.be(true)
        done()
      }
    })
  })


  describe('reject', function () {
    it('should be validated', function (done) {
      var callCount = 0

      vm = createInstance({
        template: '<input type="text" v-model="username" v-validate="required, exist">',
        validator: {
          validates: {
            exist: function (val) {
              callCount++
              return function (resolve, reject) {
                // emurate async validation logic
                setTimeout(function () {
                  reject()

                  if (callCount === 2) { next() }
                }, 0)
              }
            }
          }
        },
        data: { username: '' }
      })

      vm.$set('username', 'kazupon')

      function next () {
        expect(vm.validation.username.required).to.be(false)
        expect(vm.validation.username.exist).to.be(true)
        expect(vm.validation.username.valid).to.be(false)
        expect(vm.validation.username.invalid).to.be(true)
        expect(vm.validation.username.dirty).to.be(true)
        expect(vm.valid).to.be(false)
        expect(vm.invalid).to.be(true)
        expect(vm.dirty).to.be(true)
        done()
      }
    })
  })
})
