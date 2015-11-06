module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './example/index.js']
  },
  output: {
    path: './example',
    publicPath: '/',
    filename: 'basic.build.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  devtool: 'inline-source-map'
}
