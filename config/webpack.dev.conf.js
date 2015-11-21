module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './index.js']
  },
  output: {
    path: './',
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
