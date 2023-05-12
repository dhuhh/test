const Intergration = require('./Intergration');
const MicroApp = require('./MicroApp');
const Customer = require('./Customer');
const newProduct = require('./newProduct');
const productSalesPanorama = require('../productSalesPanorama');
const businessStatement = require('./businessStatement');
const searchProcess = require('./searchProcess');
const customerPanorama = require('../customerPanorama');
const manageModule = require('./manageModule');
const activityComPage = require('./activityComPage');
const menuMerge = require('./menuMerge');

const customerAnalysis = require('./customerAnalysis');
const fortunrCalendar = require('./fortuneCalendar')

const rankingList = require('./rankingList');
const jiXiaoXiangQing = require('./jiXiaoXiangQing');
const JamLeaveTestPage = require("./JamLeaveTestRouter");
const EditTask = require('./EditTask');

const prefix = '';
exports.routes = [
  {
    path: `${prefix}/`,
    // models: () => [
    //   import('../models/workPlatForm/mainPage'),
    // ],
    component: "../layouts/index",
    routes: [
      {
        path: `${prefix}/loading`,
        component: "./Exception/loading"
      },
      {
        path: `${prefix}/routesMenu`,
        component: "./routesMenu"
      },
      {
        // C4流程中心页面单独处理
        path: `${prefix}/UIProcessor**`,
        component: "./intergration/iframeContent"
      },
      {
        // C4流程中心页面单独处理
        path: `${prefix}/wechat/WechatFriends`,
        component: "./workPlatForm/mainPage/weChatFriends/index"
      },
      // 集成iframe路由定义
      ...Intergration.routes,
      ...MicroApp.routes,
      ...Customer.routes,
      ...newProduct.routes,
      ...productSalesPanorama.routes, // 产品销售全景
      ...businessStatement.routes, // 港股通--业务报表
      ...searchProcess.routes, // 聚安一站通业务办理流程CRM查询
      ...customerPanorama.routes, // 客户全景
      ...manageModule.routes, // 系统管理和运维管理
      ...activityComPage.routes, // 客户财富--稳增长计划
      ...menuMerge.routes, // 菜单合并
      ...customerAnalysis.routes, // 客户分析
      ...rankingList.routes, //个人页面排行榜相关
      ...jiXiaoXiangQing.routes, //考核绩效详情页面
      ...EditTask.routes, //任务编辑页面
      ...fortunrCalendar.routes, //财富日历详情页
      ...JamLeaveTestPage.routes //财富日历详情页
    ]
  }
];
