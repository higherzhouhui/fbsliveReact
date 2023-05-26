const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
require('@babel/polyfill');

const config = merge(common, {
  mode: 'development',
  devtool: "source-map",
  plugins: [

  ],
  optimization: {
    usedExports: true,
  },
})

module.exports = config;
