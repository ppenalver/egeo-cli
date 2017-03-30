const webpack = require("webpack");
const path = require("path");

module.exports = function (exampleFolder, assets) {
   const config = require('../main-app/config/prod.js')(exampleFolder, assets);
   const compiler = webpack(config);
   compiler.run(
      (err, stats) => {
         if (err) {
            console.error(err);
         } else {
            if (stats.hasErrors()) {
               console.error(stats.toJson().errors.toString());
            } else {
               console.log(stats.toString());
               if (stats.hasWarnings()) {
                  console.warn(stats.toJson().warnings.toString());
               }
            }
         }
      }
   );
}
