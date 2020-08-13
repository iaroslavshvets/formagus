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
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        mangle: {
          toplevel: true,
        },
      },
    })],
  },
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
