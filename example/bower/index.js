var validator = window['vue-validator']

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
