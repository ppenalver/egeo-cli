const webpack = require('webpack');
const helpers = require('./helpers');
var path = require('path');

/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

module.exports = function (examplePath, AOT, assets) {
   let assetsToCopy = [];
   if (assets) {
      assetsToCopy.push({
            from: examplePath + '/demo/assets',
            to: 'assets'
         });
   }
   return {
      entry: {
         'polyfills': path.resolve(__dirname, '../app/polyfills.ts'),
         'main': AOT ? [path.resolve(__dirname, '../app/main.aot.ts')] : [path.resolve(__dirname, '../app/main.ts')]
      },
      context: __dirname,

      resolve: {
         alias: {
            'demo': 'demo',
         },
         extensions: ['.ts', '.js', '.json'],
         modules: [helpers.root('app'), helpers.node_modules(), path.relative(__dirname, path.resolve(examplePath))],
      },

      performance: {
         hints: false
      },

      module: {
         rules: [{
               test: /\.ts$/,
               use: [{
                     loader: 'awesome-typescript-loader',
                     options: {
                        configFileName: helpers.root('tsconfig.json')
                     }
                  },
                  'angular2-template-loader',
                  'angular-router-loader'
               ]
            },
            {
               test: /\.scss$/,
               use: ['to-string-loader', 'css-loader', 'sass-loader'],
               exclude: [helpers.root('app', 'styles')]
            },
            {
               test: /\.html$/,
               use: 'raw-loader',
               exclude: helpers.root('app', 'index.html')
            },
            {
               test: /\.(jpg|png|gif)$/,
               use: 'file-loader'
            },
            {
               test: /\.(ttf|eot|svg|woff|woff2|ico)$/,
               use: 'file-loader?name=assets/fonts/[name].[ext]'
            }
         ]
      },

      plugins: [
         new AssetsPlugin({
            path: helpers.root('../dist/web'),
            filename: 'webpack-assets.json',
            prettyPrint: true
         }),
         new CheckerPlugin(),
         new CommonsChunkPlugin({
            name: 'polyfills',
            chunks: ['polyfills']
         }),
         // This enables tree shaking of the vendor modules
         new CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['main'],
            minChunks: module => /node_modules/.test(module.resource)
         }),
         // Specify the correct order the scripts will be injected in
         new CommonsChunkPlugin({
            name: ['polyfills', 'vendor'].reverse()
         }),
         new CopyWebpackPlugin(assetsToCopy),

         new HtmlWebpackPlugin({
            template: helpers.root('app/index.html'),
            chunksSortMode: 'dependency'
         }),
         // Workaround for angular/angular#11580
         new ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('app'), // location of your src
            {} // a map of your routes
         ),
         new ngcWebpack.NgcWebpackPlugin({
            disabled: !AOT,
            tsConfig: helpers.root('tsconfig.json'),
            resourceOverride: helpers.root('config/resource-override.js')
         })
      ]
   };
}
