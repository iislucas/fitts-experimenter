/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'index': './src/index.ts',
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', 'mp3'],
  },

  module: {
    loaders: [
      { test: /\.html$/, loader: 'html' },
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.mp3$/, loader: 'file' },
    ],
  },

  output: {
    // The path to output built files to
    path: 'build/dev',
    // The path these files expect to be at on the web-server
    publicPath: '/fitts-experiment/',
    // How files are named
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  htmlLoader: {
    minimize: false, // workaround for ng2
  },

  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
  ]
};
