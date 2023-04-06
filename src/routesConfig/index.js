import { suffix } from '../utils/config';
import exceptionRoutes from './Exception';
import ssoLoginRoutes from './ssoLogin';
import loginRoutes from './login';
import testPageRoutes from './testPage';
import mainPageRoutes from './workPlatform/mainPage';
import iconFontRoutes from './IconFont';
import singlePageRoutes from './workPlatform/singlePage';

const getRoutes = () => {
  const routes = {
    exceptionRoutes, // 异常信息的相关路由信息
    ssoLoginRoutes, // 单点登录
    loginRoutes, // 登录页面相关路由信息
    testPageRoutes, // 测试demo的相关路由信息
    mainPageRoutes, // 主页面相关路由信息
    iconFontRoutes, // 图标库路由信息
    singlePageRoutes, // 单页面
  };
  const suffixWithDot = `${suffix ? `.${suffix}` : ''}`;
  if (suffixWithDot) {
    Object.keys(routes).forEach((key) => {
      const routesArr = routes[key];
      routesArr.forEach((item, index) => {
        if (item.path) {
          routesArr[index].path = `${item.path}${suffixWithDot}`;
        }
      });
    });
  }
  return routes;
};

export default getRoutes;
