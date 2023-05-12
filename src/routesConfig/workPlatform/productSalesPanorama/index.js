const prefix = '/productSalesPanorama';
const suffix = 'cpid';

exports.routes = [
  {
    path: `${prefix}`,
    models: () => [import('../models/workPlatForm/productSalesPanorama')],
    component: '../layouts/productSalesPanorama/PageLayout',
    routes: [
      { // 产品销售全景 -- 首页
        path: `${prefix}/index/:queryParams`,
        models: () => [import('../models/workPlatForm/productSalesPanorama/profile')],
        component: './workPlatForm/productSalesPanorama/profile',
      },
      { // 产品销售全景 -- 客户列表
        path: `${prefix}/customerList/:queryParams`,
        models: () => [import('../models/workPlatForm/productSalesPanorama/customerList')],
        component: './workPlatForm/productSalesPanorama/customerList',
      },
    ],
  },
];
