const prefix = '/iframe';
/**
 * 本路由将所有的iframe页面都走iframeContent组件，目的是防止不同组件切换产生的缓存失效问题
 */

exports.routes = [
  {
    path: `${prefix}/**`,
    component:'./intergration/iframeContent',
  },
  // {
  //   path: `${prefix}/**.sdo`,
  //   component:'./intergration/doIframeContent',
  // },
  // { // C4页面理财产品单独处理
  //   path: `${prefix}/plug-in/workplatform/ncrm.jsp**`,
  //   component:'./intergration/iframeContent',
  // },
  // { //首页单独处理
  //   path: `${prefix}/plug-in/workplatform/index.jsp**`,
  //   component:'./intergration/iframeContent',
  // },
  // { // livebos集成
  //   path: `${prefix}/UIProcessor**`,
  //   component:'./intergration/iframeContent',
  // },
  // {
  //   path: `${prefix}/OperateProcessor**`,
  //   component:'./intergration/iframeContent',
  // },
  // {
  //   path: `${prefix}/ShowWorkflow**`,
  //   component:'./intergration/iframeContent',
  // },
  // { // 报表导航页面
  //   path: `${prefix}/iframe**`,
  //   component:'./intergration/reactIframe',
  // },
  // { // 针对C4嵌C5的页面类型
  //   path: `${prefix}/bss/c5auth.sdo?**`,
  //   component:'./intergration/doIframeContent',
  // },
];
