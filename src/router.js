import React from 'react';
import { Route } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import dynamic from 'dva/dynamic';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import getRoutes from './routesConfig';
import styles from './index.less';
import TrackRouter from './components/Common/Router/TrackRouter';
import { prefix } from './utils/config';
import RecentlyVisiteUtils from './utils/recentlyVisiteUtils';

// 将history导出,以便于其它非dva的地方有使用到链接跳转
export let history; // eslint-disable-line

const outerScope = {
  set history(val) {
    history = val;
  },
};

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

const dynamicWrapperInner = (app, dynamics) => dynamic({
  app,
  ...dynamics,
});

// wrapper of dynamic
const dynamicWrapperOuter = (app, exceptionRoutes, routes) => dynamic({
  app,
  ...routes[0],
  component: () => {
    // 获取根路由对象和其它对象,根目录对象用于布局,默认设置为第一个
    const [route, ...otherRoutes] = routes;
    // 下级路由动态加载包装
    const childrenRoutes = otherRoutes.map((item) => {
      const { key, path, ...dynamics } = item;
      return {
        key,
        path,
        component: dynamicWrapperInner(app, dynamics),
      };
    });
    // 异常路由
    exceptionRoutes.forEach((item) => {
      const { key, path, ...dynamics } = item;
      const pathCombine = `${route.path}${path}`.replace('//', '/'); // 异常路由的路径需要加上前缀
      childrenRoutes.push({
        key,
        path: pathCombine,
        component: dynamicWrapperInner(app, dynamics),
      });
    });
    return route.component().then((raw) => {
      const Component = raw.default || raw;
      // 将dynamic,app和otherRoutes传入菜单布局组件中
      return props => <Component {...props} dynamic={dynamic} app={app} routes={childrenRoutes} />;
    });
  },
});

const pageTrack = async (loc, preLoc) => { // eslint-disable-line
  const { pathname: plocPath = '', search = '' } = loc || {};
  RecentlyVisiteUtils.saveRecentlyVisiteUtils(plocPath, search);
};


function RouterConfig({ history, app }) { // eslint-disable-line
  outerScope.history = history; // 这里赋值
  const { loginRoutes, testPageRoutes, mainPageRoutes, exceptionRoutes, iconFontRoutes, ssoLoginRoutes, singlePageRoutes } = getRoutes();
  const LoginPageComponent = dynamicWrapperOuter(app, exceptionRoutes, loginRoutes);
  const IconFontComponent = dynamicWrapperOuter(app, exceptionRoutes, iconFontRoutes);
  const TestPageComponent = dynamicWrapperOuter(app, exceptionRoutes, testPageRoutes);
  const MainPageComponent = dynamicWrapperOuter(app, exceptionRoutes, mainPageRoutes);
  const SsoLoginPageComponent = dynamicWrapperOuter(app, exceptionRoutes, ssoLoginRoutes);
  const SinglePageComponent = dynamicWrapperOuter(app, exceptionRoutes, singlePageRoutes);

  return (
    <LocaleProvider locale={zhCN}>
      <TrackRouter history={history} onEnter={(loc, preLoc) => { pageTrack(loc, preLoc); }}>
        <CacheSwitch>
          <Route path={`${prefix}/ssoLogin`} render={props => <SsoLoginPageComponent {...props} />} />
          <Route path={`${prefix}/login`} render={props => <LoginPageComponent {...props} />} />
          <Route path={`${prefix}/single`} render={props => <SinglePageComponent {...props} />} />
          <Route path={`${prefix}/iconFont`} render={props => <IconFontComponent {...props} />} />
          <Route path={`${prefix}/testPage`} render={props => <TestPageComponent {...props} />} />
          <CacheRoute path={`${prefix}/`} render={props => <MainPageComponent {...props} />} />
        </CacheSwitch>
      </TrackRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
