const webpack = require('webpack')
const JasmineWebpackPlugin = require('./webpack.dev.plugin')

module.exports = {
  entry: './test/unit/index.js',
  output: {
    path: './test/unit',
    filename: 'tests.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules|vue\/dist/,
      loader: 'babel!eslint'
    }],
    postLoaders: [{
      test: /\.json$/,
      loader: 'json'
    }]
  },
  devServer: {
    contentBase: './',
    port: 8080,
    hot: true,
    inline: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new JasmineWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map'
}
