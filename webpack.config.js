const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: '../api/search.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: '../html/index.html',
      filename: 'weapons.html'
    }),
    new HtmlWebpackPlugin({
      template: '../html/weapons.html',
      filename: 'weapons.html'
    }),
    new HtmlWebpackPlugin({
      template: '../dist/search.html',
      filename: 'search.html'
    }),
    new HtmlWebpackPlugin({
      template: '../html/forecast.html',
      filename: 'forecast.html'
    })
  ]
};
