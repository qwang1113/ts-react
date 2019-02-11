const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const config = require('./utils/config')
const constants = require('./utils/constants')
const styleRules = require('./rules/styleRules')
const jsRules = require('./rules/jsRules')
const fileRules = require('./rules/fileRules')
const plugins = require('./utils/plugins')
const { assetsPath, resolve } = require('./utils/utils')
const optimization = require('./utils/optimization')
require('./utils/cleanup-folder')

module.exports = {
  entry: {
    app: ['./src/main.tsx']
  },
  output: {
    path: config.assetsRoot,
    filename: constants.APP_ENV === 'dev' ? '[name].js' : assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: constants.APP_ENV === 'dev' ? '[name].js' : assetsPath('js/[name].[id].[chunkhash].js'),
    publicPath: config.assetsPublicPath
  },
  resolve: {
    extensions: constants.FILE_EXTENSIONS,
    // modules: [resolve('src'), resolve('node_modules')],
    // alias: {
    //   mobx: resolve('node_modules/mobx/lib/mobx.es6.js')
    // },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: resolve('tsconfig.webpack.json'),
        extensions: constants.FILE_EXTENSIONS
      })
    ]
  },
  module: {
    rules: [...styleRules, ...jsRules, ...fileRules]
  },
  plugins,
  optimization,
  stats: { children: false },
  devtool: config.sourceMap ? '#source-map' : false,
  devServer: {
    host: "0.0.0.0",
    port: 3004,
    open: true,
    hot: true,
    contentBase: path.join(__dirname, "../dist"),
    proxy: {
      '/api/*': {
        target: 'http://localhost:3002/',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api/': '' }
      }
    }
  }
}
