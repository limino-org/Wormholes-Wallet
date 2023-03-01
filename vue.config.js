
const isProduct = process.env.VUE_APP_NODE_ENV == 'production' || process.env.VUE_APP_NODE_ENV == 'test' ? true : false
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  productionSourceMap: isProduct ? false : true,
  publicPath: isProduct ? '/wallet/' : '',
  devServer: {
    https: false,
    proxy: {
      '/createExchange': {
        target: 'http://192.168.1.235:9006',
        changeOrigin: true,
        pathRewrite: {
          '^/createExchange': ''
        }
      },
      '/nodeApi': {
        target: 'http://api.wormholestest.com:8555',
        changeOrigin: true,
        pathRewrite: {
          '^/nodeApi': ''
        }
      },
      '/serviceApi': {
        target: 'http://api.wormholestest.com:8090',
        changeOrigin: true,
        pathRewrite: {
          '^/serviceApi': ''
        }
      },
      '/wormholesApi': {
        target: 'https://api.wormholestest.com',
        changeOrigin: true,
        pathRewrite: {
          '^/wormholesApi': ''
        }
      },
      '/exchangeApi': {
        target: 'http://192.168.1.235:9006',
        changeOrigin: true,
        pathRewrite: {
          '^/exchangeApi': ''
        }
      },
      '/contractApi': {
        target: 'http://43.132.176.185:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/contractApi': ''
        }
      },


      '/exchans': {
        target: 'http://192.168.1.235:9006',
        changeOrigin: true,
        pathRewrite: {
          '^/exchans': ''
        }
      },

      '/walletIframe': {
        target: 'http://192.168.27.48:8080/wallet/#/',
        changeOrigin: true,
        pathRewrite: {
          '^/walletIframe': ''
        }
      },
      '/nftApi': {
        target: 'http://43.129.181.130:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/nftApi': ''
        }
      }
    }
  },

  configureWebpack: config => {
    if (isProduct) {
      config.plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
           compress: {
             drop_console: true,
             drop_debugger: true,
           },
           warnings: false,
         },
         sourceMap: false,
         parallel: false
      }))
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      // config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
      //   "console.log"
      // ];

    }
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxAsyncRequests: 10,
      maxInitialRequests: 10,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
          reuseExistingChunk: true
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 2,
          priority: 0,
          reuseExistingChunk: true
        },
        vant: {
          name: 'vant',
          priority: 20,
          test: /[\\/]node_modules[\\/]vant[\\/]/
        },
        ethers: {
          name: 'ethers',
          priority: 20,
          test: /[\\/]node_modules[\\/]ethers[\\/]/
        },
        moment: {
          name: 'moment',
          priority: 20,
          test: /[\\/]node_modules[\\/]moment[\\/]/
        },
        element_plus: {
          name: 'element_plus',
          priority: 20,
          test: /[\\/]node_modules[\\/]element-plus[\\/]/
        },
        web3: {
          name: 'web3',
          priority: 20,
          test: /[\\/]node_modules[\\/]web3[\\/]/
        },
        vuex_persistedstate:{
          name:"vuex-persistedstate",
          priority: 20,
          test: /[\\/]node_modules[\\/]vuex-persistedstate[\\/]/
        },
        ethereumjs:{
          name: "ethereumjs",
          priority: 20,
          test: /[\\/]node_modules[\\/]@ethereumjs[\\/]/
        }
        
      }
    }
    config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 15,
    }),)

  },
}
