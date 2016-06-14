import Vue from 'vue'
import assert from 'power-assert'
import plugin from '../../src/index'

Vue.use(plugin)

window.Vue = Vue
window.assert = assert
