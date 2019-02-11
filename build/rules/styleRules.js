const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../utils/config');
const theme = require('../utils/theme');
const { resolve } = require('../utils/utils');

const lessLoader = {
  loader: 'less-loader',
  options: {
    javascriptEnabled: true,
    modifyVars: theme
  }
}

const cacheLoader = {
  loader: 'cache-loader',
  options: {
    // provide a cache directory where cache items should be stored
    cacheDirectory: resolve('.cache-loader')
  }
}

module.exports = [
  {
    test: /\.css$/,
    include: [resolve('node_modules')],
    use: [
      config.extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
      cacheLoader,
      'css-loader',
      'postcss-loader'
    ]
  },
  {
    // for ant design
    test: /\.less$/,
    include: /node_modules/,
    rules: [
      {
        use: [
          config.extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          lessLoader
        ]
      }
    ]
  },
  {
    // src
    test: /\.less$/,
    exclude: /node_modules/,
    rules: [
      {
        use: [
          config.extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            // 如果要开启cssModules则取消下面注释
            // options: {
            //   importLoaders: 1,
            //   modules: true,
            //   camelCase: true,
            //   localIdentName: '[local]___[hash:base64:8]'
            // }
          },
          'postcss-loader',
          lessLoader
        ]
      }
    ]
  }
]
