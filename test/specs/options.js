import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('async', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    vm = new Vue({
      el: el
    })
    done()
  })

  it.skip('TODO', () => {
    trigger(el, 'input')
    assert(vm)
  })
})
