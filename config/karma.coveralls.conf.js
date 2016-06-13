const base = require('./karma.base.conf')

module.exports = config => {
  const options = Object.assign(base, {
    browsers: ['PhantomJS'],
    reporters: ['coverage', 'coveralls'],
    coverageReporter: {
      reporters: [{
        type: 'lcov', dir: '../coverage'
      }]
    },
    singleRun: true
  })

  // add babel-plugin-coverage for code intrumentation
  options.webpack.babel = {
    plugins: [['coverage', { ignore: ['test/'] }]]
  }

  config.set(options)
}
