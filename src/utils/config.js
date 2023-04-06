const getAPIs = require('./api').default;

module.exports = {
  name: 'C5',
  APP_SECRET: 'apex.aas.pif.webapi',
  CLIENTID: 'c5::pc',
  prefix: '',
  suffix: '',
  ptlx: '产品中心',
  logo: '/logo.png',
  footerText: '武汉顶点软件有限公司 © 2020',
  api: getAPIs && getAPIs(),
};
