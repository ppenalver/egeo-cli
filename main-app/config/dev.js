const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js'); // the settings that are common to prod and dev

const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

module.exports = function (params, assets) {
   return webpackMerge(commonConfig(params, false, assets), {
      devtool: 'cheap-module-eval-source-map',

      output: {
         path: helpers.root('../dist/web'),
         filename: '[name].js',
         sourceMapFilename: '[name].map',
         chunkFilename: '[id].chunk.js',
         library: 'ac_[name]',
         libraryTarget: 'var'
      },

      module: {
         rules: [
            // {
            //    test: /\.ts$/,
            //    use: [{
            //       loader: 'tslint-loader',
            //       options: {
            //          configFile: 'tslint.json'
            //       }
            //    }],
            //    exclude: [/\.(spec|e2e)\.ts$/]
            // },
            {
               test: /\.css$/,
               use: ['style-loader', 'css-loader'],
               include: [helpers.root('app', 'styles')]
            },
            {
               test: /\.scss$/,
               use: ['style-loader', 'css-loader', 'sass-loader'],
               include: [helpers.root('app', 'styles')]
            }
         ]
      },
      plugins: [
         new LoaderOptionsPlugin({
            debug: true,
            options: {}
         })
      ],

      devServer: {
         port: PORT,
         host: HOST,
         historyApiFallback: true,
         stats: "errors-only",
         clientLogLevel: "warning",
         inline: true
      }
   });
}
