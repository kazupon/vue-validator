/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var _ = require('../../lib/util')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('directive', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  describe('basic', function () {
    beforeEach(function (done) {
      vm = createInstance({
        template: '<input type="text" v-model="msg" v-validate="required">',
        data: { msg: '' }
      })

      Vue.nextTick(done)
    })

    it('should be validated', function () {
      expect(vm.validation.msg.required).to.be(true)
      expect(vm.validation.msg.valid).to.be(false)
      expect(vm.validation.msg.invalid).to.be(true)
      expect(vm.validation.msg.dirty).to.be(false)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(false)
    })
  })


  describe('specify empty', function () {
    var spy
    beforeEach(function (done) {
      spy = sinon.spy(_, 'warn')

      var template = '<div v-if="enabled">'
        + '<input type="text" v-model="foo" v-validate="">'
        + '<input type="text" v-model="bar" v-validate="min: 0, max:5">'
        + '</div>'
      vm = createInstance({
        template: template,
        data: { foo: 'hello', bar: 1, enabled: true }
      })

      Vue.nextTick(done)
    })

    afterEach(function () {
      _.warn.restore()
    })

    describe('warn', function () {
      it('should be called', function () {
        expect(spy.called).to.be(true)
      })
    })

    describe('foo', function () {
      it('should be ignored', function () {
        expect(vm.validation.foo).to.be(undefined)
      })
    })

    describe('bar', function () {
      it('should be validated', function () {
        expect(vm.validation.bar.min).to.be(false)
        expect(vm.validation.bar.max).to.be(false)
        expect(vm.validation.bar.valid).to.be(true)
        expect(vm.validation.bar.invalid).to.be(false)
        expect(vm.validation.bar.dirty).to.be(false)
        expect(vm.valid).to.be(true)
        expect(vm.invalid).to.be(false)
        expect(vm.dirty).to.be(false)
      })
    })
  })
})
