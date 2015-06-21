var Vue = require('yyx990803/vue@0.11.2')
var validator = require('vuejs/vue-validator@v1.0.6')
    
Vue.use(validator)

var form = new Vue({
  validator: {
    validates: {
      email: function (val) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
      }
    }
  },
  data: {
    name: '',
    age: 18,
    email: '',
    zip: '11112222'
  }
}).$mount('#user-form')
