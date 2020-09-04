const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

function createConfig(entry) {
  return {
    target: "web",
    mode: isDev ? "development" : "production",
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
    entry: [path.resolve(__dirname, "client-src", entry, "index.js")],
    output: {
      filename: "index.js",
      publicPath: `/${entry}`,
      path: path.resolve(__dirname, "client-dist", entry),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "client-src", entry, "index.html"),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "client-src", entry, "style.css"),
            to: path.resolve(__dirname, "client-dist", entry),
          },
        ],
      }),
    ],
  };
}

module.exports = [
  createConfig("main"),
  createConfig("overlay"),
  createConfig("question"),
];
