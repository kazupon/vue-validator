import Validity from '../../src/components/validity/index'
import ValidationClass from '../../src/validation'

const { extend } = Vue.util
const validity = Validity(Vue)
const Validation = ValidationClass(Vue)

describe('validation class', () => {
  let validation, vm
  function createValidity (field) {
    const options = {}
    extend(options, validity)
    options.propsData = {
      field,
      child: {}, // dummy
      validators: {
        required: true
      }
    }
    return new Vue(options)
  }

  beforeEach(() => {
    vm = new Vue()
    validation = new Validation({ host: vm })
  })

  describe('register/unregsiter', () => {
    it('should be work', done => {
      let validation1, group1, group2
      // add validation1 and field1
      validation.register('field1', createValidity('field1'), { named: 'validation1' })
      waitForUpdate(() => {
        assert('validation1' in vm.$validation)
        validation1 = vm.$validation.validation1
        assert('valid' in validation1)
        assert('invalid' in validation1)
        assert('touched' in validation1)
        assert('untouched' in validation1)
        assert('dirty' in validation1)
        assert('pristine' in validation1)
        assert('modified' in validation1)
        assert('field1' in validation1)
        // add field2 only
        validation.register('field2', createValidity('field2'))
      }).then(() => {
        assert('field2' in vm.$validation)
        // add validation2, group1 and field3
        validation.register('field3', createValidity('field3'), { named: 'validation2', group: 'group1' })
      }).then(() => {
        assert('validation2' in vm.$validation)
        assert('group1' in vm.$validation.validation2)
        group1 = vm.$validation.validation2.group1
        assert('valid' in group1)
        assert('invalid' in group1)
        assert('touched' in group1)
        assert('untouched' in group1)
        assert('dirty' in group1)
        assert('pristine' in group1)
        assert('modified' in group1)
        assert('field3' in group1)
        // add group2 and field4
        validation.register('field4', createValidity('field4'), { group: 'group2' })
      }).then(() => {
        assert('group2' in vm.$validation)
        group2 = vm.$validation.group2
        assert('valid' in group2)
        assert('invalid' in group2)
        assert('touched' in group2)
        assert('untouched' in group2)
        assert('dirty' in group2)
        assert('pristine' in group2)
        assert('modified' in group2)
        assert('field4' in group2)
        // remove group2 and field4
        validation.unregister('field4', { group: 'group2' })
      }).then(() => {
        assert(!('group2' in vm.$validation))
        // remove validation2, group1 and field3
        validation.unregister('field3', { named: 'validation2', group: 'group1' })
      }).then(() => {
        assert(!('validation2' in vm.$validation))
        // remove field2 only
        validation.unregister('field2')
      }).then(() => {
        assert(!('field2' in vm.$validation))
        // remove validation1 and field1
        validation.unregister('field1', { named: 'validation1' })
      }).then(() => {
        assert(!('validation1' in vm.$validation))
      }).then(done)
    })
  })

  describe('destroy', () => {
    it('should be work', done => {
      validation.register('field1', createValidity('field1'), { named: 'validation1' })
      validation.register('field2', createValidity('field2'))
      validation.register('field3', createValidity('field3'), { named: 'validation2', group: 'group1' })
      validation.register('field4', createValidity('field4'), { group: 'group2' })
      waitForUpdate(() => {
        validation.destroy()
      }).then(() => {
        assert.equal(JSON.stringify(vm.$validation), JSON.stringify({}))
      }).then(done)
    })
  })
})
