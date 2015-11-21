import Vue from 'vue'
import VueValidator from '../../src/index'

Vue.use(VueValidator)

require('./validators.js')
require('./asset')
require('./directives/validator')
require('./directives/validate')
require('./syntax')
require('./custom')
require('./dirty')
require('./pristine')
require('./modified')
require('./touched')
require('./untouched')
require('./valid')
require('./invalid')
require('./event')
require('./group')
require('./multiple')
