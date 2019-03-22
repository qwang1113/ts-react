const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const constants = require('./constants')
const config = require('./config')
const { assetsPath } = require('./utils')

const devPlugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'build/templates/index.html',
    inject: true,
    title: config.AppTitle
  }),
  new CaseSensitivePathsPlugin(),
  new webpack.HotModuleReplacementPlugin()
]

const prodPlugins = [
  new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
  new HtmlWebpackPlugin({
    filename: config.index,
    template: 'build/templates/index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: assetsPath('css/[name].[hash].css'),
    chunkFilename: assetsPath('css/[name].[id].[hash].css')
  })
]

if (config.bundleAnalyzerReport) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  prodPlugins.push(new BundleAnalyzerPlugin())
}

module.exports = constants.APP_ENV === 'dev' ? devPlugins : prodPlugins
