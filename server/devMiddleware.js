const { HotModuleReplacementPlugin } = require("webpack");

module.exports = function devMiddleware(app) {
  const webpack = require("webpack");
  const webpackConfig = require("../webpack.config.js");

  webpackConfig.entry.app.unshift(
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true"
  );

  webpackConfig.plugins.push(new HotModuleReplacementPlugin());

  const webpackCompiler = webpack(webpackConfig);

  app.use(require("webpack-dev-middleware")(webpackCompiler));

  app.use(
    require("webpack-hot-middleware")(webpackCompiler, {
      path: "/__webpack_hmr",
      heartbeat: 1000,
    })
  );
};
