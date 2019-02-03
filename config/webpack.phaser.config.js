const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    index: `./scripts/phaserCustomBuild.js`,
  },

  resolve: {
    alias: {
      eventemitter3: path.resolve('node_modules/eventemitter3'),
    },
    modules: ['node_modules/phaser/src'],
  },

  output: {
    path: path.resolve('src/phaser/'),
    filename: '[name].js',
    library: 'Phaser',
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
    devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]',
    umdNamedDefine: true,
  },

  performance: { hints: false },

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          ie8: false,
          ecma: 5,
        },
        warningsFilter: () => false,
      }),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof EXPERIMENTAL': JSON.stringify(false),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
    }),
    new CleanWebpackPlugin(['src/phaser'], {
      root: path.resolve(__dirname, '..'),
      verbose: true,
    }),
  ],

  devtool: 'source-map',
}
