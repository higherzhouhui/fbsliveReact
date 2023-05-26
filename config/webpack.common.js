const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
require("@babel/polyfill");
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDEV = process.env.NODE_ENV === "development";
const SpritesmithPlugin = require("webpack-spritesmith");
const { DefinePlugin } = require("webpack");

const AppTitle = "FBS";

module.exports = {
  entry: {
    main: path.resolve(__dirname, "../src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "js/[name].[chunkhash:8].bundle.js",
    publicPath: "/",
  },
  plugins: [
    new DefinePlugin({
      // 定义环境和变量
      LocalEnv: `"${process.env.NODE_ENV}"`,
    }),
    new friendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/*.js",
          to: path.resolve(__dirname, "../build", "[name][ext]"),
        },
        {
          from: "public/*.json",
          to: path.resolve(__dirname, "../build", "[name][ext]"),
        },
        {
          from: "public/favicon.ico",
          to: path.resolve(__dirname, "../build", "favicon.ico"),
        },
        {
          from: "public/video.html",
          to: path.resolve(__dirname, "../build", "video.html"),
        },
        {
          from: "public/boat.html",
          to: path.resolve(__dirname, "../build", "boat.html"),
        },
        {
          from: "public/videoOfficial.html",
          to: path.resolve(__dirname, "../build", "videoOfficial.html"),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: AppTitle,
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html",
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, "../src/assets/images/icon"),
        glob: "*.png",
      },
      target: {
        image: path.resolve(__dirname, "../src/assets/sprite/sprite.png"),
        css: [
          [
            path.resolve(__dirname, "../src/assets/sprite/sprite.css"),
            {
              format: "function_based_template",
            },
          ],
        ],
      },
      apiOptions: {
        cssImageRef: "~sprite.png",
      },
      customTemplates: {
        function_based_template: (data) => {
          var perSprite = data.sprites
            .map(function (sprite) {
              return ".icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx;background-image: url(I);background-size: bzWpx bzHpx; }"
                .replace("N", sprite.name)
                .replace("W", sprite.width / 3)
                .replace("H", sprite.height / 3)
                .replace("X", sprite.offset_x / 3)
                .replace("Y", sprite.offset_y / 3)
                .replace("I", data.sprites[0].image)
                .replace("bzW", sprite.total_width / 3)
                .replace("bzH", sprite.total_height / 3);
            })
            .join("\n");

          return perSprite;
        },
      },
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  module: {
    unsafeCache: true,
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 4,
              workerParallelJobs: 50,
              workerNodeArgs: ["--max-old-space-size=1024"],
              poolRespawn: false,
              poolTimeout: 2000,
              poolParallelJobs: 50,
              name: "my-pool",
            },
          },
          "babel-loader",
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|svga)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "images/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [isDEV ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [isDEV ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.module\.scss$/,
        use: [
          isDEV ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]--[contenthash:base64:5]",
              },
              sourceMap: true,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devServer: {
    port: 3000,
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    },
    proxy: {
      "/api": {
        // target: 'http://fbs98.com', //fbs 测试环境 （默认连接测试环境开发）
        target: "http://fbs-web.testlive.vip", //fbs 测试环境 （默认连接测试环境开发）
        // target: "http://192.168.50.79:8101", //fbs dd本地联调
        // target: 'http://fbs-liveapi.testlive.vip', //fbs 测试环境 （默认连接测试环境开发）
        // target: 'http://fbslive.com', //fbs 正式环境
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
  },
};
