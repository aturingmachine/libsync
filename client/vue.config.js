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
    index: '',
    proxy: {
      // '/ws': {
      //   target: 'ws://localhost:3000',
      //   ws: true,
      // },
      '/api': {
        target: 'http://localhost:3000',
      },
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
}
