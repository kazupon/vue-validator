import Vue from 'vue'
import VueValidator from '../src/index'

Vue.use(VueValidator)
Vue.component('comp', {
  template: '<div><p>my component</p></div>' +
    '<pre>{{$validator1 | json}}</pre>',
  props: ['$validator1']
})

let vm = new Vue({
  el: '#app',
  data: {
    msg: 'this is vue-validator v2 prototyping example (on designing phase)',
    visibleValidator: false,
    visibleTemplate: false,
    group1: 'group1',
    group2: 'group2',
    max: 1,
    obj: {
      max: 2,
      min: 0,
      required: true
    }
  },
  destroyed () {
    console.log('destroyed', this)
  },
  attached () {
    console.log('attached')
  },
  detached () {
    console.log('detached')
  },
  methods: {
    onClick () {
      console.log('call onClick')
      this.max++
      this.obj.max++
      this.$validator1.a++
    }
  }
})

/*
let inc = 2
let offset = 10
setInterval(() => {
  inc++
  vm.group1 = 'group' + inc
  vm.group2 = 'group' + (inc + offset)
}, 1000)
*/
