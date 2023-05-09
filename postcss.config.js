module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*','!border','!border-top','!border-left','!border-bottom','!border-right'],
      },
    },
  }