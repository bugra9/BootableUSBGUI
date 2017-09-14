const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/app.js',
target: 'node',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader']
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.po?$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'BootableUSB'
    })
  ]
}