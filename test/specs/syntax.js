import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('syntax', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  context('simple', () => {
    beforeEach((done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<form novalidate>' +
        '<input type="text" v-validate:field1="{ minlength: 2 }">' +
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.minlength === true)

      // change input value
      let input = el.getElementsByTagName('input')[0]
      input.value = 'foo'
      trigger(input, 'input')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.minlength === false)
        done()
      })
    })
  })

  
  context('array', () => {
    beforeEach((done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<form novalidate>' +
        '<input type="text" v-validate:field1="[\'required\']">' +
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.required === true)

      // change input value
      let input = el.getElementsByTagName('input')[0]
      input.value = 'foo'
      trigger(input, 'input')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        done()
      })
    })
  })


  context('strict', () => {
    beforeEach((done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<form novalidate>' +
        '<input type="text" value="foo" v-validate:field1="{ minlength: { rule: 2 }, maxlength: { rule: 5 } }">' +
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })
    
    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.minlength === false)
      assert(vm.$validator1.field1.maxlength === false)

      // change input value
      let input = el.getElementsByTagName('input')[0]
      input.value = 'h'
      trigger(input, 'input')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.minlength === true)
        assert(vm.$validator1.field1.maxlength === false)

        input.value = 'hi kazupon'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.minlength === false)
          assert(vm.$validator1.field1.maxlength === true)
          done()
        })
      })
    })
  })


  context('binding', () => {
    context('primitive', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" value="0" v-validate:field1="{ max: number }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { number: 10 }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.field1.max === false)

        // change input value
        let input = el.getElementsByTagName('input')[0]
        input.value = '11'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.max === true)
          done()
        })
      })
    })

    context('function', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" value="5" v-validate:field1="{ max: getMax(condition) }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { condition: '' },
          methods: {
            getMax (condition) {
              let ret = 0
              switch (condition) {
                case 'condition1':
                  ret = 5
                  break
                default:
                  ret = 10
                  break
              }
              return ret
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.field1.max === false)

        // change input value
        let input = el.getElementsByTagName('input')[0]
        vm.condition = 'condition1'
        input.value = '11'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.max === true)
          done()
        })
      })
    })

    context('object', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:field1="rules">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { rules: { required: true, pattern: '/foo/' } }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.field1.required === true)
        assert(vm.$validator1.field1.pattern === true)

        // change input value
        let input = el.getElementsByTagName('input')[0]
        input.value = 'foo'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.pattern === false)
          done()
        })
      })
    })
  })
})
