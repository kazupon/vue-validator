/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('model keypath', function () {
  var vm, targetVM, options

  before(function () {
    Vue.use(plugin)

    var inputs = '<input type="text" v-model="user.name.first" v-validate="required, minLength: 4, maxLength: 16">'
      + '<input type="text" v-model="user.name.last" v-validate="required, minLength: 4, maxLength: 16">'
      + '<input type="text" v-model="user.address" v-validate="email">'
      + '<input type="text" v-model="zip" v-validate="required, pattern: \'/^[0-9]{3}-[0-9]{4}$/\'"'
    options = {
      target: inputs,
      validator: {
        validates: {
          email: function (val) {
            return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
          }
        }
      },
      data: {
        user: {
          name: {
            first: '',
            last: ''
          },
          address: '',
        },
        zip: ''
      }
    }
    vm = createInstance(options)
    targetVM = vm._children[0]
  })


  describe('init instance', function () {
    beforeEach(function (done) {
      Vue.nextTick(function () { done() })
    })
    
    describe('user.name.first', function () {
      it('should be validate', function () {
        expect(targetVM.validation.user.name.first.required).to.be(true)
        expect(targetVM.validation.user.name.first.minLength).to.be(true)
        expect(targetVM.validation.user.name.first.maxLength).to.be(false)
        expect(targetVM.validation.user.name.first.invalid).to.be(true)
        expect(targetVM.validation.user.name.first.valid).to.be(false)
        expect(targetVM.validation.user.name.first.dirty).to.be(false)
      })
    })

    describe('user.name.last', function () {
      it('should be validate', function () {
        expect(targetVM.validation.user.name.last.required).to.be(true)
        expect(targetVM.validation.user.name.last.minLength).to.be(true)
        expect(targetVM.validation.user.name.last.maxLength).to.be(false)
        expect(targetVM.validation.user.name.last.invalid).to.be(true)
        expect(targetVM.validation.user.name.last.valid).to.be(false)
        expect(targetVM.validation.user.name.last.dirty).to.be(false)
      })
    })

    describe('user.address', function () {
      it('should be validate', function () {
        expect(targetVM.validation.user.address.email).to.be(true)
        expect(targetVM.validation.user.address.invalid).to.be(true)
        expect(targetVM.validation.user.address.valid).to.be(false)
        expect(targetVM.validation.user.address.dirty).to.be(false)
      })
    })

    describe('zip', function () {
      it('should be validate', function () {
        expect(targetVM.validation.zip.required).to.be(true)
        expect(targetVM.validation.zip.pattern).to.be(true)
        expect(targetVM.validation.zip.invalid).to.be(true)
        expect(targetVM.validation.zip.valid).to.be(false)
        expect(targetVM.validation.zip.dirty).to.be(false)
      })
    })

    describe('valid', function () {
      it('should be false', function () {
        expect(targetVM.valid).to.be(false)
      })
    })

    describe('invalid', function () {
      it('should be true', function () {
        expect(targetVM.invalid).to.be(true)
      })
    })
  })


  describe('set validation pass value', function () {
    beforeEach(function (done) {
      vm.user.name.first = 'firstname'
      vm.user.name.last = 'lastname'
      vm.user.address = 'test@domain.com'
      vm.zip = '111-2222'

      Vue.nextTick(function () { done() })
    })

    describe('user.name.first', function () {
      it('should be validate', function () {
        expect(targetVM.validation.user.name.first.required).to.be(false)
        expect(targetVM.validation.user.name.first.minLength).to.be(false)
        expect(targetVM.validation.user.name.first.maxLength).to.be(false)
        expect(targetVM.validation.user.name.first.invalid).to.be(false)
        expect(targetVM.validation.user.name.first.valid).to.be(true)
        expect(targetVM.validation.user.name.first.dirty).to.be(true)
      })
    })

    describe('user.name.last', function () {
      it('should be validate', function () {
        expect(targetVM.validation.user.name.last.required).to.be(false)
        expect(targetVM.validation.user.name.last.minLength).to.be(false)
        expect(targetVM.validation.user.name.last.maxLength).to.be(false)
        expect(targetVM.validation.user.name.last.invalid).to.be(false)
        expect(targetVM.validation.user.name.last.valid).to.be(true)
        expect(targetVM.validation.user.name.last.dirty).to.be(true)
      })
    })

    describe('user.address', function () {
      it('should be validate', function () {
        expect(targetVM.validation.user.address.email).to.be(false)
        expect(targetVM.validation.user.address.invalid).to.be(false)
        expect(targetVM.validation.user.address.valid).to.be(true)
        expect(targetVM.validation.user.address.dirty).to.be(true)
      })
    })

    describe('zip', function () {
      it('should be validate', function () {
        expect(targetVM.validation.zip.required).to.be(false)
        expect(targetVM.validation.zip.pattern).to.be(false)
        expect(targetVM.validation.zip.invalid).to.be(false)
        expect(targetVM.validation.zip.valid).to.be(true)
        expect(targetVM.validation.zip.dirty).to.be(true)
      })
    })

    describe('valid', function () {
      it('should be true', function () {
        expect(targetVM.valid).to.be(true)
      })
    })

    describe('invalid', function () {
      it('should be false', function () {
        expect(targetVM.invalid).to.be(false)
      })
    })
  })
})
