import { defineConfig } from 'umi';
import { resolve } from 'path';
import proxy from './proxy';
import routes from './routes';
import themes from './theme';

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'png'];

export default defineConfig({
  title: '安信财富管家',
  hash: true,
  outputPath: './c5_basic',
  history: { type: 'hash' }, // hash|browser
  ignoreMomentLocale: true,
  devtool: 'eval', // source-map eval
  dva: {
    immer: true,
    hmr: true,
    skipModelValidate: true,
  },
  antd: {},
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [],
    },
    slave: {},
  },
  base: '/',
  dynamicImport: { // 按需加载
    loading: '@/components/Loader/index',
  },

  // // 配置 external
  // externals: {
  //   'react': 'window.React',
  //   'react-dom': 'window.ReactDOM',
  // },
  // // 引入被 external 库的 scripts
  // // 区分 development 和 production，使用不同的产物
  // scripts: process.env.NODE_ENV === 'development' ? [
  //   'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.development.js',
  //   'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.development.js',
  // ] : [
  //   'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
  //   'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
  // ],

  // 替换压缩器为 esbuild
  esbuild: {},

  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },

  extraBabelPlugins: [
    'babel-plugin-react-require',
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/favicon.ico',
  // polyfill: {
  //   imports: [
  //     'core-js/stable',
  //   ]
  // },
  theme: {
    ...themes,
  },
  targets: {
    ie: 11,
  },
  alias: {
    $services: resolve(__dirname, '../src/services'),
    $components: resolve(__dirname, '../src/components'),
    $config: resolve(__dirname, '../src/utils/config'),
    $models: resolve(__dirname, '../src/models'),
    $routes: resolve(__dirname, '../src/routes'),
    $themes: resolve(__dirname, '../src/themes'),
    $utils: resolve(__dirname, '../src/utils'),
    $pages: resolve(__dirname, '../src/pages'),
    $assets: resolve(__dirname, '../src/assets'),
    $common: resolve(__dirname, '../src/components/Common'),
  },
  proxy: {
    ...proxy,
  },
  routes: [
    // { path: '/', components: './index.js', }
    // {
    //   path: '/',
    //   component: '@/layouts/index',
    //   routes: [
    //     ...routes.routeConfig
    //   ],
    // }
    ...routes.routeConfig,
  ],
  chainWebpack: function(config: any, {}) {
    //过滤掉momnet的那些不使用的国际化文件
    config.plugin("replace").use(require("webpack").ContextReplacementPlugin).tap(() => {
      return [/moment[/\\]locale$/, /zh-cn/];
    });
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          algorithm: 'gzip', // 指定生成gzip格式
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), // 匹配哪些格式文件需要压缩
          threshold: 10240, //对超过10k的数据进行压缩
          minRatio: 0.6, // 压缩比例，值为0 ~ 1
        })
      );
    }
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            react: {
              name: 'react',
              priority: 20,
              test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)[\\/]/,
            },
            antd: {
              name: 'antd',
              priority: 20,
              test: /[\\/]node_modules[\\/](antd|@ant-design\/icons|@ant-design\/compatible|ant-design-pro)[\\/]/,
            },
            echarts: {
              name: 'echarts',
              priority: 20,
              test: /[\\/]node_modules[\\/]echarts|echarts-for-react|echarts-gl|echarts-liquidfill[\\/]/,
            },
            highcharts: {
              name: 'highcharts',
              priority: 20,
              test: /[\\/]node_modules[\\/](highcharts-exporting|highcharts-more|react-highcharts)[\\/]/,
            },
            recharts: {
              name: 'recharts',
              priority: 20,
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            },
            draftjs: {
              name: 'draftjs',
              priority: 20,
              test: /[\\/]node_modules[\\/](draftjs-to-html|draftjs-to-markdown)[\\/]/,
            },
            async: {
              chunks: 'async',
              minChunks: 2,
              name: 'async',
              maxInitialRequests: 1,
              minSize: 0,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      },
    });
  },
});
