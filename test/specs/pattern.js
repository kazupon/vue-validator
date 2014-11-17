/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var wrapTemplate = require('./helper').wrapTemplate
var nextTick = Vue.util.nextTick


describe('pattern', function () {
  var vm, target
  
  function createInstance (inject, data) {
    var Validator = Vue.extend({
      template: wrapTemplate(inject),
      el: function () {
        var el = document.createElement('div')
        document.body.appendChild(el)
        return el
      },
      data: data
    })
    return new Validator()
  }

  before(function () {
    Vue.config.async = false
    Vue.use(validator)
  })

  after(function () {
    Vue.config.async = true
  })


  describe('regex basic', function () {
    beforeEach(function () {
      vm = createInstance(
        '<input type="text" v-model="msg" v-validate="pattern: /^[0-9a-zA-Z]+$/">',
        { msg: '111' }
      )
      target = vm._children[0]
    })

    describe('valid', function () {
      beforeEach(function () {
        vm.msg = 'foo11'
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.msg.pattern).to.be(false)
      })
    })

    describe('invalid', function () {
      beforeEach(function () {
        vm.msg = ''
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.msg.pattern).to.be(true)
      })
    })
  })


  describe('regex flag', function () {
    beforeEach(function () {
      vm = createInstance(
        '<input type="text" v-model="msg" v-validate="pattern: /hello/i">',
        { msg: null }
      )
      target = vm._children[0]
    })

    describe('valid', function () {
      beforeEach(function () {
        vm.msg = 'HELLO'
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.msg.pattern).to.be(false)
      })
    })

    describe('invalid', function () {
      beforeEach(function () {
        vm.msg = ''
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.msg.pattern).to.be(true)
      })
    })
  })
})
