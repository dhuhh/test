const prefix = '/customerPanorama';

exports.routes = [
  {
    path: `${prefix}`,
    component: '../layouts/customerPanorama/PageLayout',
    // isCache: '1',
    routes: [
      // 左侧菜单栏对应页面
      { // 客户概况
        path: `customerInfo`,
        component: './workPlatForm/customerPanorama/customerInfo',
        key: 'customerInfo',
      },
      { // 持仓
        path: `position`,
        component: './workPlatForm/mainPage/newProduct/position',
        key: 'position',
        isCache: '1',
      },
      { // 收益
        path: `earning`,
        component: './workPlatForm/mainPage/newProduct/earning',
        key: 'earning',
      },
      { // 画像
        path: `customerPortrait`,
        component: './workPlatForm/mainPage/newProduct/customerPortrait',
        key: 'customerPortrait',
      },
      { // 账户分析
        path: `accountAnalyse`,
        component: './workPlatForm/customerPanorama/accountAnalyse',
        key: 'accountAnalyse',
      },
      { // 资产
        path: `assets`,
        component: './workPlatForm/customerPanorama/assetsPage',
        key: 'assets',
      },
      { // 资产老版本
        path: `assets_old`,
        component: './workPlatForm/customerPanorama/assetsPage_old',
        key: 'assets_old',
      },
      { // 交易
        path: `transaction`,
        component: './workPlatForm/customerPanorama/transaction',
        key: 'transaction',
      },
      { // 交易2  老版本
        path: `transaction_test`,
        component: './workPlatForm/customerPanorama/transaction_test',
        key: 'transaction_test',
      },
      { // 投顾
        path: `investmentAdviser`,
        component: './workPlatForm/customerPanorama/investmentAdviser',
        key: 'investmentAdviser',
      },
      { // 服务信息
        path: `serviceInfo`,
        component: './workPlatForm/customerPanorama/serviceInfo',
        key: 'serviceInfo',
      },
      { // 变动日志
        path: `changeLog`,
        component: './workPlatForm/customerPanorama/changeLog',
        key: 'changeLog',
      },
      { // 适当性详情
        path: `adequacyDetail`,
        component: './workPlatForm/customerPanorama/adequacyDetail',
        key: 'adequacyDetail',
      },

      // 子页面
      { // 全部信息
        path: 'customerInfo/allInfo',
        component: './workPlatForm/customerPanorama/allInfo',
      },
      { // 盈亏详情
        path: `position/profitDetail`,
        component: './workPlatForm/mainPage/newProduct/position/profitDetail',
      },
    ],
  },
];
