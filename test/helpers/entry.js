import Vue from 'vue'
import { compileToFunctions } from 'vue-template-compiler'
import assert from 'power-assert'
import plugin from '../../src/index'

Vue.use(plugin)

window.Vue = Vue
window.compileToFunctions = compileToFunctions
window.assert = assert
