import States from '../../../../src/components/validity/states'
import Computed from '../../../../src/components/validity/computed'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'

const { props, data } = States(Vue)
const computed = Computed(Vue)
const { created } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('validity component: reset', () => {
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

  it('should be work', done => {
    // setup stub
    spyOn(vm, 'checkModified').and.returnValues(true, true, false, false)
    // simulate some updating
    vm.willUpdateDirty()
    vm.willUpdateModified()
    vm.willUpdateTouched()
    // set invalid validation raw result
    vm.results['required'] = false
    waitForUpdate(() => {
      // simulate progresses setting
      vm.progresses.required = 'running'
    }).then(() => {
      vm.reset()
    }).then(() => {
      const result = vm.result
      assert(result.valid === true)
      assert(result.invalid === false)
      assert(result.touched === false)
      assert(result.untouched === true)
      assert(result.dirty === false)
      assert(result.pristine === true)
      assert(result.modified === false)
      assert(result.required === false)
      assert(result.errors === undefined)
      assert.equal(vm.progresses.required, '')
    }).then(done)
  })

  describe('valid / invalid', () => {
    it('should be fired', done => {
      const validHandler = jasmine.createSpy()
      const invalidHandler = jasmine.createSpy()
      vm.$on('valid', validHandler)
      vm.$on('invalid', invalidHandler)
      waitForUpdate(() => {
        assert(validHandler.calls.count() === 0)
        assert(invalidHandler.calls.count() === 0)
        // simulate invalid
        vm.results['required'] = false
      }).then(() => {
        assert(validHandler.calls.count() === 0)
        assert(invalidHandler.calls.count() === 1)
        // simulate valid
        vm.results['required'] = true
      }).then(() => {
        assert(validHandler.calls.count() === 1)
        assert(invalidHandler.calls.count() === 1)
        // simulate valid and invalid
        vm.results['required'] = false
        vm.results['min'] = 'too short!!'
      }).then(() => {
        assert(validHandler.calls.count() === 1)
        assert(invalidHandler.calls.count() === 2)
        // simulate both valid
        vm.results['required'] = true
        vm.results['min'] = true
      }).then(() => {
        assert(validHandler.calls.count() === 2)
        assert(invalidHandler.calls.count() === 2)
      }).then(done)
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
      spyOn(vm, 'checkModified').and.returnValues(false, true, false)
      const handler = jasmine.createSpy()
      vm.$on('dirty', handler)
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
      spyOn(vm, 'checkModified').and.returnValues(false, true, false)
      const handler = jasmine.createSpy()
      vm.$on('modified', handler)
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
