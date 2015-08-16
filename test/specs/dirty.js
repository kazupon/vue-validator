/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('dirty', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  describe('basic usage', function () {
    beforeEach(function (done) {
      var inputs = '<input type="text" v-model="username" v-validate="required, minLength: 4, maxLength: 16">'
        + '<input type="text" v-model="zip" v-validate="required, pattern: \'/^[0-9]{3}-[0-9]{4}$/\'"'
      vm = createInstance({
         template: inputs,
         data: { username: '', zip: '' }
      })

      Vue.nextTick(done)
    })

    
    describe('init instance', function () {
      describe('validation.username.dirty', function () {
        it('should be false', function () {
          expect(vm.validation.username.dirty).to.be(false)
        })
      })

      describe('validation.zip.dirty', function () {
        it('should be false', function () {
          expect(vm.validation.zip.dirty).to.be(false)
        })
      })

      describe('dirty', function () {
        it('should be false', function () {
          expect(vm.dirty).to.be(false)
        })
      })
    })


    describe('edit username, and zip', function () {
      beforeEach(function (done) {
        vm.username = 'kazupon'
        vm.zip = '111-2222'

        Vue.nextTick(done)
      })

      describe('validation.username.dirty', function () {
        it('should be true', function () {
          expect(vm.validation.username.dirty).to.be(true)
        })
      })

      describe('validation.zip.dirty', function () {
        it('should be true', function () {
          expect(vm.validation.zip.dirty).to.be(true)
        })
      })

      describe('dirty', function () {
        it('should be true', function () {
          expect(vm.dirty).to.be(true)
        })
      })

      describe('reset username', function () {
        beforeEach(function (done) {
          vm.username = ''

          Vue.nextTick(done)
        })

        describe('validation.username.dirty', function () {
          it('should be false', function () {
            expect(vm.validation.username.dirty).to.be(false)
          })
        })

        describe('validation.zip.dirty', function () {
          it('should be true', function () {
            expect(vm.validation.zip.dirty).to.be(true)
          })
        })

        describe('dirty', function () {
          it('should be true', function () {
            expect(vm.dirty).to.be(true)
          })
        })
      })
    })
  })


  describe('input[type="text"]', function () {
    describe('number option', function () {
      beforeEach(function () {
        var template = '<input type="text" value="10" number v-model="model1" v-validate="min: 0">'
          + '<input type="text" value="5" number v-model="model2" v-validate="max: 10">'
        vm = createInstance({
          template: template,
          data: { model1: null, model2: '2' }
        })
      })
      
      describe('initialized', function () {
        it('should not be dirty', function () {
          expect(vm.validation.model1.dirty).to.be(false)
          expect(vm.validation.model2.dirty).to.be(false)
          expect(vm.dirty).to.be(false)
        })
      })

      describe('changed', function () {
        beforeEach(function (done) {
          vm.$set('model1', 1)
          vm.$set('model2', 9)
          Vue.nextTick(done)
        })

        it('should be dirty', function () {
          expect(vm.validation.model1.dirty).to.be(true)
          expect(vm.validation.model2.dirty).to.be(true)
          expect(vm.dirty).to.be(true)
        })

        describe('reset', function () {
          beforeEach(function (done) {
            vm.$set('model1', 10)
            vm.$set('model2', 5)
            Vue.nextTick(done)
          })

          it('should not be dirty', function () {
            expect(vm.validation.model1.dirty).to.be(false)
            expect(vm.validation.model2.dirty).to.be(false)
            expect(vm.dirty).to.be(false)
          })
        })
      })
    })

    describe('not specify value attribute', function () {
      beforeEach(function () {
        var template = '<input type="text" v-model="model1" v-validate="minLength: 1">'
          + '<input type="text" v-model="model2" v-validate="maxLength: 5">'
        vm = createInstance({
          template: template,
          data: { model1: '', model2: 'hi' }
        })
      })
      
      describe('initialized', function () {
        it('should not be dirty', function () {
          expect(vm.validation.model1.dirty).to.be(false)
          expect(vm.validation.model2.dirty).to.be(false)
          expect(vm.dirty).to.be(false)
        })
      })

      describe('changed', function () {
        beforeEach(function (done) {
          vm.$set('model1', 'hello')
          vm.$set('model2', 'world')
          Vue.nextTick(done)
        })

        it('should be dirty', function () {
          expect(vm.validation.model1.dirty).to.be(true)
          expect(vm.validation.model2.dirty).to.be(true)
          expect(vm.dirty).to.be(true)
        })

        describe('reset', function () {
          beforeEach(function (done) {
            vm.$set('model1', '')
            vm.$set('model2', 'hi')
            Vue.nextTick(done)
          })

          it('should not be dirty', function () {
            expect(vm.validation.model1.dirty).to.be(false)
            expect(vm.validation.model2.dirty).to.be(false)
            expect(vm.dirty).to.be(false)
          })
        })
      })
    })
  })


  describe('input[type="radio"]', function () {
    describe('number option', function () {
      beforeEach(function () {
        var template = '<input type="radio" value="1" number v-model="gender" v-validate="required">'
          + '<input type="radio" value="2" number v-model="gender" v-validate="required">'
        vm = createInstance({
          template: template,
          data: { gender: 1 }
        })
      })

      describe('initialized', function () {
        it('should not be dirty', function () {
          expect(vm.validation.gender.dirty).to.be(false)
          expect(vm.dirty).to.be(false)
        })
      })

      describe('changed', function () {
        beforeEach(function (done) {
          vm.$el.childNodes[1].click()
          Vue.nextTick(done)
        })

        it('should be dirty', function () {
          expect(vm.validation.gender.dirty).to.be(true)
          expect(vm.dirty).to.be(true)
        })

        describe('reset', function () {
          beforeEach(function (done) {
            vm.$el.childNodes[0].click()
            Vue.nextTick(done)
          })

          it('should not be dirty', function () {
            expect(vm.validation.gender.dirty).to.be(false)
            expect(vm.dirty).to.be(false)
          })
        })
      })
    })

    describe('not specify value attribute', function () {
      beforeEach(function () {
        var template = '<input type="radio" value="1" v-model="gender" v-validate="required">'
          + '<input type="radio" value="2" v-model="gender" v-validate="required">'
        vm = createInstance({
          template: template,
          data: { gender: '1' }
        })
      })

      describe('initialized', function () {
        it('should not be dirty', function () {
          expect(vm.validation.gender.dirty).to.be(false)
          expect(vm.dirty).to.be(false)
        })
      })

      describe('changed', function () {
        beforeEach(function (done) {
          vm.$el.childNodes[1].click()
          Vue.nextTick(done)
        })

        it('should be dirty', function () {
          expect(vm.validation.gender.dirty).to.be(true)
          expect(vm.dirty).to.be(true)
        })

        describe('reset', function () {
          beforeEach(function (done) {
            vm.$el.childNodes[0].click()
            Vue.nextTick(done)
          })

          it('should not be dirty', function () {
            expect(vm.validation.gender.dirty).to.be(false)
            expect(vm.dirty).to.be(false)
          })
        })
      })
    })
  })
})
