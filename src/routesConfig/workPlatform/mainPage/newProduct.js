const prefix = 'newProduct';
// 产品相关路由
exports.routes = [
  { // 金融产品列表
    path: `${prefix}/financialProducts/:showActiveKey`,
    // exact: true,
    component: './workPlatForm/mainPage/newProduct/financialProducts',
  },
  // { // 理财客户列表
  //   path: `${prefix}/financialProducts/customerList/:activeKey`,
  //   // exact: true,
  //   component: './workPlatForm/mainPage/newProduct/financialProducts/manageCusList',
  // },
  { // 工作
    path: `${prefix}/work/:activeKey`,
    component: './workPlatForm/mainPage/newProduct/work',
  },
  { // 工作(一般事件)
    path: `${prefix}/commonWork`,
    component: './workPlatForm/mainPage/newProduct/work/commonWork',
  },
  { // ECIF-处理工作详情
    path: `${prefix}/works/dealListDetail/:customerCode`,
    component: './workPlatForm/mainPage/newProduct/work/dealListDetail',
  },
  { // ECIF-处理事件详情记录
    path: `${prefix}/works/dealListDetailRecord/:customerCode`,
    component: './workPlatForm/mainPage/newProduct/work/dealListDetailRecord',
  },
  { // 我的任务
    path: `${prefix}/myTask`,
    component: './workPlatForm/mainPage/newProduct/myTask',
  },
  { // 客户画像
    path: `${prefix}/customerPortrait/:customerCode`,
    component: './workPlatForm/mainPage/newProduct/customerPortrait',
  },
  { // 渠道管理
    path: `${prefix}/channelManagement`,
    component: './workPlatForm/mainPage/newProduct/channelManagement',
    isCache: '1',
  },
  { //新增渠道
    path: `${prefix}/addChannel`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/ChannelManagement/addChannel',
  },
  { //修改渠道
    path: `${prefix}/changeChannel`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/ChannelManagement/changeChannel',
  },
  { // 二维码管理
    path: `${prefix}/groupManagement`,
    component: './workPlatForm/mainPage/newProduct/groupManagement',
    isCache: '1',
  },
  { // 新增二维码
    path: `${prefix}/addGroup`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/addGroup',
  },
  { // 收益
    path: `${prefix}/earning/:customerCode`,
    component: './workPlatForm/mainPage/newProduct/earning',
  },
  { //修改二维码
    path: `${prefix}/changeGroup`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/changeGroup',
  },
  { //修改二维码
    path: `${prefix}/groupDetail`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/groupDetail',
  },
  { //下载二维码
    path: `${prefix}/download`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/download',
  },
  { // 渠道小组业绩
    path: `${prefix}/queryPerformance`,
    component: './workPlatForm/mainPage/newProduct/queryPerformance',
    isCache: '1',
  },
  { // 渠道客户查询
    path: `${prefix}/queryCustomer`,
    component: './workPlatForm/mainPage/newProduct/queryCustomer',
    isCache: '1',
  },
  { // 等级趋势数据分析
    path: `${prefix}/trendAlalysis`,
    component: './workPlatForm/mainPage/newProduct/trendAlalysis',
    isCache: '1',
  },
  { // 开户客户追踪
    path: `${prefix}/customerTracking`,
    component: './workPlatForm/mainPage/newProduct/customerTracking',
    isCache: '1',
  },
  { // 工资统计
    path: `${prefix}/wageStatistics`,
    component: './workPlatForm/mainPage/newProduct/wageStatistics',
    isCache: '1',
  },
  { // 开户数据分析
    path: `${prefix}/dataAnalysis`,
    component: './workPlatForm/mainPage/newProduct/dataAnalysis',
    isCache: '1',
  },
  { // 每月业绩
    path: `${prefix}/monthlyPerformance`,
    component: './workPlatForm/mainPage/newProduct/monthlyPerformance',
    isCache: '1',
  },
  { // 持仓总览
    path: `${prefix}/position/index/:customerCode`,
    component: './workPlatForm/mainPage/newProduct/position',
    isCache: '1',
  },
  { // 盈亏详情
    path: `${prefix}/position/profitDetail/:customerCode`,
    component: './workPlatForm/mainPage/newProduct/position/profitDetail',
  },
  { // 系统管理--客户管理--检核任务管理
    path: `/taskMan/index`,
    component: './workPlatForm/mainPage/newProduct/ecifPageChange/taskMan',
  },
  { // 系统管理--客户管理--检核审核管理
    path: `/checkMan/index`,
    component: './workPlatForm/mainPage/newProduct/ecifPageChange/checkMan',
  },
  { // 首页日历-->>事件管理列表
    path: `/eventComList/index`,
    component: './workPlatForm/mainPage/newProduct/ecifPageChange/eventComList',
  },
  { // 客户等级与权益
    path: `${prefix}/customerLevel`,
    component: './workPlatForm/mainPage/newProduct/customerLevel',
    isCache: '1',
  },
  { // 等级客户列表
    path: `${prefix}/customerList`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/CustomerLevel/CustomerList',
  },
  { //基金投顾销售业绩
    path: `${prefix}/salesPerformance`,
    component: './workPlatForm/mainPage/newProduct/salesPerformance',
  },
  { //客户交易明细
    path: `${prefix}/custransacDetails`,
    component: './workPlatForm/mainPage/newProduct/custransacDetails',
  },
  { //基金投顾定投
    path: `${prefix}/fundInvestment`,
    component: './workPlatForm/mainPage/newProduct/fundInvestment',
  },
  { // 员工主页
    path: `${prefix}/staff`,
    component: './workPlatForm/mainPage/newProduct/staff',
  },
  { // 业务机会
    path: `${prefix}/chance`,
    component: './workPlatForm/mainPage/newProduct/chance',
  },

  { // 产品机会
    path: `${prefix}/productChance`,
    component: './workPlatForm/mainPage/newProduct/productChance',
  },
  { // 工作统计
    path: `${prefix}/workStatistic`,
    component: './workPlatForm/mainPage/newProduct/workStatistic',
  },
  { // 权限列表
    path: `${prefix}/authList`,
    component: './workPlatForm/mainPage/newProduct/authList',
  },
  { // 客户持仓详情列表
    path: `${prefix}/optionDetail`,
    component: '../components/WorkPlatForm/MainPage/NewProduct/ProductChance/AclTool/optionDetail',
  },

];
