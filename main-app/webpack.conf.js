const webpack = require('webpack');
var path = require('path');


function root(args) {
   var ROOT = path.resolve(__dirname, '../../../../');
   args = Array.prototype.slice.call(arguments, 0);
   return path.join.apply(path, [ROOT].concat(args));
}

function testRoot(args) {
   var myRoot = path.resolve(__dirname, '../../');
   args = Array.prototype.slice.call(arguments, 0);
   return path.join.apply(path, [myRoot].concat(args));
}

function mainApp(args) {
   var myRoot = path.resolve(__dirname);
   args = Array.prototype.slice.call(arguments, 0);
   return path.join.apply(path, [myRoot].concat(args));
}

/*
 * Webpack Plugins
 */
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

/*
 * Webpack configuration
 */
module.exports = function (options) {
   return {
      entry: {
         'main': mainApp('main.ts')
      },
      resolve: {
         extensions: ['.ts', '.js', '.json'],
         modules: [testRoot(''), root('node_modules')],

      },
      performance: {
         hints: false
      },
      devtool: 'inline-source-map',

      output: {
         path: root('dist'),
         filename: '[name].js',
         sourceMapFilename: '[name].map',
         chunkFilename: '[id].chunk.js',
         library: 'ac_[name]',
         libraryTarget: 'var'
      },
      module: {

         rules: [{
               test: /\.ts$/,
               use: [
                  'awesome-typescript-loader',
                  'angular2-template-loader',
                  'angular-router-loader'
               ],
               exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
               test: /\.scss$/,
               use: ['to-string-loader', 'css-loader', 'sass-loader'],
               exclude: [mainApp('styles')]
            },
            {
               test: /\.html$/,
               use: 'raw-loader',
               exclude: mainApp('index.html')
            },
            {
               test: /\.(jpg|png|gif)$/,
               use: 'file-loader'
            },
            {
               test: /\.(ttf|eot|svg|woff|woff2|ico)$/,
               use: 'file-loader?name=assets/fonts/[name].[ext]'
            },
            {
               test: /\.css$/,
               use: ['style-loader', 'css-loader'],
               include: [mainApp('styles')]
            },
            {
               test: /\.scss$/,
               use: ['style-loader', 'css-loader', 'sass-loader'],
               include: [mainApp('styles')]
            }
         ]
      },


      plugins: [
         new ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)src(\\|\/)linker/, __dirname + '../', {}),

         new CopyWebpackPlugin([{
               from: testRoot('demo', 'assets'),
               to: 'assets'
            }
         ]),

         new HtmlWebpackPlugin({
            template: mainApp('index.html'),
            chunksSortMode: 'dependency'
         }),

         // Fix Angular 2
         new NormalModuleReplacementPlugin(
            /facade(\\|\/)async/,
            root('node_modules/@angular/core/src/facade/async.js')
         ),
         new NormalModuleReplacementPlugin(
            /facade(\\|\/)collection/,
            root('node_modules/@angular/core/src/facade/collection.js')
         ),
         new NormalModuleReplacementPlugin(
            /facade(\\|\/)errors/,
            root('node_modules/@angular/core/src/facade/errors.js')
         ),
         new NormalModuleReplacementPlugin(
            /facade(\\|\/)lang/,
            root('node_modules/@angular/core/src/facade/lang.js')
         ),
         new NormalModuleReplacementPlugin(
            /facade(\\|\/)math/,
            root('node_modules/@angular/core/src/facade/math.js')
         )
      ],
      devServer: {
         port: PORT,
         host: HOST,
         historyApiFallback: true,
         stats: "errors-only",
         clientLogLevel: "warning"
      },
   };
}
