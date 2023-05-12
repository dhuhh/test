const prefix = '';
// 客户相关路由
exports.routes = [
  { // 伴随服务
    path: `${prefix}/incidentialServices/valueManagement`,
    component: './workPlatForm/mainPage/incidentialServices/valueManagement',
  },
  { // 伴随服务价值查询
    path: `${prefix}/incidentialServices/valueSearch`,
    component: './workPlatForm/mainPage/incidentialServices/valueManagement/valueSearch',
  },
  { //伴随服务-中断客户360
    path: `${prefix}/incidentialServices/customerBreak/:queryParams`,
    component: './workPlatForm/mainPage/incidentialServices/interruptCustomer/customerBreak',
  },
  { //伴随服务-中断客户分析
    path: `${prefix}/incidentialServices/performanceAnalysis`,
    component: './workPlatForm/mainPage/incidentialServices/performanceAnalysis',
  },
  { //伴随服务-产品中断360
    path: `${prefix}/incidentialServices/prodBreak/:queryParams`,
    component: './workPlatForm/mainPage/incidentialServices/interruptCustomer/prodBreak',
  },
  { //客户标签
    path: `${prefix}/customer/customerTags`,
    component: './workPlatForm/mainPage/customer/customerTags',
  },
  { //客户标签
    path: `${prefix}/customer/enquire`,
    component: './workPlatForm/mainPage/customer/enquire',
  },
];
