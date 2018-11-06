const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: {
          toplevel: true,
        },
        beautify: false,
        compress: {
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false,
        },
      },
    }),
  ],
  mode: 'production',
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    mobx: 'mobx',
    'mobx-react': 'mobx-react',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Formagus',
    libraryTarget: 'umd',
  },
};
