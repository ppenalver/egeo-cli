const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");

module.exports = function (exampleFolder, assets) {

   const config = require('../main-app/config/dev.js')(exampleFolder, assets);
   config.entry.main.unshift("webpack-dev-server/client?http://localhost:3030/");

   const compiler = webpack(config);
   var server = new webpackDevServer(compiler, {
      contentBase: __dirname + 'main-app/app',
      hot: false,
      historyApiFallback: true,
      compress: true,
      clientLogLevel: "warning",
      filename: "bundle.js",
      stats: "errors-only"
   });
   server.listen(3030, "localhost", function () {});
}
