import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('async', () => {
  let el, vm
  const DELAY = 10

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('promise like function', () => {
    describe('resolve', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:username="{ exist: true, required: true }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          validators: {
            exist: (val) => {
              return (resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, DELAY)
              }
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        setTimeout(() => {
          // default
          assert(vm.$validator1.username.exist === false)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.modified === false)

          // change input value
          let input = el.getElementsByTagName('input')[0]
          input.value = 'username'
          trigger(input, 'input')
          trigger(input, 'blur')
          setTimeout(() => {
            assert(vm.$validator1.username.exist === false)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            done()
          }, DELAY + 5)
        }, DELAY + 5)
      })
    })

    describe('reject', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:username="{ exist: true, required: true }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          validators: {
            exist: (val) => {
              return (resolve, reject) => {
                setTimeout(() => {
                  reject()
                }, DELAY)
              }
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        setTimeout(() => {
          // default
          assert(vm.$validator1.username.exist === true)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.modified === false)

          // change input value
          let input = el.getElementsByTagName('input')[0]
          input.value = 'username'
          trigger(input, 'input')
          trigger(input, 'blur')
          setTimeout(() => {
            assert(vm.$validator1.username.exist === true)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            done()
          }, DELAY + 5)
        }, DELAY + 5)
      })
    })
  })


  describe('promise', () => {
    describe('resolve', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:username="{ exist: true, required: true }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          validators: {
            exist: (val) => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, DELAY)
              })
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        setTimeout(() => {
          // default
          assert(vm.$validator1.username.exist === false)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.modified === false)

          // change input value
          let input = el.getElementsByTagName('input')[0]
          input.value = 'username'
          trigger(input, 'input')
          trigger(input, 'blur')
          setTimeout(() => {
            assert(vm.$validator1.username.exist === false)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            done()
          }, DELAY + 5)
        }, DELAY + 5)
      })
    })

    describe('reject', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:username="{ exist: true, required: true }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          validators: {
            exist: (val) => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  reject()
                }, DELAY)
              })
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        setTimeout(() => {
          // default
          assert(vm.$validator1.username.exist === true)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.modified === false)

          // change input value
          let input = el.getElementsByTagName('input')[0]
          input.value = 'username'
          trigger(input, 'input')
          trigger(input, 'blur')
          setTimeout(() => {
            assert(vm.$validator1.username.exist === true)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            done()
          }, DELAY + 5)
        }, DELAY + 5)
      })
    })
  })
})
