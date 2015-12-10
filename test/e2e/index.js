import Vue from 'vue'
import plugin from '../../src/index'

Vue.use(plugin)

// register custom validator
Vue.validator('email', (val) => {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
})

Vue.validator('same', (val, prop) => {
  return val == this.$get(prop)
})

new Vue({
  data: {
    username: '',
    email: '',
    confirmEmail: '',
    password: ''
  }
}).$mount('#registration')
