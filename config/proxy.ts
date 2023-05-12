export default {
  '/api': {
    // target: 'http://218.66.59.169:41621',
    target: 'https://crm.axzq.com.cn:8084',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
  },
  '/ftq': {
    // target: 'http://10.97.244.42:8084',
    target: 'https://crm.axzq.com.cn:8084',
    changeOrigin: true,
    pathRewrite: { '^/ftq': '/ftq' },
  },
  '/livebos': {
    target: 'http://218.66.59.169:41621',
    // target: 'http://192.168.0.86',
    changeOrigin: true,
    pathRewrite: { '^/livebos': '/livebos' },
  },
  '/bd': {
    target: 'http://218.66.59.169:41621',
    // target: 'http://192.168.0.86',
    changeOrigin: true,
    pathRewrite: { '^/bd': '/bd' },
  },
  '/digital': {
    target: 'http://218.66.59.169:41621',
    // target: 'http://192.168.0.86',
    changeOrigin: true,
    pathRewrite: { '^/digital': '/digital' },
  },
};
