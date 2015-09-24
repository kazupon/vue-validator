/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance

var emailValidate = function (val) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
}


describe('custom', function () {
  var vm, targetVM

  before(function () {
    Vue.use(plugin)
  })


  describe('validates', function () {
    describe('basic', function () {
      beforeEach(function (done) {
        vm = createInstance({
          target: '<input type="text" v-model="address" v-validate="email">',
          validator: { validates: { email: emailValidate } },
          data: { address: '' }
        })
        targetVM = vm.$children[0]
        
        Vue.nextTick(done)
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
        beforeEach(function (done) {
          vm.address = 'test@domain.com'

          Vue.nextTick(done)
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

    describe('component', function () {
      beforeEach(function (done) {
        var Item = {
          template: '<input type="text" v-model="address" v-validate="required, email">',
          replace: true,
          inherit: true,
          data: function () { return { address: '' } }
        }
        vm = createInstance({
          target: '<item></item>',
          validator: { validates: { email: emailValidate } },
          components: { item: Item }
        })
        targetVM = vm.$children[0]
        
        Vue.nextTick(done)
      })

      it('should be validated', function (done) {
        expect(targetVM.validation.address.email).to.be(true)
        expect(targetVM.validation.address.required).to.be(true)
        expect(targetVM.valid).to.be(false)
        expect(targetVM.invalid).to.be(true)

        targetVM.address = 'test@domain.com'
        Vue.nextTick(function () {
          expect(targetVM.validation.address.email).to.be(false)
          expect(targetVM.validation.address.required).to.be(false)
          expect(targetVM.valid).to.be(true)
          expect(targetVM.invalid).to.be(false)
          done()
        })
      })
    })

    describe('v-repeat', function () {
      beforeEach(function (done) {
        var Person = {
          template: '<li>'
            + '<input type="text" v-model="name" v-validate="required, custom">'
            + '<span class="error" v-if="validation.name.custom">'
            + 'Name should be test'
            + '</span>'
            + '<span class="error" v-if="validation.name.required">'
            + 'This field is required'
            + '</span>'
            + '</li>',
          props: {
            name: { default: '' }
          }
        }
        vm = createInstance({
          target: '<input type="text" v-validate="custom" v-model="groupname">'
            + '<span class="error" v-if="validation.groupname.custom">'
            + 'Group name should be longer than 3 letters'
            + '</span>'
            + '<ul v-repeat="person in persons">'
            + '<person name="{{person.name}}"></person>'
            + '</ul>',
          validator: {
            validates: {
              custom: function (val) {
                return val.length > 3
              }
            }
          },
          components: { person: Person },
          data: {
            groupname: '',
            persons: [ { name: '' }, { name: '' } ]
          }
        })
        
        Vue.nextTick(done)
      })

      it('should be validated', function (done) {
        var person1 = vm.$children[1].$children[0]
        var person2 = vm.$children[2].$children[0]
        expect(vm.validation.groupname.custom).to.be(true)
        expect(person1.validation.name.required).to.be(true)
        expect(person1.validation.name.custom).to.be(true)
        expect(person2.validation.name.required).to.be(true)
        expect(person2.validation.name.custom).to.be(true)

        vm.groupname = 'hello'
        person1.name = 'kazupon'
        person2.name = 'ka'
        Vue.nextTick(function () {
          expect(vm.validation.groupname.custom).to.be(false)
          expect(person1.validation.name.required).to.be(false)
          expect(person1.validation.name.custom).to.be(false)
          expect(person2.validation.name.required).to.be(false)
          expect(person2.validation.name.custom).to.be(true)
          done()
        })
      })
    })
  })


  describe('namespace', function () {
    beforeEach(function (done) {
      vm = createInstance({
        target: '<input type="text" v-model="msg" v-validate="required">',
        validator: {
          namespace: {
            validation: 'validation1',
            valid: 'valid1',
            invalid: 'invalid1',
            dirty: 'dirty1'
          }
        },
        data: { msg: '' }
      })
      targetVM = vm.$children[0]

      Vue.nextTick(done)
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
      beforeEach(function (done) {
        vm.msg = 'hello'

        Vue.nextTick(done)
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
