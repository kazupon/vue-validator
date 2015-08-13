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
    filename: 'vue-validator.min.js',
    library: 'vue-validator',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.BannerPlugin(banner, { raw: true })
  ]
}
