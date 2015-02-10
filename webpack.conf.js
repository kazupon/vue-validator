/**
 * Import(s)
 */

var webpack = require('webpack')
var pack = require('./package.json')


var banner =
  '/**\n' +
  ' * ' + pack.name + ' v' + pack.version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' ' + pack.author + '\n' +
  ' * Released under the ' + pack.license + ' License.\n' +
  ' */\n'


/**
 * Export webpack configration
 */

module.exports = {
  entry: __dirname + '/index',
  output: {
    path: __dirname + '/dist',
    library: 'vue-validator',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(banner, { raw: true })
  ]
}
