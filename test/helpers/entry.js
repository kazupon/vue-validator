import Vue from 'vue'
import { compileToFunctions } from 'vue-template-compiler'
import assert from 'power-assert'
import plugin from '../../src/index'
import 'babel-polyfill' // promise and etc ...

Vue.use(plugin)

window.Vue = Vue
window.compileToFunctions = compileToFunctions
window.assert = assert
