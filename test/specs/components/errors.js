import assert from 'power-assert'
import Vue from 'vue'
import { each } from '../../../src/util'


describe('validator-errors', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('basic', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validation">
          <input type="text" v-validate:field1="field1">
          <input type="text" v-validate:field2="field2">
          <validator-errors :validation="$validation"></validator-errors>
        </validator>
      `
      vm = new Vue({
        el: el,
        data: {
          field1: { pattern: { rule: '/foo/', message: 'field1 pattern error' } },
          field2: { 
            required: { rule: true, message: 'field2 required' },
            minlength: { rule: 2, message: 'field2 short too' }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be rendered error messages', () => {
      let matchCount = 0

      let errorElements = el.getElementsByTagName('p')
      for (var i = 0, l = errorElements.length; i < l; i++) {
        var element = errorElements[i]
        each([
          'field1: field1 pattern error', 
          'field2: field2 required', 
          'field2: field2 short too'
        ], (msg) => {
          if (msg === element.textContent) {
            matchCount++
          }
        })
      }

      assert(matchCount === errorElements.length)
    })
  })


  describe('partial', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validation">
          <input type="text" v-validate:field1="field1">
          <input type="text" v-validate:field2="field2">'
          <validator-errors :partial="'custom-error'":validation="$validation"></validator-errors>
        </validator>'
      `
      Vue.partial('custom-error', '<span>{{field}}:{{validator}}:{{message}}</span>')
      vm = new Vue({
        el: el,
        data: {
          field1: { pattern: { rule: '/foo/', message: 'field1 pattern error' } },
          field2: { 
            required: { rule: true, message: 'field2 required' },
            minlength: { rule: 2, message: 'field2 short too' }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be rendered error messages', () => {
      let matchCount = 0

      let errorElements = el.getElementsByTagName('span')
      for (var i = 0, l = errorElements.length; i < l; i++) {
        var element = errorElements[i]
        each([
          'field1:pattern:field1 pattern error', 
          'field2:required:field2 required', 
          'field2:minlength:field2 short too'
        ], (msg) => {
          if (msg === element.textContent) {
            matchCount++
          }
        })
      }

      assert(matchCount === errorElements.length)
    })
  })


  describe('component', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validation">
          <input type="text" v-validate:field1="field1">
          <input type="text" v-validate:field2="field2">
          <validator-errors :component="'custom-error'" :validation="$validation"></validator-errors>
        </validator>
      `
      Vue.component('custom-error', {
        props: ['field', 'validator', 'message'],
        template: '<div>{{field}}:{{validator}}:{{message}}</div>'
      })
      vm = new Vue({
        el: el,
        data: {
          field1: { pattern: { rule: '/foo/', message: 'field1 pattern error' } },
          field2: { 
            required: { rule: true, message: 'field2 required' },
            minlength: { rule: 2, message: 'field2 short too' }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be rendered error messages', () => {
      let matchCount = 0

      let errorElements = el.getElementsByTagName('div')
      for (var i = 0, l = errorElements.length; i < l; i++) {
        var element = errorElements[i]
        each([
          'field1:pattern:field1 pattern error', 
          'field2:required:field2 required', 
          'field2:minlength:field2 short too'
        ], (msg) => {
          if (msg === element.textContent) {
            matchCount++
          }
        })
      }

      assert(matchCount === errorElements.length)
    })
  })


  describe('group', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator :groups="['group1', 'group2']" name="validation">
          <input type="text" group="group1" v-validate:field1="field1">
          <input type="text" group="group1" v-validate:field2="field2">
          <input type="text" group="group2" v-validate:field3="field3">
          <input type="text" group="group2" v-validate:field4="field4">
          <input type="text" group="group1" value="0" v-validate:field5="{ min: { rule :1, message: message1 } }">
          <input type="text" group="group2" value="foo" v-validate:field6="{ minlength: { rule: 4, message: onMessage2 } }">
          <validator-errors :group="'group1'" :validation="$validation"></validator-errors>
        </validator>
      `
      vm = new Vue({
        el: el,
        data: {
          field1: { pattern: { rule: '/foo/', message: 'field1 pattern error' } },
          field2: { required: { rule: true, message: 'field2 required' } },
          field3: { max: { rule: 3, message: 'field3 big too' } },
          field4: { maxlength: { rule: 3, message: 'field4 long too' } }
        },
        computed: {
          message1 () {
            return 'field5 small too'
          }
        },
        methods: {
          onMessage2 (field) {
            return 'field6 short too ' + field
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be rendered error messages', () => {
      let matchCount = 0

      let errorElements = el.getElementsByTagName('p')
      for (var i = 0, l = errorElements.length; i < l; i++) {
        var element = errorElements[i]
        each([
          'field1: field1 pattern error', 
          'field2: field2 required',
          'field5: field5 small too'
        ], (msg) => {
          if (msg === element.textContent) {
            matchCount++
          }
        })
      }

      assert(matchCount === errorElements.length)
    })
  })


  describe('field', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validation">
          <input type="text" v-validate:field1="field1">
          <input type="text" v-validate:field2="field2">
          <validator-errors :field="'field2'" :validation="$validation"></validator-errors>
        </validator>
      `
      vm = new Vue({
        el: el,
        data: {
          field1: { pattern: { rule: '/foo/', message: 'field1 pattern error' } },
          field2: { 
            required: { rule: true, message: 'field2 required' },
            minlength: { rule: 2, message: 'field2 short too' }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be rendered error messages', () => {
      let matchCount = 0

      let errorElements = el.getElementsByTagName('p')
      for (var i = 0, l = errorElements.length; i < l; i++) {
        var element = errorElements[i]
        each([
          'field2: field2 required', 
          'field2: field2 short too'
        ], (msg) => {
          if (msg === element.textContent) {
            matchCount++
          }
        })
      }

      assert(matchCount === errorElements.length)
    })
  })
})
