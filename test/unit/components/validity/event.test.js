import States from '../../../../src/components/validity/states'
import Computed from '../../../../src/components/validity/computed'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'

const { props, data } = States(Vue)
const computed = Computed(Vue)
const { created } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('validity component: event', () => {
  let vm
  beforeEach(done => {
    vm = new Vue({
      props,
      data,
      computed,
      created,
      methods,
      propsData: {
        field: 'field1',
        child: {}, // dummy
        validators: {
          required: true
        }
      }
    })
    done()
  })

  describe('valid / invalid', () => {
    xit('should be fired', done => {
      // TODO:
      done()
    })
  })

  describe('touched', () => {
    it('should be fired', done => {
      const handler = jasmine.createSpy()
      vm.$on('touched', handler)
      // simulate touched updating
      vm.willUpdateTouched()
      waitForUpdate(() => {
        assert(handler.calls.count() === 1)
        // simulate touched updating again
        vm.willUpdateTouched()
      }).then(() => {
        assert(handler.calls.count() === 1)
      }).then(done)
    })
  })

  describe('dirty', () => {
    it('should be fired', done => {
      // setup stub
      spyOn(vm, 'getValue').and.returnValues('', 'value', '')
      const handler = jasmine.createSpy()
      vm.$on('dirty', handler)
      vm._initValue = ''
      // simulate dirty updating
      vm.willUpdateDirty()
      waitForUpdate(() => {
        assert(handler.calls.count() === 0)
        // simulate dirty updating again
        vm.willUpdateDirty()
      }).then(() => {
        assert(handler.calls.count() === 1)
        // simulate dirty updating one more again
        vm.willUpdateDirty()
      }).then(() => {
        assert(handler.calls.count() === 1)
      }).then(done)
    })
  })

  describe('modified', () => {
    it('should be fired', done => {
      // setup stub
      spyOn(vm, 'getValue').and.returnValues('', 'value', '')
      const handler = jasmine.createSpy()
      vm.$on('modified', handler)
      vm._initValue = ''
      // simulate modified updating
      vm.willUpdateModified()
      waitForUpdate(() => {
        assert(handler.calls.count() === 0)
        // simulate modified updating again
        vm.willUpdateModified()
      }).then(() => {
        assert(handler.calls.count() === 1)
        assert(handler.calls.argsFor(0)[0] === true)
        // simulate modified updating one more again
        vm.willUpdateModified()
      }).then(() => {
        assert(handler.calls.count() === 2)
        assert(handler.calls.argsFor(1)[0] === false)
      }).then(done)
    })
  })
})
