import States from '../../../../src/components/validity/states'
import Computed from '../../../../src/components/validity/computed'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'

const { props, data } = States(Vue)
const computed = Computed(Vue)
const { created } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('validity component: progresses', () => {
  const baseOptions = {
    props,
    data,
    computed,
    created,
    methods
  }

  describe('built-in validator', () => {
    it('should be work', done => {
      baseOptions.propsData = {
        field: 'field1',
        child: {}, // dummy
        validators: {
          required: true
        }
      }
      const vm = new Vue(baseOptions)
      const progresses = []
      const unwatch = vm.$watch('progresses', (val) => {
        progresses.push(val.required)
      }, { deep: true })
      // initial
      assert.equal(vm.progresses.required, '')
      vm.validate('required', '', () => {
        assert.equal(progresses.shift(), 'running')
        assert.equal(progresses.shift(), '')
        unwatch()
        done()
      })
    })
  })

  describe('custom validator', () => {
    it('should be work', done => {
      baseOptions.propsData = {
        field: 'field1',
        child: {}, // dummy
        validators: {
          custom1: true
        }
      }
      baseOptions.validators = {
        custom1: {
          check (val) {
            return true
          }
        }
      }
      const vm = new Vue(baseOptions)
      const progresses = []
      const unwatch = vm.$watch('progresses', (val) => {
        progresses.push(val.custom1)
      }, { deep: true })
      // initial
      assert.equal(vm.progresses.custom1, '')
      vm.validate('custom1', '', () => {
        assert.equal(progresses.shift(), 'running')
        assert.equal(progresses.shift(), '')
        unwatch()
        done()
      })
    })
  })

  describe('async validator', () => {
    it('should be work', done => {
      baseOptions.propsData = {
        field: 'field1',
        child: {}, // dummy
        validators: ['exist']
      }
      baseOptions.validators = {
        exist (val) {
          return (resolve, reject) => {
            setTimeout(() => { resolve() }, 5)
          }
        }
      }
      const vm = new Vue(baseOptions)
      const progresses = []
      const unwatch = vm.$watch('progresses', (val) => {
        progresses.push(val.exist)
      }, { deep: true })
      // initial
      assert.equal(vm.progresses.exist, '')
      vm.validate('exist', 'foo', () => {
        assert.equal(progresses.shift(), 'running')
        assert.equal(progresses.shift(), '')
        unwatch()
        done()
      })
    })
  })

  describe('async validator', () => {
    it('should be work', done => {
      baseOptions.propsData = {
        field: 'field1',
        child: {}, // dummy
        validators: ['exist']
      }
      baseOptions.validators = {
        exist (val) {
          return (resolve, reject) => {
            setTimeout(() => { resolve() }, 5)
          }
        }
      }
      const vm = new Vue(baseOptions)
      const progresses = []
      const unwatch = vm.$watch('progresses', (val) => {
        progresses.push(val.exist)
      }, { deep: true })
      // initial
      assert.equal(vm.progresses.exist, '')
      vm.validate('exist', 'foo', () => {
        assert.equal(progresses.shift(), 'running')
        assert.equal(progresses.shift(), '')
        unwatch()
        done()
      })
    })
  })
})
