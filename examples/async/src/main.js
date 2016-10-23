import Vue from 'vue'
import VueValidator from 'vue-validator'
import 'babel-polyfill'
import 'whatwg-fetch'
import App from './App.vue'

Vue.use(VueValidator)

new Vue({
  render: h => h(App)
}).$mount('#app')
