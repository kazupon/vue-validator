/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('custom', function () {
  var vm, targetVM

  before(function () {
    Vue.config.async = false
  })

  after(function () {
    Vue.config.async = true
  })


  describe('validates', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="address" v-validate="email">',
        component: validator,
        validator: {
          validates: {
            email: function (val) {
              return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
            }
          }
        },
        data: function () { return { address: '' } }
      })
      targetVM = vm._children[0]
    })

    describe('init instance', function () {
      describe('validation.address.email', function () {
        it('should be true', function () {
          expect(targetVM.validation.address.email).to.be(true)
        })
      })

      describe('validation.address.valid', function () {
        it('should be false', function () {
          expect(targetVM.validation.address.valid).to.be(false)
        })
      })

      describe('validation.address.invalid', function () {
        it('should be true', function () {
          expect(targetVM.validation.address.invalid).to.be(true)
        })
      })

      describe('validation.address.dirty', function () {
        it('should be false', function () {
          expect(targetVM.validation.address.dirty).to.be(false)
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


    describe('change address', function () {
      beforeEach(function () {
        vm.address = 'test@domain.com'
        vm._digest() // force update
      })

      describe('validation.address.email', function () {
        it('should be false', function () {
          expect(targetVM.validation.address.email).to.be(false)
        })
      })

      describe('validation.address.valid', function () {
        it('should be true', function () {
          expect(targetVM.validation.address.valid).to.be(true)
        })
      })

      describe('validation.address.invalid', function () {
        it('should be false', function () {
          expect(targetVM.validation.address.invalid).to.be(false)
        })
      })

      describe('validation.address.dirty', function () {
        it('should be true', function () {
          expect(targetVM.validation.address.dirty).to.be(true)
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


  describe('namespace', function () {
    beforeEach(function () {
      vm = createInstance({
        target: '<input type="text" v-model="msg" v-validate1="required">',
        component: validator,
        validator: {
          namespace: {
            validation: 'validation1',
            valid: 'valid1',
            invalid: 'invalid1',
            dirty: 'dirty1',
            directive: 'validate1'
          }
        },
        data: function () { return { msg: '' } }
      })
      targetVM = vm._children[0]
    })

    describe('init instance', function () {
      describe('validation1.msg.required', function () {
        it('should be true', function () {
          expect(targetVM.validation1.msg.required).to.be(true)
        })
      })

      describe('validation1.msg.valid1', function () {
        it('should be false', function () {
          expect(targetVM.validation1.msg.valid1).to.be(false)
        })
      })

      describe('validation1.msg.invalid1', function () {
        it('should be true', function () {
          expect(targetVM.validation1.msg.invalid1).to.be(true)
        })
      })

      describe('validation1.msg.dirty1', function () {
        it('should be false', function () {
          expect(targetVM.validation1.msg.dirty1).to.be(false)
        })
      })

      describe('valid1', function () {
        it('should be false', function () {
          expect(targetVM.valid1).to.be(false)
        })
      })

      describe('invalid1', function () {
        it('should be true', function () {
          expect(targetVM.invalid1).to.be(true)
        })
      })
    })


    describe('change address', function () {
      beforeEach(function () {
        vm.msg = 'hello'
        vm._digest() // force update
      })

      describe('validation1.msg.required', function () {
        it('should be false', function () {
          expect(targetVM.validation1.msg.required).to.be(false)
        })
      })

      describe('validation1.msg.valid1', function () {
        it('should be true', function () {
          expect(targetVM.validation1.msg.valid1).to.be(true)
        })
      })

      describe('validation1.msg.invalid1', function () {
        it('should be false', function () {
          expect(targetVM.validation1.msg.invalid1).to.be(false)
        })
      })

      describe('validation1.msg.dirty1', function () {
        it('should be true', function () {
          expect(targetVM.validation1.msg.dirty1).to.be(true)
        })
      })

      describe('valid1', function () {
        it('should be true', function () {
          expect(targetVM.valid1).to.be(true)
        })
      })

      describe('invalid1', function () {
        it('should be false', function () {
          expect(targetVM.invalid1).to.be(false)
        })
      })
    })
  })
})
