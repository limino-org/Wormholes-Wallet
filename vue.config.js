
const isProduct = process.env.VUE_APP_NODE_ENV == 'production'  ? true : false
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
console.warn('isProduct', isProduct,process.env.NODE_ENV)
const needCdn = process.env.VUE_APP_NODE_ENV == 'production' || process.env.VUE_APP_NODE_ENV == 'test' ? true : false
const htmlWebpackPlugin = require('html-webpack-plugin')
const cdn = {
  css:[

  ],
  js:[
  ]
}
const externals = {
  //  ethers:'ethers',
  //  web3:'Web3',
  //  moment:'moment',
  //  element_plus:'element_plus',
}
const newCdns =  needCdn ? cdn : {css:[],js:[]}
module.exports = {
  productionSourceMap: !isProduct,
  transpileDependencies: [/node_modules/],
  publicPath: isProduct ? '/wallet/' : './',
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
        target: 'http://43.129.181.130:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/contractApi': ''
        }
      },
      '/nftaimint': {
        target: 'http://192.168.1.235:18081',
        changeOrigin: true,
        pathRewrite: {
          '^/nftaimint': ''
        }
      },
      '/exchans': {
        target: 'http://192.168.1.235:9006',
        changeOrigin: true,
        pathRewrite: {
          '^/exchans': ''
        }
      },
      "/aiApi": {
        target: 'http://192.168.1.237:18081',
        changeOrigin: true,
        pathRewrite: {
          '^/aiApi': ''
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
      },
  
    }
  },
  configureWebpack: config => {
    if(process.env.VUE_APP_NODE_ENV != 'development') {
      config.externals = externals
    }
    // if(process.env.VUE_APP_NODE_ENV == 'development') {
    //   config.plugins.push(new htmlWebpackPlugin({
    //     template: path.join(__dirname,'./src/public/index.html'),
    //     filename:'index.html'
    //   }))
    // }
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    if(process.env.VUE_APP_NODE_ENV == 'test') {
      config.plugins.push(new UglifyJsPlugin({
         sourceMap: false,
         parallel: false
      }))
    }
    if (process.env.VUE_APP_NODE_ENV == 'production') {
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
        vue: {
          name: 'module_1',
          priority: 20,
          test: /[\\/]node_modules[\\/]vue[\\/]/
        },
        vuex: {
          name: 'module_2',
          priority: 20,
          test: /[\\/]node_modules[\\/]vuex[\\/]/
        },
        vant: {
          name(){
            return 'module_3'
          },
          priority: 20,
          test: /[\\/]node_modules[\\/]vant[\\/]/
        },
        ethers: {
          name(){
            return 'module_4'
          },
          priority: 20,
          test: /[\\/]node_modules[\\/]ethers[\\/]/
        },
        web3: {
          name(){
            return 'module_5'
          },
          priority: 20,
          test: /[\\/]node_modules[\\/]web3[\\/]/
        },
        moment: {
          name(){
            return 'module_6'
          },
          priority: 20,
          test: /[\\/]node_modules[\\/]moment[\\/]/
        },
        element_plus: {
          name(){
            return 'module_7'
          },
          priority: 20,
          test: /[\\/]node_modules[\\/]element-plus[\\/]/
        },
        'vuex-persistedstate':{
          name:"vuex-persistedstate",
          priority: 20,
          test: /[\\/]node_modules[\\/]vuex-persistedstate[\\/]/
        },
        'crypto-js':{
          name(){
            return 'module_8'
          },
          priority: 20,
          test: /[\\/]node_modules[\\/]crypto-js[\\/]/
        },
        'localStorage':{
          name:"module_9",
          priority: 20,
          test: /[\\/]node_modules[\\/]localStorage[\\/]/
        },
        
      }
    }
    config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 15,
    }),)

  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      console.log(JSON.stringify(newCdns))
      args[0].jsCDN = newCdns
      return args
    })
  }
}
