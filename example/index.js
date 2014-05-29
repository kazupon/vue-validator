var Vue = require('vue'),
    validator = require('vue-validator')
    
Vue.use(validator)

var form = new Vue({
    el: '#user-form',
    data: {
        name: '',
        age: 18,
        zip: '11112222'
    }
})
