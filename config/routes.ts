// const exceptionRoutes = require('../src/routesConfig/Exception');
// const exceptionRoutesConfig = exceptionRoutes.routes;
const loginRoutes = require('../src/routesConfig/login');
const loginRoutesConfig = loginRoutes.routes;
const testPageRoutes = require('../src/routesConfig/testPage');
const testPageRoutesConfig = testPageRoutes.routes;
const mainPageRoutes = require('../src/routesConfig/workPlatForm/mainPage');
const mainPageRoutesConfig = mainPageRoutes.routes;
const singlePageRoutes = require('../src/routesConfig/workPlatForm/singlePage');
const singlePageRoutesConfig = singlePageRoutes.routes;
const IconFontRoutes = require('../src/routesConfig/IconFont');
const IconFontRoutesConfig = IconFontRoutes.routes;

export default {
  routeConfig: [
    // ...exceptionRoutesConfig, // 异常信息的相关路由信息
    ...loginRoutesConfig, // 登录页面相关路由信息
    ...testPageRoutesConfig, // 测试demo的相关路由信息
    ...IconFontRoutesConfig, // 图标库路由信息
    ...mainPageRoutesConfig, // 主页面相关路由信息
    ...singlePageRoutesConfig, // 单页面相关路由信息
  ],
};
