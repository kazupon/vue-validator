import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('event', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('validate target element level', () => {
    describe('valid', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1">
          <input type="text" @valid="onValid" v-validate:field1="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onValid () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input = el.getElementsByTagName('input')[0]
          input.value = 'foo'
          trigger(input, 'input')
        })
      })
    })


    describe('invalid', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1">
            <input type="text" value="hello" @invalid="onInValid" v-validate:field1="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onInValid () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input = el.getElementsByTagName('input')[0]
          input.value = ''
          trigger(input, 'input')
        })
      })
    })


    describe('touched', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1">
            <input type="text" value="hello" @touched="onTouched" v-validate:field1="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onTouched () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input = el.getElementsByTagName('input')[0]
          trigger(input, 'input')
          trigger(input, 'blur')
        })
      })
    })


    describe('dirty', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1">
            <input type="text" value="hello" @dirty="onDirty" v-validate:field1="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onDirty () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input = el.getElementsByTagName('input')[0]
          input.value = ''
          trigger(input, 'input')
        })
      })
    })


    describe('modified', () => {
      it('should be occured event', (done) => {
        let results = []
        el.innerHTML = `
          <validator name="validator1">
            <input type="text" value="hello" @modified="onModified" v-validate:field1="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onModified (e) {
              results.push(e.modified)
              if (results.length === 2) {
                assert(results[0] === true)   // first event
                assert(results[1] === false)  // second event
                done()
              }
            }
          }
        })

        vm.$nextTick(() => {
          let input = el.getElementsByTagName('input')[0]
          input.value = ''
          trigger(input, 'input')
          vm.$nextTick(() => {
            input.value = 'hello'
            trigger(input, 'input')
          })
        })
      })
    })
  })


  describe('validator top level', () => {
    describe('valid', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1" @valid="onValid">
            <input type="text" v-validate:field1="{ required: true }">
            <input type="text" v-validate:field2="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onValid () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input1 = el.getElementsByTagName('input')[0]
          let input2 = el.getElementsByTagName('input')[1]
          input1.value = 'foo'
          input2.value = 'bar'
          trigger(input1, 'input')
          trigger(input2, 'input')
        })
      })
    })


    describe('invalid', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1" @invalid="onInvalid">
            <input type="text" value="hello" v-validate:field1="{ required: true }">
            <input type="text" value="world" v-validate:field2="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onInvalid () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input1 = el.getElementsByTagName('input')[0]
          input1.value = ''
          trigger(input1, 'input')
        })
      })
    })


    describe('touched', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1" @touched="onTouched">
            <input type="text" v-validate:field1="{ required: true }">
            <input type="text" v-validate:field2="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onTouched () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input1 = el.getElementsByTagName('input')[0]
          trigger(input1, 'blur')
        })
      })
    })


    describe('dirty', () => {
      it('should be occured event', (done) => {
        el.innerHTML = `
          <validator name="validator1" @dirty="onDirty">
            <input type="text" v-validate:field1="{ required: true }">
            <input type="text" v-validate:field2="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onDirty () {
              assert(true)
              done()
            }
          }
        })

        vm.$nextTick(() => {
          let input1 = el.getElementsByTagName('input')[0]
          input1.value = 'hello'
          trigger(input1, 'input')
        })
      })
    })


    describe('modified', () => {
      it('should be occured event', (done) => {
        let results = []
        el.innerHTML = `
          <validator name="validator1" @modified="onModified">
            <input type="text" value="hello" v-validate:field1="{ required: true }">
          </validator>
        `
        vm = new Vue({
          el: el,
          methods: {
            onModified (modified) {
              results.push(modified)
              if (results.length === 2) {
                assert(results[0] === true)   // first event
                assert(results[1] === false)  // second event
                done()
              }
            }
          }
        })

        vm.$nextTick(() => {
          let input1 = el.getElementsByTagName('input')[0]
          input1.value = ''
          trigger(input1, 'input')
          vm.$nextTick(() => {
            input1.value = 'hello'
            trigger(input1, 'input')
          })
        })
      })
    })
  })
})
