import States from '../../../src/components/validity/states'
import Computed from '../../../src/components/validity/computed'
import Lifecycles from '../../../src/components/validity/lifecycles'
import Methods from '../../../src/components/validity/methods'
import MultiElement from '../../../src/elements/multi'

const { props, data } = States(Vue)
const computed = Computed(Vue)
const { created } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('MultiElement class', () => {
  describe('#getValue', () => {
    describe('input[type="radio"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'one' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'two' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert.deepEqual(multi.getValue(), [])
        const items = vm.$el.querySelectorAll('input[type="radio"]')
        items[1].checked = true
        assert.deepEqual(multi.getValue(), ['two'])
        items[2].checked = true
        assert.deepEqual(multi.getValue(), ['two', 'three'])
        items[0].checked = true
        items[1].checked = false
        assert.deepEqual(multi.getValue(), ['one', 'three'])
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'checkbox', value: 'one' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'two' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert.deepEqual(multi.getValue(), [])
        const items = vm.$el.querySelectorAll('input[type="checkbox"]')
        items[1].checked = true
        assert.deepEqual(multi.getValue(), ['two'])
        items[2].checked = true
        assert.deepEqual(multi.getValue(), ['two', 'three'])
        items[0].checked = true
        items[1].checked = false
        assert.deepEqual(multi.getValue(), ['one', 'three'])
      })
    })
  })

  describe('#checkModified', () => {
    describe('input[type="radio"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'one' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'two' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert(multi.checkModified() === false)
        const items = vm.$el.querySelectorAll('input[type="radio"]')
        items[1].checked = true
        assert(multi.checkModified() === true)
        items[2].checked = true
        assert(multi.checkModified() === true)
        items[0].checked = true
        items[1].checked = false
        assert(multi.checkModified() === true)
        items[0].checked = false
        items[1].checked = false
        items[2].checked = false
        assert(multi.checkModified() === false)
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'checkbox', value: 'one' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'two' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert(multi.checkModified() === false)
        const items = vm.$el.querySelectorAll('input[type="checkbox"]')
        items[1].checked = true
        assert(multi.checkModified() === true)
        items[2].checked = true
        assert(multi.checkModified() === true)
        items[0].checked = true
        items[1].checked = false
        assert(multi.checkModified() === true)
        items[0].checked = false
        items[1].checked = false
        items[2].checked = false
        assert(multi.checkModified() === false)
      })
    })
  })

  describe('#listenToucheableEvent / #unlistenToucheableEvent', () => {
    it('should be work', done => {
      const vm = new Vue({
        props,
        data,
        computed,
        created,
        methods,
        propsData: {
          field: 'field1',
          child: {},
          validators: {
            required: true
          }
        },
        render (h) {
          const child = this.child = h('fieldset', [
            h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'one' }}),
            h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'two' }}),
            h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'three' }})
          ])
          return child
        }
      }).$mount()
      const multi = new MultiElement(vm)
      multi.listenToucheableEvent()
      const items = (vm.$el.querySelectorAll('input[type="radio"]'))
      triggerEvent(items[1], 'focusout')
      waitForUpdate(() => {
      }).then(() => {
        assert(vm.touched === true)
        vm.reset()
        multi.unlistenToucheableEvent()
        triggerEvent(items[2], 'focusout')
      }).then(() => {
        assert(vm.touched === false)
      }).then(done)
    })
  })
})
