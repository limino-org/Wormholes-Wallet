module.exports = {
  presets: ["es2015","@vue/cli-plugin-babel/preset"],

  "plugins": [
    [
      "import",
      {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      },
      "vant"
    ],
  ]
}
