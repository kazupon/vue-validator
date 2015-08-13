/**
 * Import(s)
 */

var webpack = require('webpack')
var banner = require('./banner')


/**
 * Export(s)
 */

module.exports = {
  entry: './index',
  output: {
    path: './dist',
    filename: 'vue-validator.js',
    library: 'vue-validator',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(banner, { raw: true })
  ]
}
