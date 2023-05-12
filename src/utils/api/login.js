export default [
  { code: 'auth', key: 'auth', url: '/auth/singleAuth', dis: '登录接口' },
  { code: 'logout', key: 'logout', url: '/auth/logout', dis: '退出接口' },
  { code: 'adminAuth', key: 'adminAuth', url: '/auth', dis: '登录接口' }, // admin用户登录接口
  { code: 'adminLogout', key: 'adminLogout', url: '/logout', dis: '退出接口' }, // admin用户退出接口
  { code: 'user', key: 'user', url: '/user', dis: '登录人信息' },
  { code: 'tokenAuth', key: 'tokenAuth', url: '/token/auth', dis: '根据token登录' },
  { code: '', key: 'captchaFetchSms', url: '/auth/captcha/fetchSms', dis: '获取短信验证码' },
];
