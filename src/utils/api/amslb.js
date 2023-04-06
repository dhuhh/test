export default [
  {
    code: 'access', key: 'access', url: '/amslb/user/access', dis: '根据Livebos权限验证用户是否允许操作某功能',
  },
  {
    code: 'auths', key: 'auths', url: '/amslb/user/auths', dis: '获取当前登录用户的功能权限',
  },
  {
    code: 'pwd', key: 'pwd', url: '/amslb/user/change/pwd', dis: '修改用登录密码',
  },
  {
    code: 'menu', key: 'menu', url: '/amslb/user/menus', dis: '获取登录用户的所有菜单项',
  },
  {
    code: 'homeAuths', key: 'homeAuths', url: '/amslb/user/menus', dis: '获取首页展示权限',
  },
  {
    code: '', key: 'link', url: '/amslb/dynamic/link', dis: 'livebos扩展',
  },
];
