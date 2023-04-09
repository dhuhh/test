/* eslint-disable import/no-duplicates */
import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, routerRedux } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Layout, message } from 'antd';
import lodash, { debounce } from 'lodash';
import MenuSider from './PageSider/MenuSider';
import PageHeader from './PageHeader';
import IframeContent from './iframeContent';
import ReactIframe from './reactIframe';
import { prefix } from '../../../../utils/config';
import NoAuthority from '../../../../routes/Exception/403';
import loading from '../../../../routes/Exception/loading';
import logo from '../../../../assets/newLogo-small.png';
import logoSmall from '../../../../assets/newLogo.png';
import { FetchMenu } from '../../../../services/amslb/user';
import { FetchUserMenuProject } from '../../../../services/commonbase';
import VisitedRoutes from './VisitedRoutes';

const { Content } = Layout;

class MainPageLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fetchMenuDatas = debounce(this.fetchMenuDatas, 300);
    // 获取菜单默认展开状态，0：不展开，1：展开
    const menuExpansion = localStorage.getItem('menuExpansion');
    this.state = {
      menuShow: menuExpansion === '1',
      collapsed: menuExpansion === '1',
      width: window.innerWidth,
      selectedMenuKeys: [], // 菜单选中key
      menuTree: [], // 获取登录用户的所有菜单项
      menuTreeLoaded: false, // 菜单是否加载
      name: '', // 当前菜单方案名称
    };
  }

  componentDidMount() {
    if (!this.props.hasAuthed) {
      // authPromise 向服务器发送认证请求，示例以Promise形式返回，result表示认证是否成功
      this.props.dispatch({
        type: 'global/checkAuth',
      });
    }

    // 设置应用名称
    const applicationName = localStorage.getItem('applicationName') || '产品中心';
    document.title = applicationName;

    // 重定向
    const beforeSsoLoginUrl = window.sessionStorage.getItem('beforeSsoLoginUrl') || '';
    const isNotSSO = window.location.href.indexOf('/ssoLogin') === -1;
    const isNotLoading = window.location.href.indexOf('/loading') === -1;
    const isNotIndex = window.location.href.indexOf('/index') === -1;
    if (isNotSSO && isNotLoading && isNotIndex && beforeSsoLoginUrl) {
      console.log(beforeSsoLoginUrl);
      window.location.href = beforeSsoLoginUrl;
      window.sessionStorage.removeItem('beforeSsoLoginUrl');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { menuTree = [], menuTreeLoaded } = this.state;
    const {
      theme,
      hasAuthed,
      location: { pathname, search },
    } = nextProps;
    const {
      location: { pathname: prePathname, search: preSearch },
    } = this.props;
    if (
      !menuTreeLoaded &&
      hasAuthed &&
      prePathname !== pathname &&
      preSearch !== search
    ) {
      // 获取默认菜单方案
      FetchUserMenuProject({})
        .then((response) => {
          const { records = [] } = response || [];
          const { name = 'JGCRMFA' } = records[0] || {};
          if (name !== this.state.name) {
            // 获取权限菜单树
            this.fetchMenuDatas(name, false, pathname.concat(search));
          }
        })
        .catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
    } else if (menuTreeLoaded) {
      this.changeSelected(pathname.concat(search), menuTree);
    }
    this.setStyle(theme);
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      // eslint-disable-next-line no-useless-return
      return;
    };
  }

  setStyle = (theme) => {
    document.getElementsByTagName('body')[0].className = `${theme}`;
  };

  // 获取宽度
  setWidth = () => {
    const width = window.innerWidth;
    this.setState({
      width,
    }, () => {
      if (width <= 1280) {
        this.setState({
          collapsed: false,
          menuShow: false,
        });
      } else if (width > 1280 && this.state.collapsed === false) {
        this.setState({
          collapsed: true,
          menuShow: true,
        });
      }
    });
  }

  // 菜单收起来
  onBreakpoint = () => {
    const { width } = this.state;
    if (width <= 1280) {
      this.setState({
        collapsed: false,
        menuShow: false,
      });
    } else {
      this.setState({
        collapsed: true,
        menuShow: true,
      });
    }
  }

  fetchMenuDatas = (name = '', isChangeTheme = false, purl = '') => {
    if (name === '') {
      this.setState({
        menuTreeLoaded: true,
      });
      return false;
    }
    FetchMenu({ project: name }).then((response) => {
      const { data = {} } = response;
      let menuTree =
        data.menuTree && data.menuTree.menu && data.menuTree.menu.item
          ? data.menuTree.menu.item
          : [];
      this.tmplMenuTree = menuTree;
      menuTree = this.handleMenuData();
      sessionStorage.setItem('menuTree', JSON.stringify(menuTree)); // menus接口返回的菜单信息
      if (isChangeTheme) {
        let url = this.getUrl(menuTree[0] || {});
        sessionStorage.setItem('projectIndex', url); // 将方案首页的url存起来
        let tempUrl = url;
        if (tempUrl.startsWith('{') && tempUrl.endsWith('}')) {
          tempUrl = JSON.parse(tempUrl);
          const urlType = tempUrl.type || 'ifm';
          if (urlType === 'ifm') {
            // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
            if (tempUrl.url.startsWith('http')) {
              url = `/iframe/${tempUrl.url}`;
            } else {
              url = `/iframe${tempUrl.url}`;
            }
          } else if (urlType === 'self') {
            window.location.href = tempUrl.url;
          } else if (urlType === 'page') {
            window.open(tempUrl.url);
          }
        }
        if (url) {
          this.props.dispatch(routerRedux.push(url));
        }
        const selectedKeys = this.findSelectedMenuKeys(url, menuTree) || [];
        console.log(selectedKeys);
        if (selectedKeys.length !== 0) {
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            selectedMenuKeys: selectedKeys,
            name,
          });
        } else {
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            name,
          });
        }
      } else if (purl) {
        if (purl === '/loading') {
          let tempUrl = this.getUrl(menuTree[0]);
          if (menuTree.length === 0) {
            this.props.dispatch(routerRedux.push('/building'));
          }
          if (tempUrl.startsWith('{') && tempUrl.endsWith('}')) {
            tempUrl = JSON.parse(tempUrl);
            const urlType = tempUrl.type || 'ifm';
            if (urlType === 'ifm') {
              // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
              if (tempUrl.url.startsWith('http')) {
                tempUrl = `/iframe/${tempUrl.url}`;
              } else {
                tempUrl = `/iframe${tempUrl.url}`;
              }
            } else if (urlType === 'self') {
              window.location.href = tempUrl.url;
            } else if (urlType === 'page') {
              window.open(tempUrl.url);
            }
          }
          if (tempUrl.startsWith('http')) {
            window.location.href = tempUrl;
          }
          this.props.dispatch(routerRedux.push(tempUrl));
        }
        const selectedKeys = this.findSelectedMenuKeys(purl, menuTree) || [];
        if (selectedKeys.length !== 0) {
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            selectedMenuKeys: selectedKeys,
            name,
          });
        } else {
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            name,
          });
        }
      } else {
        this.setState({
          menuTree,
          menuTreeLoaded: true,
          name,
        });
      }
    });
  };

  // 处理menu数据
  handleMenuData = (treeData) => {
    const menuTree = treeData || this.tmplMenuTree;
    menuTree.forEach((item, index) => {
      menuTree[index] = {
        ...item,
        url: item.url.indexOf('/UIProcessor') > -1 ? this.handleMenuUrl(`${item.url}&hideTitlebar=true`) : this.handleMenuUrl(item.url),
      };
      if (
        item.menu &&
        item.menu.item &&
        Array.isArray(item.menu.item) &&
        item.menu.item.length > 0
      ) {
        menuTree[index].menu.item = this.handleMenuData(item.menu.item);
      }
    });
    return menuTree;
  };
  // 处理menu的URL
  handleMenuUrl = (url) => {
    const repStr = '/livebos/UIProcessor';
    let tmplUrl = url;
    if (url.indexOf(repStr) < 0) {
      tmplUrl = tmplUrl.replace('/livebos/', '/');
    }
    return tmplUrl;
  };

  // 主题样式改变
  handleThemeChange = (theme) => {
    this.props.dispatch({
      type: 'global/changeTheme',
      payload: { theme },
    });
  };

  changeSelected = (url, menus) => {
    const selectedKeys = this.findSelectedMenuKeys(url, menus) || [];
    if (selectedKeys.length !== 0) {
      this.setState({
        selectedMenuKeys: selectedKeys,
      });
    }
  };

  findSelectedMenuKeys = (url, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      const currentKey = this.menuLangKey(item);
      if (item.menu && item.menu.item) {
        let tempKeys = [];
        tempKeys.push(currentKey);
        // 递归检查子菜单
        tempKeys = tempKeys.concat(this.findSelectedMenuKeys(url, item.menu.item));
        // 如果子菜单符合条件,那么就放到selectedKeys
        if (tempKeys.length > 1) {
          selectedKeys.push(...tempKeys);
          return false;
        }
      } else if (
        url !== '' &&
        url !== '/' &&
        url.indexOf(`${item.url}`) === 0
      ) {
        if (url !== item.url) {
          if (url.indexOf(`${item.url}/`) === 0) {
            selectedKeys.push(currentKey);
            return false;
          }
        } else {
          selectedKeys.push(currentKey);
          return false;
        }
      } else if (url.startsWith('{') && url.endsWith('}')) {
        let iframeUrl = JSON.parse(url);
        iframeUrl = iframeUrl.url || '';
        if (iframeUrl.startsWith('http')) {
          iframeUrl = `/iframe/${iframeUrl}`;
        } else {
          iframeUrl = `/iframe${iframeUrl}`;
        }
        if (url === iframeUrl) {
          selectedKeys.push(currentKey);
          return false;
        }
      } else if (
        url.startsWith('/iframe') &&
        item.url.startsWith('{') &&
        item.url.endsWith('}')
      ) {
        const tempObj = JSON.parse(item.url);
        if (
          tempObj.type === 'ifm' &&
          (tempObj.url === url.replace('/iframe', '') ||
            tempObj.url === url.replace('/iframe/', ''))
        ) {
          selectedKeys.push(currentKey);
          return false;
        }
      } else {
        // 如果没有匹配的,就清空数组
        selectedKeys.length = 0;
      }
      return true;
    });
    return selectedKeys;
  };

  getUrl = (item) => {
    // 找到目录的第一个菜单
    const url = lodash.get(item, 'url', '');
    if (!url && lodash.get(item, 'menu.item', []).length > 0) {
      return this.getUrl(lodash.get(item, 'menu.item', [])[0]);
    } else if (url) {
      return url;
    }
    return '';
  };

  menuLangKey = (item = {}) => {
    // 获取菜单的key
    const langKeys =
      lodash
        .get(item, 'title', [])
        .filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      menuShow: !this.state.menuShow,
    });
  };

  packageRoutes = (menuTree = [], routes = []) => {
    const results = [];
    routes.forEach((item) => {
      const ret = this.iterateRoutes(menuTree, item);
      if (ret.length > 0) {
        results.push(...ret);
      } else {
        // routes和menus接口数据进行比对，没有匹配到的默认为不缓存
        results.push({
          ...item,
          isCache: '1',
        });
      }
    });
    return results;
  };

  iterateRoutes = (menuTree, menuObj) => {
    const resultRoutes = [];
    const { path = '' } = menuObj;
    let tempPath = path;
    if (tempPath.indexOf('/:') !== -1) { tempPath = lodash.get(tempPath.split('/:'), '[0]', tempPath); }
    menuTree.every((item) => {
      const { url = '' } = item;
      const children = lodash.get(item, 'menu.item', []);
      if (children.length !== 0) {
        const childRoutes = this.iterateRoutes(children, menuObj);
        if (childRoutes.length > 0) {
          resultRoutes.push(...childRoutes);
          return false;
        }
      } else if (url === tempPath) {
        const describe = lodash.get(item, 'describe[0].text');
        let isCache = '1'; // 0:缓存|1:不缓存
        if (describe.indexOf('|') !== -1) {
          isCache = lodash.get(describe.split('|'), '[1]', '1');
        }
        resultRoutes.push({
          ...menuObj,
          isCache,
        });
        return false;
      } else {
        resultRoutes.length = 0;
      }
      return true;
    });
    return resultRoutes;
  };

  styleFcn = () => {
    const { menuTree = [], menuShow, width, collapsed } = this.state;
    let style = '';
    if (menuTree.length > 0) {
      if (width < 1280) {
        style = !menuShow ? '9.083rem 0.833rem 0 0.833rem' : '9.083rem 0.833rem 0 220px';
      } else {
        style = collapsed ? '9.083rem 0.833rem 0 220px' : '';
      }
    } else {
      style = '9.083rem 0.833rem 0 0';
    }
    return style;
  }

  render() {
    const {
      theme,
      userBasicInfo,
      hasAuthed,
      routes,
      location,
      dispatch,
      authUserInfo,
      messageDrop,
      messagesList,
    } = this.props;
    const {
      menuTree = [],
      menuTreeLoaded,
      menuShow,
      width,
      describe,
    } = this.state;
    const curl = location.pathname + location.search;
    if (!hasAuthed) {
      return null;
    }
    let toDefaultLink = {}; // eslint-disable-line
    if (menuTree !== null && menuTree.length > 0) {
      // 设置默认显示url
      const firstItem = menuTree[0] || {};
      let itemPath = '';
      // let fiframeUrl = '';
      if (firstItem.menu) {
        const secUrlTemp = lodash.get(firstItem, 'menu.item[0].url', '');
        if (secUrlTemp !== '') {
          // 不存在三级菜单
          itemPath = secUrlTemp;
        } else {
          // 存在三级菜单
          itemPath = lodash.get(firstItem, 'menu.item[0].menu.item[0].url', '');
        }
      } else {
        itemPath = firstItem.url || '';
      }
      if (itemPath.startsWith('{') && itemPath.endsWith('}')) {
        itemPath = JSON.parse(itemPath);
        const urlType = itemPath.type || 'ifm'; // ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
        if (urlType === 'ifm') {
          itemPath = itemPath.url.startsWith('http')
            ? `/iframe/${itemPath.url}`
            : `/iframe${itemPath.url}`;
        } else if (urlType === 'self') {
          if (curl === itemPath.url) {
            window.location.href = itemPath.url;
          }
        } else if (urlType === 'page') {
          if (curl === itemPath.url) {
            window.open(itemPath.url);
          }
        }
      }
      toDefaultLink = { pathname: itemPath }; // eslint-disable-line
    }
    // 处理菜单路径的后缀
    const finalMenuData = [];
    if (prefix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    const cacheRoutes = this.packageRoutes(menuTree, routes); // 组装routes,获取路由是否需要缓存
    sessionStorage.setItem('cacheRoutes', JSON.stringify(cacheRoutes)); // routeConfig配置信息(包含isCache)
    let situation = 'pc';
    const userAgent = navigator.userAgent.toLocaleLowerCase();
    const device = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
    if (device.test(userAgent)) {
      // 移动端
      situation = 'mobile';
    } else {
      // PC端
      situation = 'pc';
    }

    return (
      <Layout
        className={`${theme} ${menuShow ? 'm-layout' : 'hild-menu-box m-layout'}`}
        style={{ height: '100%', marginTop: situation === 'pc' ? '' : '-80px' }}
      >
        <MenuSider
          location={location}
          routes={routes}
          selectedMenuKeys={this.state.selectedMenuKeys}
          menuLangKey={this.menuLangKey}
          menuTree={menuTree}
          collapsed={this.state.collapsed}
          menuShow={menuShow}
          toggleCollapsed={this.toggleCollapsed}
          onBreakpoint={this.onBreakpoint}
          width={width}
          setWidth={this.setWidth}
          logo={logo}
          logoSmall={logoSmall}
        />
        <Layout className="m-layout" id="scrollContent">
          <PageHeader
            location={location}
            dispatch={dispatch}
            userBasicInfo={userBasicInfo}
            width={width}
            collapsed={this.state.collapsed}
            toggleCollapsed={this.toggleCollapsed}
            theme={theme}
            handleThemeChange={this.handleThemeChange}
            fetchMenuDatas={this.fetchMenuDatas}
            authUserInfo={authUserInfo}
            messageDrop={messageDrop}
            menuTree={menuTree}
            menuLangKey={this.menuLangKey}
            {...messagesList}
            styleFcn={this.styleFcn}
          />
          <Content
            className="m-layout-content react"
            style={{
              padding: this.styleFcn(),
            }}
          >
            {/* 访问过的url */}
            {
              situation === 'pc' ?
              (
                <VisitedRoutes
                  menuTree={menuTree}
                  menuCollapsed={this.state.collapsed}
                  menuTreeLoaded={menuTreeLoaded}
                  menuSchemeName={describe}
                  {...this.state}
                />
              )
              :
              null
            }
            <CacheSwitch>
              {
                // 路由
                routes.map(({ key, path, component }) => (
                  <CacheRoute
                    key={key || path}
                    path={path}
                    component={component}
                    unmount={false}
                    saveScrollPosition
                  />
                ))
              }
              <CacheRoute
                key="UIProcessor"
                path={`${prefix}/UIProcessor**`}
                component={IframeContent}
              />
              <CacheRoute
                key="StartWorkflow"
                path={`${prefix}/StartWorkflow**`}
                component={IframeContent}
              />
              <CacheRoute
                key="ShowWorkflow"
                path={`${prefix}/ShowWorkflow**`}
                component={IframeContent}
              />
              <CacheRoute
                key="WorkProcessor"
                path={`${prefix}/WorkProcessor**`}
                component={IframeContent}
              />
              <CacheRoute
                key="iframe"
                path={`${prefix}/iframe**`}
                component={ReactIframe}
              />
              {menuTree && menuTree.length > 0 && (
                <Redirect exact from={`${prefix}/`} to={toDefaultLink} />
              )}
              {menuTreeLoaded === true && menuTree.length === 0 && (
                <Redirect
                  exact
                  from={`${prefix}/`}
                  to={`${prefix}/404`}
                />
              )}
              {menuTreeLoaded === true && menuTree.length === 0 && (
                <Route render={NoAuthority} />
              )}
              {!menuTreeLoaded && (
                <Redirect exact from={`${prefix}/`} to={`${prefix}/loading`} />
              )}
              {!menuTreeLoaded && <Route render={loading} />}
            </CacheSwitch>

          </Content>
          <Content id="modalContent" />
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ global = {}, login, mainPage, messagesList }) => ({
  theme: global.theme || 'blue-dark-theme',
  hasAuthed: global.hasAuthed, // 判断用户token是否有效
  menuTree: global.menuTree || [],
  menuTreeLoaded: global.menuTreeLoaded,
  userBasicInfo: global.userBasicInfo,
  user: global.user,
  authUserInfo: global.authUserInfo,
  global,
  login,
  messageDrop: mainPage.messageDrop,
  messagesList,
}))(MainPageLayout);
