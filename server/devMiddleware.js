const webpack = require("webpack");
const webpackConfig = require("../webpack.config");
const { HotModuleReplacementPlugin } = require("webpack");

function configEntry({ app, config }) {
  const path = config.output.publicPath;

  config.entry.unshift(
    `webpack-hot-middleware/client?path=${path}/__webpack_hmr&timeout=20000&reload=true`
  );

  config.plugins.push(new HotModuleReplacementPlugin());

  const webpackCompiler = webpack(config);

  app.use(
    require("webpack-dev-middleware")(webpackCompiler, {
      publicPath: path,
    })
  );

  app.use(
    require("webpack-hot-middleware")(webpackCompiler, {
      path: `${path}/__webpack_hmr`,
      heartbeat: 1000,
    })
  );
}

module.exports = function devMiddleware(app) {
  webpackConfig.forEach((config) => configEntry({ app, config }));
};
