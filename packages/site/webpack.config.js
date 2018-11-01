const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  mode: PROD ? 'production' : 'development',
  devtool: PROD ? undefined : 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
  },
  output: {
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: PROD ? '/router/' : '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Formagus - magical form',
      template: 'src/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      BASEPATH: JSON.stringify(PROD ? '/router' : '/'),
      LIB_VERSION: JSON.stringify(require('../lib/package.json').version),
      VERSION: JSON.stringify(require('./package.json').version)
    }),
    new webpack.ProvidePlugin({
      Glamor: 'glamor/react'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ].concat(
    PROD ? [new UglifyJSPlugin()] : [new webpack.HotModuleReplacementPlugin()]
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env']
            }
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: path.resolve('build/markdown-loader.js')
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  }
};
