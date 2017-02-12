var webpack = require("webpack");

module.exports = {
  devtool: "inline-sourcemap",

  entry: {
    index: [
      "./index.js",
    ],
  },

  module: {
    loaders: [
      {
        loader: "babel-loader",
        exclude: /(node_modules)/,
        query: { cacheDirectory: true },
        test: /\.js$/,
      }
    ],
  },

  node: {
    __filename: true,
    __dirname: true,
  },

  output: {
    chunkFilename: "[id].[hash:5]-[chunkhash:7].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: "./dist",
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
  ],

  target: "async-node",
};