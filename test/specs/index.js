import Vue from 'vue'
import VueValidator from '../../src/index'

Vue.use(VueValidator)

require('./validators.js')
require('./asset')
require('./directives/validator')
require('./directives/validate')
