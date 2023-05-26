const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
require("@babel/polyfill");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // 对js进行压缩
const webpackbar = require("webpackbar");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 对CSS进行压缩
const CompressionPlugin = require("compression-webpack-plugin");

const config = merge(common, {
  mode: "production",
  stats: {
    children: true, // false 不输出子模块的打包信息
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new webpackbar(), // 打包时美化进度条
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:8].css", // 生成的文件名
      chunkFilename: "css/[id].[chunkhash:8].css",
    }),
    new CompressionPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多线程并行构建
        terserOptions: {
          // https://github.com/terser/terser#minify-options
          compress: {
            warnings: false, // 删除无用代码时是否给出警告
            drop_debugger: true, // 删除所有的debugger
            drop_console: true, // 删除所有的console.*
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 2,
      maxAsyncRequests: 4,
      maxInitialRequests: 4,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    usedExports: true,
  },
});

module.exports = config;
