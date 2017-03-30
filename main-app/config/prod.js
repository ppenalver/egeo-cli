const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

module.exports = function (params, assets) {
   return webpackMerge(commonConfig(params, false, assets), {
      devtool: 'source-map',
      output: {
         path: helpers.root('../dist/web'),
         filename: '[name].bundle.js',
         sourceMapFilename: '[name].bundle.map',
         chunkFilename: '[name].chunk.js'
      },
      module: {
         rules: [{
               test: /\.css$/,
               loader: ExtractTextPlugin.extract({
                  fallbackLoader: 'style-loader',
                  loader: 'css-loader'
               }),
               include: [helpers.root('app', 'styles')]
            },
            {
               test: /\.scss$/,
               loader: ExtractTextPlugin.extract({
                  fallbackLoader: 'style-loader',
                  loader: 'css-loader!sass-loader'
               }),
               include: [helpers.root('app', 'styles')]
            },
            {
               test: /\.css$/,
               use: ['to-string-loader', 'css-loader'],
               include: [helpers.node_modules()]
            },
            {
               test: /\.(ttf|eot|svg|woff|woff2|ico)$/,
               use: 'url-loader?limit=100000&name=/fonts/[name].[ext]'
            }
         ]
      },
      plugins: [
         new OptimizeJsPlugin({
            sourceMap: false
         }),
         new ExtractTextPlugin('[name].css'),

         new CompressionPlugin({
            asset: "[path].gz",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
         }),
         new UglifyJsPlugin({
            beautify: false, //prod
            output: {
               comments: false
            }, //prod
            mangle: {
               screw_ie8: true
            }, //prod
            compress: {
               screw_ie8: true,
               warnings: false,
               conditionals: true,
               unused: true,
               comparisons: true,
               sequences: true,
               dead_code: true,
               evaluate: true,
               if_return: true,
               join_vars: true,
               negate_iife: false
            },
         }),

         new LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
               htmlLoader: {
                  minimize: true,
                  removeAttributeQuotes: false,
                  caseSensitive: true,
                  customAttrSurround: [
                     [/#/, /(?:)/],
                     [/\*/, /(?:)/],
                     [/\[?\(?/, /(?:)/]
                  ],
                  customAttrAssign: [/\)?\]?=/]
               },
            }
         })
      ]
   });
}
