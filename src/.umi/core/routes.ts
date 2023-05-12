// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from 'D:/anxin/crm_staff_web/ms-fe-basic/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/Loader/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/login",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__login' */'D:/anxin/crm_staff_web/ms-fe-basic/src/layouts/login'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/testPage/tsClassDemo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__testPage__tsClassDemo' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/testPage/tsClassDemo'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/testPage/tsFnDemo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__testPage__tsFnDemo' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/testPage/tsFnDemo'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/testPage/eUi",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__testPage__eUi' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/testPage/eUi'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/iconFont",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__Common__IconFont' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/Common/IconFont'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/layouts/index'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/loading",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Exception__loading' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/Exception/loading'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/routesMenu",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__routesMenu' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/routesMenu'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/UIProcessor**",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__intergration__iframeContent' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/intergration/iframeContent'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/wechat/WechatFriends",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__weChatFriends__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/weChatFriends/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/iframe/**",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__intergration__iframeContent' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/intergration/iframeContent'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/incidentialServices/valueManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__incidentialServices__valueManagement' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/incidentialServices/valueManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/incidentialServices/valueSearch",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__incidentialServices__valueManagement__valueSearch' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/incidentialServices/valueManagement/valueSearch'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/incidentialServices/customerBreak/:queryParams",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__incidentialServices__interruptCustomer__customerBreak' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/incidentialServices/interruptCustomer/customerBreak'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/incidentialServices/performanceAnalysis",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__incidentialServices__performanceAnalysis' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/incidentialServices/performanceAnalysis'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/incidentialServices/prodBreak/:queryParams",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__incidentialServices__interruptCustomer__prodBreak' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/incidentialServices/interruptCustomer/prodBreak'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customer/customerTags",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customer__customerTags' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customer/customerTags'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customer/enquire",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customer__enquire' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customer/enquire'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/financialProducts/:showActiveKey",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__financialProducts' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/financialProducts'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/work/:activeKey",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__work' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/work'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/commonWork",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__work__commonWork' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/work/commonWork'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/works/dealListDetail/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__work__dealListDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/work/dealListDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/works/dealListDetailRecord/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__work__dealListDetailRecord' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/work/dealListDetailRecord'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/myTask",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__myTask' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/myTask'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/customerPortrait/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__customerPortrait' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/customerPortrait'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/channelManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__channelManagement' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/channelManagement'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/addChannel",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__OpenAccountManagement__ChannelManagement__addChannel' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/ChannelManagement/addChannel'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/changeChannel",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__OpenAccountManagement__ChannelManagement__changeChannel' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/ChannelManagement/changeChannel'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/groupManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__groupManagement' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/groupManagement'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/addGroup",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__OpenAccountManagement__GroupManagement__addGroup' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/addGroup'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/earning/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__earning' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/earning'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/changeGroup",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__OpenAccountManagement__GroupManagement__changeGroup' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/changeGroup'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/groupDetail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__OpenAccountManagement__GroupManagement__groupDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/groupDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/download",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__OpenAccountManagement__GroupManagement__download' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement/download'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/queryPerformance",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__queryPerformance' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/queryPerformance'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/queryCustomer",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__queryCustomer' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/queryCustomer'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/trendAlalysis",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__trendAlalysis' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/trendAlalysis'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/customerTracking",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__customerTracking' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/customerTracking'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/wageStatistics",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__wageStatistics' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/wageStatistics'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/dataAnalysis",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__dataAnalysis' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/dataAnalysis'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/monthlyPerformance",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__monthlyPerformance' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/monthlyPerformance'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/position/index/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__position' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/position'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/position/profitDetail/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__position__profitDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/position/profitDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/taskMan/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__ecifPageChange__taskMan' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/ecifPageChange/taskMan'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/checkMan/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__ecifPageChange__checkMan' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/ecifPageChange/checkMan'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/eventComList/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__ecifPageChange__eventComList' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/ecifPageChange/eventComList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/customerLevel",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__customerLevel' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/customerLevel'), loading: LoadingComponent}),
        "isCache": "1",
        "exact": true
      },
      {
        "path": "/newProduct/customerList",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__CustomerLevel__CustomerList' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/CustomerLevel/CustomerList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/salesPerformance",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__salesPerformance' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/salesPerformance'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/custransacDetails",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__custransacDetails' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/custransacDetails'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/fundInvestment",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__fundInvestment' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/fundInvestment'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/staff",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__staff' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/staff'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/chance",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__chance' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/chance'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/productChance",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__productChance' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/productChance'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/workStatistic",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__workStatistic' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/workStatistic'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/authList",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__authList' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/authList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/optionDetail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__WorkPlatForm__MainPage__NewProduct__ProductChance__AclTool__optionDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/components/WorkPlatForm/MainPage/NewProduct/ProductChance/AclTool/optionDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/productSalesPanorama",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__productSalesPanorama__PageLayout' */'D:/anxin/crm_staff_web/ms-fe-basic/src/layouts/productSalesPanorama/PageLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/productSalesPanorama/index/:queryParams",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__productSalesPanorama__profile' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/productSalesPanorama/profile'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "path": "/productSalesPanorama/customerList/:queryParams",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__productSalesPanorama__customerList' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/productSalesPanorama/customerList'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "path": "/businessStatement/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__businessStatement__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/businessStatement/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/searchProcess",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__searchProcess__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/searchProcess/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerPanorama",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__customerPanorama__PageLayout' */'D:/anxin/crm_staff_web/ms-fe-basic/src/layouts/customerPanorama/PageLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/customerPanorama/customerInfo",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__customerInfo' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/customerInfo'), loading: LoadingComponent}),
            "key": "customerInfo",
            "exact": true
          },
          {
            "path": "/customerPanorama/position",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__position' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/position'), loading: LoadingComponent}),
            "key": "position",
            "isCache": "1",
            "exact": true
          },
          {
            "path": "/customerPanorama/earning",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__earning' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/earning'), loading: LoadingComponent}),
            "key": "earning",
            "exact": true
          },
          {
            "path": "/customerPanorama/customerPortrait",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__customerPortrait' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/customerPortrait'), loading: LoadingComponent}),
            "key": "customerPortrait",
            "exact": true
          },
          {
            "path": "/customerPanorama/accountAnalyse",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__accountAnalyse' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/accountAnalyse'), loading: LoadingComponent}),
            "key": "accountAnalyse",
            "exact": true
          },
          {
            "path": "/customerPanorama/assets",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__assetsPage' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/assetsPage'), loading: LoadingComponent}),
            "key": "assets",
            "exact": true
          },
          {
            "path": "/customerPanorama/assets_old",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__assetsPage_old' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/assetsPage_old'), loading: LoadingComponent}),
            "key": "assets_old",
            "exact": true
          },
          {
            "path": "/customerPanorama/transaction",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__transaction' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/transaction'), loading: LoadingComponent}),
            "key": "transaction",
            "exact": true
          },
          {
            "path": "/customerPanorama/transaction_test",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__transaction_test' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/transaction_test'), loading: LoadingComponent}),
            "key": "transaction_test",
            "exact": true
          },
          {
            "path": "/customerPanorama/investmentAdviser",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__investmentAdviser' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/investmentAdviser'), loading: LoadingComponent}),
            "key": "investmentAdviser",
            "exact": true
          },
          {
            "path": "/customerPanorama/serviceInfo",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__serviceInfo' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/serviceInfo'), loading: LoadingComponent}),
            "key": "serviceInfo",
            "exact": true
          },
          {
            "path": "/customerPanorama/changeLog",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__changeLog' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/changeLog'), loading: LoadingComponent}),
            "key": "changeLog",
            "exact": true
          },
          {
            "path": "/customerPanorama/adequacyDetail",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__adequacyDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/adequacyDetail'), loading: LoadingComponent}),
            "key": "adequacyDetail",
            "exact": true
          },
          {
            "path": "/customerPanorama/customerInfo/allInfo",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__customerPanorama__allInfo' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/customerPanorama/allInfo'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "path": "/customerPanorama/position/profitDetail",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__newProduct__position__profitDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/position/profitDetail'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "path": "/manage/system",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__manageModule__systemManagement' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/manageModule/systemManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/manage/maintain",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__manageModule__maintainManagement' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/manageModule/maintainManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/wealthGrowthPlan",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__activityComPage__wealthGrowthPlan' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/activityComPage/wealthGrowthPlan'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/lostCustomers",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__activityComPage__lostCustomers' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/activityComPage/lostCustomers'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/gainAlgorithm",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__activityComPage__gainAlgorithm' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/activityComPage/gainAlgorithm'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/redGoodStart",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__activityComPage__redGoodStart' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/activityComPage/redGoodStart'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/partnerAction",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__activityComPage__partnerAction' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/activityComPage/partnerAction'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/merge/**",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__menuMergePage' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/menuMergePage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/customerAssets",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__customerAssets' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/customerAssets'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/stockTransactions",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__stockTransactions' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/stockTransactions'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/tradingVolume",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__tradingVolume' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/tradingVolume'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/account",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__account' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/account'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/currentAssets",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__currentAssets' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/currentAssets'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/contribute",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__contribute' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/contribute'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/tradeSearch",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__tradeSearch' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/tradeSearch'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/positions",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__positions' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/positions'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/securities",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__securities' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/securities'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/customerAnalysis/transaction",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__customerAnalysis__transaction' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customerAnalysis/transaction'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/rankingList/staff",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__rankingList__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/rankingList/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/xqing",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__jiXiaoXiangQing__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/jiXiaoXiangQing/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/newProduct/EditTask",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__EditTask__EditTask' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/EditTask/EditTask.js'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/fortuneCalendar/detail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__mainPage__fortuneCalendar' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/fortuneCalendar'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/JamLeaveTestPage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__testPage__JamLeaveTestPage' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/testPage/JamLeaveTestPage.jsx'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "path": "/single/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__index' */'D:/anxin/crm_staff_web/ms-fe-basic/src/layouts/index'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/single/newProduct/commonWork",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__commonWork' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/commonWork'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/newProduct/chance",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__chance' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/chance'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/wealthGrowthPlan",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__wealthGrowthPlan' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/wealthGrowthPlan'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/lostCustomers",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__lostCustomers' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/lostCustomers'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/eventComList/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__eventComList' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/eventComList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/workStatistic",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__workStatistic' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/workStatistic'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/dealListDetail/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__dealListDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/dealListDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/dealListDetailRecord/:customerCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__dealListDetailRecord' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/dealListDetailRecord'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/checkMan/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__checkMan' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/checkMan'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/incidentialServices/customerBreak/:queryParams",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__customerBreak' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/customerBreak'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/incidentialServices/prodBreak/:queryParams",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__prodBreak' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/prodBreak'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/PartmentDetail/:queryParams",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__redPartmentDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/redPartmentDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/redGoodStart",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__redGoodStart' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/redGoodStart'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/partnerDetail/:queryParams",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__partnerDetail' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/partnerDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/partnerAction",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__partnerAction' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/partnerAction'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/rankingList/staff",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__workPlatForm__singlePage__rankingList' */'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/singlePage/rankingList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/single/epa",
        "microApp": "epa",
        "keepAlive": false,
        "exact": false,
        "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'epa', base: '/', masterHistoryType: 'hash', routeProps: {'settings':{}} })
        })()
      },
      {
        "path": "/epa/AssManage",
        "microApp": "epa",
        "keepAlive": false,
        "exact": false,
        "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'epa', base: '/', masterHistoryType: 'hash', routeProps: {'settings':{}} })
        })()
      },
      {
        "path": "/single/wechat",
        "microApp": "wechat",
        "keepAlive": false,
        "exact": false,
        "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'wechat', base: '/', masterHistoryType: 'hash', routeProps: {'settings':{}} })
        })()
      },
      {
        "path": "/wechat/WechatFriends",
        "microApp": "wechat",
        "keepAlive": false,
        "exact": false,
        "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'wechat', base: '/', masterHistoryType: 'hash', routeProps: {'settings':{}} })
        })()
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
