// const { HotModuleReplacementPlugin } = require("webpack");

module.exports = function devMiddleware(app) {
  const webpack = require("webpack");
  const webpackConfig = require("../webpack.config.js");

  webpackConfig[0].entry.unshift(
    "webpack-hot-middleware/client?path=/main/__webpack_hmr&timeout=20000&reload=true"
  );

  webpackConfig[1].entry.unshift(
    "webpack-hot-middleware/client?path=/overlay/__webpack_hmr&timeout=20000&reload=true"
  );

  // webpackConfig[0].plugins.push(new HotModuleReplacementPlugin());
  // webpackConfig[1].plugins.push(new HotModuleReplacementPlugin());

  const webpackCompiler = webpack(webpackConfig);

  app.use(require("webpack-dev-middleware")(webpackCompiler));

  app.use(
    require("webpack-hot-middleware")(webpackCompiler, {
      path: "/__webpack_hmr",
      heartbeat: 1000,
    })
  );
};
