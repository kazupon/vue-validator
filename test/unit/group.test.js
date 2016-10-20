import ValidityControl from '../../src/components/validity/index'
import Validity from '../../src/components/validity.js'
import ValidityGroup from '../../src/group'

const validityControl = ValidityControl(Vue)
const validity = Validity(Vue)
const validityGroup = ValidityGroup(Vue)

describe('validity group', () => {
  let el
  const components = {
    validityControl,
    validity,
    comp: {
      data () { return { value: 'hello' } },
      render (h) {
        return h('input', { attrs: { type: 'text' }})
      }
    }
  }

  function createVM (components, child) {
    return new Vue({
      components,
      render (h) {
        const validities = []
        for (let i = 0; i < child; i++) {
          const index = i + 1
          validities.push(h('validity', {
            props: {
              field: `field${index}`,
              validators: { required: { rule: true, message: 'required !!' }}
            },
            ref: `validity${index}`
          }, [
            h('input', { attrs: { id: `field${index}`, type: 'text' }})
          ]))
        }
        return h('div', validities)
      }
    })
  }

  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('basic', () => {
    it('should be work', done => {
      const vm = createVM(components, 2).$mount(el)
      const { validity1, validity2 } = vm.$refs
      const field1 = vm.$el.querySelector('#field1')
      const field2 = vm.$el.querySelector('#field2')
      const group = new Vue(validityGroup)
      group.register(validity1.field, validity1)
      group.register(validity2.field, validity2)
      let result = group.result
      // created instance
      assert(result.valid === true)
      assert(result.invalid === false)
      assert(result.dirty === false)
      assert(result.pristine === true)
      assert(result.touched === false)
      assert(result.untouched === true)
      assert(result.modified === false)
      assert.deepEqual(result.field1, validity1.result)
      assert.deepEqual(result.field2, validity2.result)
      waitForUpdate(() => {
        // simulate inputing
        field2.value = 'hello'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        result = group.result
        assert(result.valid === false)
        assert(result.invalid === true)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.deepEqual(result.field1, validity1.result)
        assert.deepEqual(result.field2, validity2.result)
        // simulate inputing
        field1.value = 'world'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        result = group.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.deepEqual(result.field1, validity1.result)
        assert.deepEqual(result.field2, validity2.result)
        // reset
        field1.value = ''
        field2.value = ''
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        result = group.result
        assert(result.valid === false)
        assert(result.invalid === true)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === false)
        assert.deepEqual(result.field1, validity1.result)
        assert.deepEqual(result.field2, validity2.result)
      }).then(done)
    })
  })

  describe('nested', () => {
    it('should be work', done => {
      const vm = createVM(components, 3).$mount(el)
      const { validity1, validity2, validity3 } = vm.$refs
      const field1 = vm.$el.querySelector('#field1')
      const field2 = vm.$el.querySelector('#field2')
      const field3 = vm.$el.querySelector('#field3')
      const group1 = new Vue(validityGroup)
      const group2 = new Vue(validityGroup)
      const root = new Vue(validityGroup)
      group1.register(validity1.field, validity1)
      group1.register(validity2.field, validity2)
      group2.register(validity3.field, validity3)
      root.register('group1', group1)
      root.register('group2', group2)
      let result = root.result
      // created instance
      assert(result.valid === true)
      assert(result.invalid === false)
      assert(result.dirty === false)
      assert(result.pristine === true)
      assert(result.touched === false)
      assert(result.untouched === true)
      assert(result.modified === false)
      assert.deepEqual(result.group1, group1.result)
      assert.deepEqual(result.group2, group2.result)
      waitForUpdate(() => {
        // simulate inputing
        field2.value = 'hello'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        result = root.result
        assert(result.valid === false)
        assert(result.invalid === true)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.deepEqual(result.group1, group1.result)
        assert.deepEqual(result.group2, group2.result)
        // simulate inputing
        field1.value = 'world'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        field3.value = 'world'
        triggerEvent(field3, 'input')
        triggerEvent(field3, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        result = root.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.deepEqual(result.group1, group1.result)
        assert.deepEqual(result.group2, group2.result)
        // reset
        field1.value = ''
        field2.value = ''
        field3.value = ''
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        triggerEvent(field3, 'input')
        triggerEvent(field3, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        result = root.result
        assert(result.valid === false)
        assert(result.invalid === true)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === false)
        assert.deepEqual(result.group1, group1.result)
        assert.deepEqual(result.group2, group2.result)
      }).then(done)
    })
  })

  describe('unregister', () => {
    it('should be work', done => {
      const vm = createVM(components, 3).$mount(el)
      const { validity1, validity2, validity3 } = vm.$refs
      const field1 = vm.$el.querySelector('#field1')
      const field2 = vm.$el.querySelector('#field2')
      const field3 = vm.$el.querySelector('#field3')
      const group1 = new Vue(validityGroup)
      const group2 = new Vue(validityGroup)
      const root = new Vue(validityGroup)
      group1.register(validity1.field, validity1)
      group1.register(validity2.field, validity2)
      group2.register(validity3.field, validity3)
      root.register('group1', group1)
      root.register('group2', group2)
      let result
      waitForUpdate(() => {
        // validate
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        result = root.result
        assert(result.valid === false)
        assert(result.invalid === true)
        assert(result.dirty === false)
        assert(result.pristine === true)
        assert(result.touched === false)
        assert(result.untouched === true)
        assert(result.modified === false)
        assert.deepEqual(result.group1, group1.result)
        assert.deepEqual(result.group2, group2.result)
        // validity2 unregsiter
        group1.unregister(validity2.field)
        field1.value = 'hello'
        field2.value = 'hello'
        field3.value = ''
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        triggerEvent(field3, 'input')
        triggerEvent(field3, 'focusout')
        // validate
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        result = root.result
        assert(result.valid === false)
        assert(result.invalid === true)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.deepEqual(result.group1, group1.result)
        assert.deepEqual(result.group2, group2.result)
        // group2 unregsiter
        root.unregister('group2')
      }).thenWaitFor(1).then(() => {
        result = root.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.deepEqual(result.group1, group1.result)
        assert(result.group2 === undefined)
      }).then(done)
    })
  })

  describe('destroy', () => {
    it('should be clean resouces', done => {
      const vm = createVM(components, 2).$mount(el)
      const { validity1, validity2 } = vm.$refs
      const group = new Vue(validityGroup)
      group.register(validity1.field, validity1)
      group.register(validity2.field, validity2)
      waitForUpdate(() => {
        group.$destroy()
      }).then(() => {
        assert(!group._validityKeys)
        assert(!group._validities)
        assert(!group._validityWatchers)
      }).then(done)
    })
  })

  describe('isRegistered', () => {
    it('should be work', () => {
      const vm = createVM(components, 2).$mount(el)
      const { validity1, validity2 } = vm.$refs
      const group = new Vue(validityGroup)
      group.register(validity1.field, validity1)
      assert(group.isRegistered(validity1.field))
      assert(!group.isRegistered(validity2.field))
    })
  })
})
