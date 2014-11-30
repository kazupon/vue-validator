// Karma configuration
// Generated on Mon Nov 10 2014 00:43:50 GMT+0900 (JST)

module.exports = function (config) {
  var reporter = process.env.REPORTER || 'html'
  var reporters = ['progress', 'coverage']
  var browsers =  ['PhantomJS']
  if (reporter === 'lcov') {
    reporters.push('coveralls')
    browsers = browsers.concat(['Chrome', 'Safari', 'Firefox'])
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'expect', 'commonjs'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/vue/dist/vue.js',
      'lib/*.js',
      'index.js',
      'test/**/specs/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'node_modules/vue/dist/vue.js': ['commonjs'],
      'lib/*.js': ['coverage', 'commonjs'],
      'index.js': ['coverage', 'commonjs'],
      'test/**/specs/*.js': ['commonjs']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,


    coverageReporter: {
      type : reporter, 
      dir : 'coverage/'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
