const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  devtool: "source-map",
  output: {
    path: __dirname + "/dist",
    filename: "index_bundle.js",
  },
  resolve: {
    alias: {
      MyCreate: path.resolve(__dirname, "./MyCreate"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-transform-react-jsx", { pragma: "MyCreate" }],
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.view/,
        use: {
          loader: path.resolve("./loader.js"),
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "index.html" })],
};
