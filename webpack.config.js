const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  target: "web",
  mode: isDev ? "development" : "production",
  devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
  entry: {
    app: [path.resolve(__dirname, "client-src", "index.js")],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "client-dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "client-src", "index.html"),
    }),
  ],
};
