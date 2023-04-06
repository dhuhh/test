export default [
  {
    code: 'auth',
    key: 'auth',
    url: '/auth',
    dis: '登录接口',
  },
  {
    code: 'logout',
    key: 'logout',
    url: '/logout',
    dis: '退出接口',
  },
  {
    code: 'user',
    key: 'user',
    url: '/user',
    dis: '登录人信息',
  },
  {
    code: 'user',
    key: 'qryLoginPageConf',
    url: '/commonbase/v1/qryLoginPageConf',
    dis: '登录配置',
  },
  {
    code: 'user',
    key: 'captcha',
    url: '/auth/captcha/fetch',
    dis: '获取captcha',
  },
  {
    code: 'ssoLogin',
    key: 'ssoLogin',
    url: '/userLogin/ssoLogin',
    dis: '单点登录',
  },
  {
    code: 'ssoReceive',
    key: 'ssoReceive',
    url: '/userLogin/ssoReceive',
    dis: '单点回调接口',
  },
  {
    code: 'logoutSSO',
    key: 'logoutSSO',
    url: '/userLogin/logout',
    dis: '登出',
  },
  {
    code: 'appSSOLogin',
    key: 'appSSOLogin',
    url: '/userLogin/appSSOLogin',
    dis: 'H5产品中台登录',
  },
];
