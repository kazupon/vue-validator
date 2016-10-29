import MultiElementClass from '../../../src/elements/multi'

const MultiElement = MultiElementClass(Vue)

describe('MultiElement class', () => {
  describe('#getValue', () => {
    describe('input[type="radio"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          render (h) {
            return h('fieldset', [
              h('input', { attrs: { type: 'radio', name: 'group', value: 'one' }}),
              h('input', { attrs: { type: 'radio', name: 'group', value: 'two' }}),
              h('input', { attrs: { type: 'radio', name: 'group', value: 'three' }})
            ])
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
          render (h) {
            return h('fieldset', [
              h('input', { attrs: { type: 'checkbox', value: 'one' }}),
              h('input', { attrs: { type: 'checkbox', value: 'two' }}),
              h('input', { attrs: { type: 'checkbox', value: 'three' }})
            ])
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
          render (h) {
            return h('fieldset', [
              h('input', { attrs: { type: 'radio', name: 'group', value: 'one' }}),
              h('input', { attrs: { type: 'radio', name: 'group', value: 'two' }}),
              h('input', { attrs: { type: 'radio', name: 'group', value: 'three' }})
            ])
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
          render (h) {
            return h('fieldset', [
              h('input', { attrs: { type: 'checkbox', value: 'one' }}),
              h('input', { attrs: { type: 'checkbox', value: 'two' }}),
              h('input', { attrs: { type: 'checkbox', value: 'three' }})
            ])
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
      const handleFocusout = jasmine.createSpy()
      const vm = new Vue({
        methods: { willUpdateTouched: handleFocusout },
        render (h) {
          return h('fieldset', [
            h('input', { ref: 'input1', attrs: { type: 'radio', name: 'group', value: 'one' }}),
            h('input', { ref: 'input2', attrs: { type: 'radio', name: 'group', value: 'two' }}),
            h('input', { ref: 'input3', attrs: { type: 'radio', name: 'group', value: 'three' }})
          ])
        }
      }).$mount()
      const { input1, input2, input3 } = vm.$refs
      const multi = new MultiElement(vm)
      multi.listenToucheableEvent()
      triggerEvent(input1, 'focusout')
      triggerEvent(input2, 'focusout')
      waitForUpdate(() => {
        assert(handleFocusout.calls.count() === 2)
        multi.unlistenToucheableEvent()
        triggerEvent(input3, 'focusout')
      }).then(() => {
        assert(handleFocusout.calls.count() === 2)
      }).then(done)
    })
  })

  describe('#listenInputableEvent / #unlistenInputableEvent', () => {
    it('should be work', done => {
      const handleInputable = jasmine.createSpy()
      const vm = new Vue({
        methods: { handleInputable },
        render (h) {
          return h('fieldset', [
            h('input', { ref: 'input1', attrs: { type: 'radio', name: 'group', value: 'one' }}),
            h('input', { ref: 'input2', attrs: { type: 'radio', name: 'group', value: 'two' }}),
            h('input', { ref: 'input3', attrs: { type: 'radio', name: 'group', value: 'three' }})
          ])
        }
      }).$mount()
      const { input1, input2, input3 } = vm.$refs
      const multi = new MultiElement(vm)
      multi.listenInputableEvent()
      triggerEvent(input1, 'change')
      waitForUpdate(() => {
        assert(handleInputable.calls.count() === 1)
        triggerEvent(input2, 'change')
      }).then(() => {
        assert(handleInputable.calls.count() === 2)
        multi.unlistenInputableEvent()
        triggerEvent(input3, 'change')
      }).then(() => {
        assert(handleInputable.calls.count() === 2)
      }).then(done)
    })
  })
})
