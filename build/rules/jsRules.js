const { cacheLoader } = require('./loaders');
const { resolve } = require('../utils/utils');
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = [
  {
    test: /\.(jsx|tsx|js|ts)$/,
    include: [resolve('src')],
    use: [
      cacheLoader,
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          // antd的按需引入
          getCustomTransformers: () => ({
            before: [ tsImportPluginFactory({
              libraryName: 'antd',
              libraryDirectory: 'lib',
              style: true
            })]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        },
      }
    ],
    exclude: /node_modules/
  }
]
