const prefix = '';
exports.routes = [
  {
    //客户财富--稳增长计划
    path: `${prefix}/wealthGrowthPlan`,
    component: "./workPlatForm/mainPage/activityComPage/wealthGrowthPlan",
  },
  {
    //客户--潜在客户流失管理
    path: `${prefix}/lostCustomers`,
    component: "./workPlatForm/mainPage/activityComPage/lostCustomers",
  },
  {
    //增益型算法卡方业绩
    path: `${prefix}/gainAlgorithm`,
    component: "./workPlatForm/mainPage/activityComPage/gainAlgorithm",
  },
  {
    //开门红
    path: `${prefix}/redGoodStart`,
    component: "./workPlatForm/mainPage/activityComPage/redGoodStart",
  },
  {
    //开门红
    path: `${prefix}/partnerAction`,
    component: "./workPlatForm/mainPage/activityComPage/partnerAction",
  },
];