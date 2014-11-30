/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('minLength', function () {
  var vm, targetVM

  before(function () {
    Vue.config.async = false
  })

  after(function () {
    Vue.config.async = true
  })
  
  beforeEach(function () {
    vm = createInstance({
        target: '<input type="text" v-model="comment" v-validate="minLength: 4">',
        validator: validator,
        data: function () { return { comment: null } }
    })
    targetVM = vm._children[0]
  })


  describe('boundary value - 1', function () {
    beforeEach(function () {
      vm.comment = 'aaa'
      vm._digest() // force update
    })

    it('should be true', function () {
      expect(targetVM.validation.comment.minLength).to.be(true)
    })
  })


  describe('boundary value', function () {
    beforeEach(function () {
      vm.comment = 'aaaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(targetVM.validation.comment.minLength).to.be(false)
    })
  })


  describe('boundary value + 1', function () {
    beforeEach(function () {
      vm.comment = 'aaaaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(targetVM.validation.comment.minLength).to.be(false)
    })
  })
})



describe('maxLength', function () {
  var vm, targetVM

  before(function () {
    Vue.config.async = false
  })

  after(function () {
    Vue.config.async = true
  })
  
  beforeEach(function () {
    vm = createInstance({
      target: '<input type="text" v-model="comment" v-validate="maxLength: 4">',
      validator: validator,
      data: function () { return { comment: null } }
    })
    targetVM = vm._children[0]
  })


  describe('boundary value - 1', function () {
    beforeEach(function () {
      vm.comment = 'aaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(targetVM.validation.comment.maxLength).to.be(false)
    })
  })


  describe('boundary value', function () {
    beforeEach(function () {
      vm.comment = 'aaaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(targetVM.validation.comment.maxLength).to.be(false)
    })
  })


  describe('boundary value + 1', function () {
    beforeEach(function () {
      vm.comment = 'aaaaa'
      vm._digest() // force update
    })

    it('should be true', function () {
      expect(targetVM.validation.comment.maxLength).to.be(true)
    })
  })
})
