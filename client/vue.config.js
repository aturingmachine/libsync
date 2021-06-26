/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  outputDir: '../core/dist/client',
  publicPath: '/client',
  devServer: {
    progress: false,
    stats: 'minimal',
    overlay: true,
    // proxy: {
    //   '/api': {
    //     target: 'localhost:3000/api',
    //   },
    // },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
}
