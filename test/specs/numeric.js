/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('min', function () {
  var vm, target

  before(function () {
    Vue.config.async = false
    Vue.use(validator)
  })

  after(function () {
    Vue.config.async = true
  })
  

  describe('model', function () {
    beforeEach(function () {
      vm = createInstance(
        '<input type="text" v-model="threshold" v-validate="min: 0">',
        { threshold: null }
      )
      target = vm._children[0]
    })


    describe('boundary value - 1', function () {
      beforeEach(function () {
        vm.threshold = -1
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.threshold.min).to.be(true)
      })
    })


    describe('boundary value', function () {
      beforeEach(function () {
        vm.threshold = 0
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.threshold.min).to.be(false)
      })
    })


    describe('boundary value + 1', function () {
      beforeEach(function () {
        vm.threshold = 1
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.threshold.min).to.be(false)
      })
    })


    describe('not numeric value', function () {
      beforeEach(function () {
        vm.threshold = 'hello'
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.threshold.min).to.be(true)
      })
    })
  })


  describe('expression', function () {
    describe('numeric', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" v-model="threshold" v-validate="min: 50">',
          { threshold: 49 }
        )
        target = vm._children[0]
      })

      it('should be false', function () {
        expect(target.validation.threshold.min).to.be(false)
      })
    })


    describe('not numeric', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" v-model="threshold" v-validate="min: \'hello\'">',
          { threshold: 49 }
        )
        target = vm._children[0]
      })

      it('should be true', function () {
        expect(target.validation.threshold.min).to.be(true)
      })
    })
  })
})



describe('max', function () {
  var vm, target

  before(function () {
    Vue.config.async = false
    Vue.use(validator)
  })

  after(function () {
    Vue.config.async = true
  })
  

  describe('model', function () {
    beforeEach(function () {
      vm = createInstance(
        '<input type="text" v-model="threshold" v-validate="max: 100">',
        { threshold: null }
      )
      target = vm._children[0]
    })


    describe('boundary value - 1', function () {
      beforeEach(function () {
        vm.threshold = 99
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.threshold.max).to.be(false)
      })
    })


    describe('boundary value', function () {
      beforeEach(function () {
        vm.threshold = 100
        vm._digest() // force update
      })

      it('should be false', function () {
        expect(target.validation.threshold.max).to.be(false)
      })
    })


    describe('boundary value + 1', function () {
      beforeEach(function () {
        vm.threshold = 101
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.threshold.max).to.be(true)
      })
    })


    describe('not numeric value', function () {
      beforeEach(function () {
        vm.threshold = 'hello'
        vm._digest() // force update
      })

      it('should be true', function () {
        expect(target.validation.threshold.max).to.be(true)
      })
    })
  })


  describe('expression', function () {
    describe('numeric', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" v-model="threshold" v-validate="max: -2">',
          { threshold: -3 }
        )
        target = vm._children[0]
      })

      it('should be false', function () {
        expect(target.validation.threshold.max).to.be(false)
      })
    })


    describe('not numeric', function () {
      beforeEach(function () {
        vm = createInstance(
          '<input type="text" v-model="threshold" v-validate="max: \'hello\'">',
          { threshold: 100 }
        )
        target = vm._children[0]
      })

      it('should be true', function () {
        expect(target.validation.threshold.max).to.be(true)
      })
    })
  })
})
