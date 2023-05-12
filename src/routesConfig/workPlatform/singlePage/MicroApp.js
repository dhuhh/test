exports.routes = [
  //fetchWebserviceFrnotEndConfig接口返回的name字段, 就是此处的epa
  { path: '/single/epa', microApp: 'epa', keepAlive: false },
  { path: '/epa/AssManage', microApp: 'epa', keepAlive: false },
  { path: '/single/wechat', microApp: 'wechat', keepAlive: false },
  { path: '/wechat/WechatFriends', microApp: 'wechat', keepAlive: false },
]