/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('wait-for', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  describe('basic model', function () {
    var delay = 100
    var loadData = function (params, fn) {
      setTimeout(function () {
        fn(null, {
          foo: 'hello',
          bar: 'kazupon'
        }, delay)
      })
    }
    var hook = function () {
      var self = this
      var params = {}
      loadData(params, function (err, data) {
        if (err) { return }
        self.$emit('fooLoaded', data.foo)
        self.$emit('barLoaded', data.bar)
      })
    }
    var macro = function (hookPoint, hookBody) {
      beforeEach(function (done) {
        var template = '<input type="text" v-model="foo" wait-for="fooLoaded" v-validate="required">'
          + '<input type="text" v-model="bar" wait-for="barLoaded" v-validate="required, maxLength: 5">'
        var options = {
          template: template,
          data: { foo: '', bar: '' }
        }
        options[hookPoint] = hookBody

        vm = createInstance(options)
        setTimeout(done, delay + 10)
      })

      it('should be validated', function (done) {
        expect(vm.validation.foo.required).to.be(false)
        expect(vm.validation.foo.valid).to.be(true)
        expect(vm.validation.foo.invalid).to.be(false)
        expect(vm.validation.foo.dirty).to.be(false)
        expect(vm.validation.bar.required).to.be(false)
        expect(vm.validation.bar.maxLength).to.be(true)
        expect(vm.validation.bar.valid).to.be(false)
        expect(vm.validation.bar.invalid).to.be(true)
        expect(vm.validation.bar.dirty).to.be(false)
        expect(vm.valid).to.be(false)
        expect(vm.invalid).to.be(true)
        expect(vm.dirty).to.be(false)

        // change model value
        vm.$set('foo', 'world')
        vm.$set('bar', 'hello')

        Vue.nextTick(function () {
          expect(vm.validation.foo.required).to.be(false)
          expect(vm.validation.foo.valid).to.be(true)
          expect(vm.validation.foo.invalid).to.be(false)
          expect(vm.validation.foo.dirty).to.be(true)
          expect(vm.validation.bar.required).to.be(false)
          expect(vm.validation.bar.maxLength).to.be(false)
          expect(vm.validation.bar.valid).to.be(true)
          expect(vm.validation.bar.invalid).to.be(false)
          expect(vm.validation.bar.dirty).to.be(true)
          expect(vm.valid).to.be(true)
          expect(vm.invalid).to.be(false)
          expect(vm.dirty).to.be(true)
          done()
        })
      })
    }

    macro('created', hook)
    macro('compiled', hook)
    macro('ready', hook)
  })


  describe('objectable model', function () {
    beforeEach(function (done) {
      var delay = 100
      var loadData = function (params, fn) {
        setTimeout(function () {
          fn(null, {
            item: {
              foo: 'hello',
              bar: 'kazupon'
            }
          }, delay)
        })
      }
      var template = '<input type="text" v-model="item.foo" wait-for="fooLoaded" v-validate="required">'
        + '<input type="text" v-model="item.bar" wait-for="barLoaded" v-validate="required, maxLength: 5">'

      vm = createInstance({
        template: template,
        data: { item: { foo: '', bar: '' } },
        ready: function () {
          var self = this
          var params = {}
          loadData(params, function (err, data) {
            if (err) { return }
            self.$emit('fooLoaded', data.item.foo)
            self.$emit('barLoaded', data.item.bar)
          })
        }
      })

      setTimeout(done, delay + 10)
    })

    it('should be validated', function (done) {
      expect(vm.validation.item.foo.required).to.be(false)
      expect(vm.validation.item.foo.valid).to.be(true)
      expect(vm.validation.item.foo.invalid).to.be(false)
      expect(vm.validation.item.foo.dirty).to.be(false)
      expect(vm.validation.item.bar.required).to.be(false)
      expect(vm.validation.item.bar.maxLength).to.be(true)
      expect(vm.validation.item.bar.valid).to.be(false)
      expect(vm.validation.item.bar.invalid).to.be(true)
      expect(vm.validation.item.bar.dirty).to.be(false)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(false)

      // change model value
      vm.$set('item.foo', 'world')
      vm.$set('item.bar', 'hello')

      Vue.nextTick(function () {
        expect(vm.validation.item.foo.required).to.be(false)
        expect(vm.validation.item.foo.valid).to.be(true)
        expect(vm.validation.item.foo.invalid).to.be(false)
        expect(vm.validation.item.foo.dirty).to.be(true)
        expect(vm.validation.item.bar.required).to.be(false)
        expect(vm.validation.item.bar.maxLength).to.be(false)
        expect(vm.validation.item.bar.valid).to.be(true)
        expect(vm.validation.item.bar.invalid).to.be(false)
        expect(vm.validation.item.bar.dirty).to.be(true)
        expect(vm.valid).to.be(true)
        expect(vm.invalid).to.be(false)
        expect(vm.dirty).to.be(true)
        done()
      })
    })
  })
})
