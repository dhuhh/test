const prefix = 'customerAnalysis';

// 客户分析
exports.routes = [
  { // 客户资产流入流出
    path: `${prefix}/customerAssets`,
    component: './workPlatForm/mainPage/customerAnalysis/customerAssets',
  },
  { // 个股成交排行
    path: `${prefix}/stockTransactions`,
    component: './workPlatForm/mainPage/customerAnalysis/stockTransactions',
  },
  { // 交易量排行
    path: `${prefix}/tradingVolume`,
    component: './workPlatForm/mainPage/customerAnalysis/tradingVolume',
  },
  { // 账户盈亏排行
    path: `${prefix}/account`,
    component: './workPlatForm/mainPage/customerAnalysis/account',
  },
  { // 资产排行
    path: `${prefix}/currentAssets`,
    component: './workPlatForm/mainPage/customerAnalysis/currentAssets',
  },
  { // 贡献排行
    path: `${prefix}/contribute`,
    component: './workPlatForm/mainPage/customerAnalysis/contribute',
  },
  { // 中端富裕客户分析
    path: `${prefix}/tradeSearch`,
    component: './workPlatForm/mainPage/customerAnalysis/tradeSearch',
  },
  { // 个股持仓排行
    path: `${prefix}/positions`,
    component: './workPlatForm/mainPage/customerAnalysis/positions',
  },
  { // 单只证券持仓排行
    path: `${prefix}/securities`,
    component: './workPlatForm/mainPage/customerAnalysis/securities',
  },
  { // 周转率排行
    path: `${prefix}/transaction`,
    component: './workPlatForm/mainPage/customerAnalysis/transaction',
  },
];