const prefix = 'manage';
// 首页菜单两个管理模块
exports.routes = [
  { // 系统管理
    path: `${prefix}/system`,
    component: './workPlatForm/mainPage/manageModule/systemManagement',
  },
  { // 运维管理
    path: `${prefix}/maintain`,
    component: './workPlatForm/mainPage/manageModule/maintainManagement',
  },
];
