import assert from 'power-assert'
import override from '../../src/override'


describe('override', () => {
  let Vue

  beforeEach(() => {
    Vue = function Vue () {}
    Vue.prototype._init = (options) => {}
    Vue.prototype._destroy = () => {}
  })


  describe('_init', () => {
    it('should be called', () => {
      let options = { a: 1 }
      let spy = sinon.spy(Vue.prototype, '_init')
      spy.withArgs(options)

      override(Vue)
      let vm = new Vue()
      vm._init(options)

      assert(vm._validatorMaps !== undefined)
      assert(spy.withArgs(options).calledOnce)
    })
  })

  describe('_destroy', () => {
    it('should be called', () => {
      let spy = sinon.spy(Vue.prototype, '_destroy')
      spy.withArgs(false, false)

      override(Vue)
      let vm = new Vue()
      vm._destroy(false, false)

      assert(vm._validatorMaps === null)
      assert(spy.withArgs(false, false).calledOnce)
    })
  })
})
