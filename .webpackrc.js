const {resolve} = require('path');

module.exports ={
  "es5ImcompatibleVersions": true,
  "entry": "src/index.js",
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  "proxy": {
    "/api": {
      "target": "http://172.24.128.78:9001/",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "/product" }
    },
    "/livebos": {
      "target": "http://172.24.128.78:9001/",
      "changeOrigin": true,
      "pathRewrite": { "^/livebos": "/livebos" }
    }
  },
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  alias: {
    '@': resolve('./src'),
    '@utils': resolve('./src/utils'),
    '@components': resolve('./src/components'),
    '@services': resolve('./src/services'),
    '@routes': resolve('./src/routes'),
    '@common': resolve('./src/components/Common'),
  },
  "ignoreMomentLocale": true,
  "theme": "./src/theme.js",
  "html": {
    "template": "./src/index.ejs"
  },
  "publicPath": "/",
  "hash": true
}
