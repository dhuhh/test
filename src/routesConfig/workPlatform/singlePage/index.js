/* 此文件中所有路由页面均为其他页面的复制(单页面)，为了避免C4调C5时菜单框架嵌套的问题
 */
const MicroApp = require('./MicroApp');

const prefix = '/single';
exports.routes = [
  {
    path: `${prefix}/`,
    component: "../layouts/index",
    routes: [
      // {
      //   path: `${prefix}/singleTest`,
      //   component: './workPlatForm/singlePage/singleTest',
      // },
      {
        path: `${prefix}/newProduct/commonWork`,
        component: "./workPlatForm/singlePage/commonWork",
      },
      {
        path: `${prefix}/newProduct/chance`,
        component: "./workPlatForm/singlePage/chance",
      },
      {
        path: `${prefix}/wealthGrowthPlan`,
        component: "./workPlatForm/singlePage/wealthGrowthPlan",
      },
      {
        path: `${prefix}/lostCustomers`,
        component: "./workPlatForm/singlePage/lostCustomers",
      },
      {
        path: `${prefix}/eventComList/index`,
        component: "./workPlatForm/singlePage/eventComList",
      },
      {
        path: `${prefix}/workStatistic`,
        component: "./workPlatForm/singlePage/workStatistic",
      },
      {
        path: `${prefix}/dealListDetail/:customerCode`,
        component: "./workPlatForm/singlePage/dealListDetail",
      },
      {
        path: `${prefix}/dealListDetailRecord/:customerCode`,
        component: "./workPlatForm/singlePage/dealListDetailRecord",
      },
      {
        path: `${prefix}/checkMan/index`,
        component: "./workPlatForm/singlePage/checkMan",
      },
      {
        path: `${prefix}/incidentialServices/customerBreak/:queryParams`,
        component: "./workPlatForm/singlePage/customerBreak",
      },
      {
        path: `${prefix}/incidentialServices/prodBreak/:queryParams`,
        component: "./workPlatForm/singlePage/prodBreak",
      },
      {
        path: `${prefix}/PartmentDetail/:queryParams`,
        component: "./workPlatForm/singlePage/redPartmentDetail",
      },
      {
        path: `${prefix}/redGoodStart`,
        component: "./workPlatForm/singlePage/redGoodStart",
      },
      {
        path: `${prefix}/partnerDetail/:queryParams`,
        component: "./workPlatForm/singlePage/partnerDetail",
      },
      {
        path: `${prefix}/partnerAction`,
        component: "./workPlatForm/singlePage/partnerAction",
      },
      {
        path: `${prefix}/rankingList/staff`,
        component: "./workPlatForm/singlePage/rankingList"
      },
      ...MicroApp.routes,
    ],
  },
];