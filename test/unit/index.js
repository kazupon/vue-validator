import Vue from 'vue'
import plugin from '../../src/index'

// import all helpers
const helpersContext = require.context('../helpers', true)
helpersContext.keys().forEach(helpersContext)

// require all test files
const testsContext = require.context('./', true, /\.test$/)
testsContext.keys().forEach(testsContext)

Vue.use(plugin)
