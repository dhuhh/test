import React from 'react';
import { connect, routerRedux, router } from 'dva';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import classnames from 'classnames';
import { Layout, message, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import lodash, { debounce } from 'lodash';
import sensors from 'sa-sdk-javascript';
import { FetcUserMenuProject, FetchUrlAccessControl } from '../../../services/commonbase/index';
import NotPermit from '../../../pages/Exception/403';
import loading from '../../../pages/Exception/loading';
import TrackRouter from '../../../components/Common/Router/TrackRouter';
import { suffix } from '../../../utils/config';
import RecentlyVisiteUtils from '../../../utils/recentlyVisiteUtils';
import { FetchMenu } from '../../../services/amslb/user';
import Watermark from './Watermark';
import MenuSider from '../PageLayout/PageSider/MenuSider';
import SpecialUrl from './specialUrl';
import VisitedRoutes from "./VisitedRoutes";
import PageHeader from './PageHeader';
import logo from '../../../assets/pageLayout/logo1.svg';
import styles from './index.less';
const { Route, Redirect } = router;

const { Content } = Layout;
const prefix = '';

class MainPageLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.menuTreeLoaded = false; // 菜单是否加载
    this.startQiankun = debounce(this.startQiankun, 300);
    this.fetchMenuDatas = debounce(this.fetchMenuDatas, 200);
    // 获取菜单默认展开状态，0：不展开，1：展开
    const menuExpansion = localStorage.getItem('menuExpansion');
    // 定时请求，用来刷新session，防止会话过期
    this.refreshSessionTimer = null;
    this.state = {
      // collapsed: menuExpansion !== '1',
      collapsed: false, // 默认菜单展开
      selectedMenuKeys: [], // 菜单选中key
      menuTree: [], // 获取登录用户的所有菜单项
      menuTreeLoaded: false, // 菜单是否加载
      name: '', // 当前菜单方案名称
      describe: '', // 菜单方案描述
      withRoutes: [],
      allMenuRoutes: [], // 记录admin菜单权限所有的路由
      isIniframe:false,//merge系列被引用单页面，
    };
  }

  refreshSesionFunc = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/checkAuth',
      });
    }
  }

  componentDidMount() {
    if ((self.frameElement && self.frameElement.tagName == "IFRAME")||(self != top)||(window.frames.length != parent.frames.length)) { 
      this.setState({
        isIniframe:true
      })
    } 
    const {
      location: { pathname, search },
    } = this.props;
    this.initSensors();
    this.startQiankun();
    // 每隔5分钟，重新调用接口，防止会话过期
    this.refreshSessionTimer = setInterval(this.refreshSesionFunc, 1000 * 60 * 5);
    // 获取默认菜单方案
    FetcUserMenuProject({}).then((response) => {
      const { records = [] } = response || [];
      const { name = 'C5Base' } = records[0] || {};
      // 如果用户没有配菜单方案就跳转403
      if (!(records[0] || {}).name) {
        window.location.href = '/#/403';
        return;
      }else{
        // 获取权限菜单树
        this.fetchMenuDatas(name, false, pathname.concat(search));
      }
      this.setState({
        name,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    // 获取全部菜单路由的权限
    this.getUrlAccess();
  }

  componentWillUnmount() {
    clearInterval(this.refreshSessionTimer);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { menuTree = [], menuTreeLoaded } = this.state;
    const { hasAuthed, location: { pathname, search } } = nextProps;
    const { location: { pathname: prePathname, search: preSearch } } = this.props;
    let flag = !menuTreeLoaded && hasAuthed && prePathname !== pathname && preSearch !== search;
    if (prePathname === '/' && pathname === '/') {
      flag = true;
    }
    if (flag) {
      // 获取默认菜单方案
      FetcUserMenuProject({}).then((response) => {
        const { records = [] } = response || [];
        const { name = 'C5Base' } = records[0] || {};
        // 如果用户没有配菜单方案就跳转403
        if (!(records[0] || {}).name) {
          window.location.href = '/#/403';
          return;
        }
        if (name !== this.state.name) {
          // 获取权限菜单树
          this.fetchMenuDatas(name, false, pathname.concat(search), menuTree);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else if (menuTreeLoaded) {
      this.changeSelected(pathname.concat(search), menuTree);
    }
  }
  startQiankun = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'base/getApps',
    });
  }

  // 获取全部菜单路由的权限
  getUrlAccess = () => {
    FetchUrlAccessControl().then((response) => {
      const { code = 0, records = [] } = response || {};
      if(code > 0) {
        // 记录admin菜单权限所有的路由
        sessionStorage.setItem('allMenuRoutes', JSON.stringify(records));
        this.setState({
          allMenuRoutes: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 初始化埋点
  initSensors = () => {
    // 设置定时器，使得获取用户id和运行环境（测试/生产）后再初始化埋点
    const timer = setInterval(() => {
      const { sysParam = [] } = this.props;
      const serverName = sysParam.filter(item => item?.csmc === 'system.c4ym.url')[0]?.csz;
      let server_url = '';
      let env = '';
      if (serverName === 'https://crm.axzq.com.cn:8081') {
        server_url = 'https://sit-ubdt.axzq.com.cn/sa?project=production'; // 埋点测试环境地址
        env = 'stg';
      } else if (serverName === 'https://crm.essence.com.cn:8081') {
        server_url = 'https://ubdt.essence.com.cn/sa?project=production'; // 埋点生产环境地址
        env = 'prd';
      } else if (!serverName) {
        return;
      } else {
        clearInterval(timer);
        console.log('系统参数表环境域名地址（测试/生产）发生改变，埋点初始化失败');
        return;
      }
      let id = '';
      try {
        id = `${JSON.parse(sessionStorage.user).id}`;
      } catch (e) {
        return;
      }
      // 初始化
      sensors.init({
        server_url,
        // is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
        heatmap: {
          // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
          clickmap: 'not_collect',
          // 是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
          scroll_notice_map: 'not_collect',
        },
        name: 'sensors',
        show_log: env === 'prd' ? false : true,
        // batch_send: true,
        // batch_send: {
        //   datasend_timeout: 6000, // 一次请求超过多少毫秒的话自动取消，防止请求无响应。
        //   send_interval: 6000, // 间隔多少毫秒发一次数据。
        //   one_send_max_length: 6, // 一次请求最大发送几条数据，防止数据太大
        // },
        send_type: 'ajax',
      });
      // (sensors as any).quick('autoTrack'); //用于采集 $pageview 事件。
      // 注册公共属性
      sensors.register({
        platform_type: 'Web',
        sys_name: '员工端PC端',
      });
      // 用户登录
      sensors.login(id);
      clearInterval(timer);
      // 埋点初始化成功
      console.log('埋点初始化成功');
    }, 300);
  }
  getUrl = (item) => { // 找到目录的第一个菜单
    let url = lodash.get(item, 'url', '');
    if (url === '/') url = '/index';
    if (!url && lodash.get(item, 'menu.item', []).length > 0) {
      return this.getUrl(lodash.get(item, 'menu.item', [])[0]);
    } else if (url) {
      return url;
    }
    return '';
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  menuLangKey = (item = {}) => { // 获取菜单的key
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  // 处理menu数据
  handleMenuData = (treeData) => {
    const menuTree = treeData || this.tmplMenuTree;
    menuTree.forEach((item, index) => {
      menuTree[index] = {
        ...item,
        url: this.handleMenuUrl(item.url),
      };
      if (item.menu && item.menu.item && Array.isArray(item.menu.item) && item.menu.item.length > 0) {
        menuTree[index].menu.item = this.handleMenuData(item.menu.item);
      }
    });
    return menuTree;
  }
  // 处理menu的URL
  handleMenuUrl = (url) => {
    const repStr = '/livebos/UIProcessor';
    let tmplUrl = url;
    if (url.indexOf(repStr) < 0) {
      tmplUrl = tmplUrl.replace('/livebos/', '/');
    }
    return tmplUrl;
  }
  // 获取权限菜单树
  fetchMenuDatas = async (name = '', isChangeTheme = false, purl = '') => {
    if (name === '') {
      this.setState({
        menuTreeLoaded: true,
      });
      return false;
    }
    await FetchMenu({ project: name }).then((response) => {
      try{
        const { data = {} } = response;
        const { describe } = data;
        let menuTree = data.menuTree && data.menuTree.menu && data.menuTree.menu.item ? data.menuTree.menu.item : [];
        const systemObjData = { // 用于菜单列表展示系统管理
          object: "manage_system",
          title: [
            {
              lang: "",
              text: "系统管理",
            },
          ],
          describe: [
            {
              lang: "",
              text: "系统管理",
            },
          ],
          objectType: 48,
          windowType: 0,
          helpUrl: "",
          attribute: 0,
          iconUrl: "icon-xtgl_normal;icon-xtgl_selected",
          customUrl: "",
          url: "/manage/system",
        };
        const maintainObjData = { // 用于菜单列表展示运维管理
          object: "manage_maintain",
          title: [
            {
              lang: "",
              text: "运维管理",
            },
          ],
          describe: [
            {
              lang: "",
              text: "运维管理",
            },
          ],
          objectType: 48,
          windowType: 0,
          helpUrl: "",
          attribute: 0,
          iconUrl: "icon-ywgl_normal;icon-ywgl_selected",
          customUrl: "",
          url: "/manage/maintain",
        }; 
        /**
      * 由于接口中系统管理或运维管理是多层数据，所以需要手动添加两个一维数组，方便展示
      * 顺序为【系统管理(systemObjData)，运维管理(maintainObjData)，系统管理（可能存在）A，运维管理（可能存在）B】
      * 此时前两个手动添加的一定存在，后续再去判断是否保留
      */
        const len = menuTree.length;
        if(len > 0 && menuTree[len - 1]['title'][0]['text'] === '运维管理') { // 存在B
          if (len > 1 && menuTree[len - 2]['title'][0]['text'] === '系统管理') { // 存在A和B
            // 手动添加系统管理和运维管理的一维数据，用于菜单栏展示
            menuTree.splice(len - 2, 0, systemObjData, maintainObjData);
          } else { // 存在B，不存在A
            menuTree.splice(len - 1, 0, systemObjData, maintainObjData);
          }
        } else if (len > 0 && menuTree[len - 1]['title'][0]['text'] === '系统管理') { // 存在A，不存在B
          menuTree.splice(len - 1, 0, systemObjData, maintainObjData);
        } else { // A,B都不存在
          menuTree.push(systemObjData);
          menuTree.push(maintainObjData);
        }
        this.tmplMenuTree = menuTree;
        menuTree = this.handleMenuData();
        // 如果用户有菜单方案无菜单，跳转无菜单异常页面
        if (menuTree.length === 0) {
          window.location.href = '/#/exceptionPage/noMenu';
          this.setState({
            menuTree,
          });
          return;
        }
        if (isChangeTheme) {
          let url = this.getUrl(menuTree[0] || {});
          let tempUrl = url;
          if (tempUrl.startsWith('{') && tempUrl.endsWith('}')) {
            tempUrl = JSON.parse(tempUrl);
            const urlType = tempUrl.type || 'ifm';
            if (urlType === 'ifm') { // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
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
          // url = urlType === '' ? tempUrl.url || '' : `/iframe/${tempUrl.url}`;
          }
          if (url) {
            this.props.dispatch(routerRedux.push(url));
          }
          const selectedKeys = this.findSelectedMenuKeys(url, [{ menu: { item: menuTree } }]) || [];
          if (selectedKeys.length !== 0) {
          // menuTreeLoaded = true;
            this.setState({
              menuTree,
              menuTreeLoaded: true,
              selectedMenuKeys: selectedKeys,
              name,
              describe,
            });
          } else {
          // this.menuTreeLoaded = true;
            this.setState({
              menuTree,
              menuTreeLoaded: true,
              name,
              describe,
            });
          }
        } else if (purl) {
          if (purl === '/loading' || purl === '/') {
            let tempUrl = this.getUrl(menuTree[0]);
            if (menuTree.length === 0) {
              this.props.dispatch(routerRedux.push('/building'));
            }
            if (tempUrl.startsWith('{') && tempUrl.endsWith('}')) {
              tempUrl = JSON.parse(tempUrl);
              const urlType = tempUrl.type || 'ifm';
              if (urlType === 'ifm') { // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
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
          const selectedKeys = this.findSelectedMenuKeys(purl, [{ menu: { item: menuTree } }]) || [];
          if (selectedKeys.length !== 0) {
          // this.menuTreeLoaded = true;
            this.setState({
              menuTree,
              menuTreeLoaded: true,
              selectedMenuKeys: selectedKeys,
              name,
              describe,
            });
          } else {
          // this.menuTreeLoaded = true;
            this.setState({
              menuTree,
              menuTreeLoaded: true,
              name,
              describe,
            });
          }
        } else {
        // this.menuTreeLoaded = true;
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            name,
            describe,
          });
        }
      } catch(error){
        console.log('error: ',error);
      };
    });
  }
  // 主题样式改变
  handleThemeChange = (theme) => {
    this.props.dispatch({
      type: 'global/changeTheme',
      payload: { theme },
    });
  }
  changeSelected = (url, menus) => {
    const selectedKeys = this.findSelectedMenuKeys(url, [{ menu: { item: menus } }]) || [];
    if (selectedKeys.length !== 0) {
      this.setState({
        selectedMenuKeys: selectedKeys,
      });
    }
  }

  // 此方法逻辑为假设有顶部菜单的逻辑，原来第一层为顶部菜单，第二层为左侧菜单，现在没有顶部菜单，传入第一层就为左侧菜单，所以传参时需要手动添加一层
  findSelectedMenuKeys = (url, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      const curentKey = this.menuLangKey(item);
      // 为菜单合并的二级页面时, 去掉其子项递归的逻辑，否则会导致selectedKeys被清空
      if(item.menu && item.menu.item && url.startsWith('/merge') && url === item.url) {
        selectedKeys.push(curentKey);
        return false;
      }
      if (item.menu && item.menu.item) {
        let tempKeys = [];
        tempKeys.push(curentKey);
        // 递归检查子菜单
        tempKeys = tempKeys.concat(this.findSelectedMenuKeys(url, item.menu.item));
        // 如果子菜单符合条件,那么就放到selectedKeys
        if (tempKeys.length > 1) {
          selectedKeys.push(...tempKeys);
          return false;
        }
      } else if (url !== '' && url !== '/' && url.indexOf(`${item.url}`) === 0) {
        if (url !== item.url) {
          if (url.indexOf(`${item.url}/`) === 0) {
            selectedKeys.push(curentKey);
            return false;
          }
        } else {
          selectedKeys.push(curentKey);
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
          selectedKeys.push(curentKey);
          return false;
        }
      } else if (url.startsWith('/iframe') && item.url.startsWith('{') && item.url.endsWith('}')) {
        const tempObj = JSON.parse(item.url);
        if (tempObj.type === 'ifm' && (tempObj.url === url.replace('/iframe', '') || tempObj.url === url.replace('/iframe/', ''))) {
          selectedKeys.push(curentKey);
          return false;
        }
      } else {
        // 如果没有匹配的,就清空数组
        selectedKeys.length = 0;
      }
      return true;
    });
    return selectedKeys;
  }
  /**
   * 路由后缀处理
   */
  concatSuffix = (menuData) => {
    const suffixWithDot = `${suffix ? `.${suffix}` : ''}`;
    return menuData.map((item) => {
      const finalItem = { ...item };
      if (item.url && !item.url.endsWith(suffixWithDot)) {
        finalItem.url = `${item.url}${suffixWithDot}`;
      }
      if (item.menu && item.menu.length > 0) {
        finalItem.menu = this.concatSuffix(item.menu);
      }
      return finalItem;
    });
  }
  iterateRoutes = (menuTree, menuObj) => {
    const resultRoutes = [];
    const { path = '' } = menuObj;
    let tempPath = path;
    if (tempPath.indexOf('/:') !== -1) tempPath = lodash.get(tempPath.split('/:'), '[0]', tempPath);
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
  }
  packageRoutes = (menuTree = [], routes = []) => {
    const results = [];
    routes.forEach((item) => {
      const ret = this.iterateRoutes(menuTree, item);
      if (ret.length > 0) {
        results.push(...ret);
      } else { // routes和menus接口数据进行比对，没有匹配到的默认为不缓存
        results.push({
          ...item,
          // isCache: '1',
          isCache: '0', // 很多iframe绝对路径和route中的对不上，所以这里改成缓存
        });
      }
    });
    return results;
  }
  pageTrack = async (loc, preLoc) => { // eslint-disable-line
    // ApexCountAction.recordPage(loc.pathname, preLoc ? preLoc.pathname : '', `{from:${linkToName(loc.pathname)},to:${linkToName(preLoc ? preLoc.pathname : '')}}`);
    // 获取签署状态标识
    const { pathname: preLocPath = '' } = preLoc || {};
    const { pathname: plocPath = '', search = '' } = loc || {};
    if (preLocPath.indexOf('confidentiality') > 0 || plocPath.indexOf('login') > 0) {
      return false;
    }
    RecentlyVisiteUtils.saveRecentlyVisiteUtils(plocPath, search);
  };

  // 排除用户没有权限的C5页面路由，C4的页面会在iframeContent组件进行排除
  getNeedRoutes = (routes) => {
    const { allMenuRoutes } = this.state;
    let urlList = []; // qx为0时表示当前用户没有这个路由的查看权限
    allMenuRoutes.forEach((item) => {
      if(item.qx === '0' && !urlList.includes(item.url)) {
        urlList.push(item.url);
      }
    });
    // 如果allMenuRoutes中存在与无权限数组(urlList)中相同的路由且qx='1'，则从无权限数组中去掉
    allMenuRoutes.forEach((item)=>{
      if(urlList.includes(item.url) && item.qx === '1') {
        urlList.splice(urlList.indexOf(item.url), 1);
      }
    });
    // 有权限就返回路由
    let tmpRoutes = routes.filter((item)=>{
      return (!urlList.includes(item.path));
    });
    return tmpRoutes;
  }

  render() {
    const { history, theme, authorities = {}, dispatch, isHideMenu = false, route = {}, userBusinessRole, location, userBasicInfo = {}, authUserInfo, dictionary, base = {} } = this.props;
    const { apps } = base;
    const routes = lodash.get(route, 'routes', []);
    // 过滤掉没有权限的路由
    const tmpRoutes = this.getNeedRoutes(routes);
    let contentStyle = '';
    const curl = location.pathname + location.search;
    if (curl.includes('UIProcessor') || curl.includes('/iframe/')) { //  如果为livebos页面，则修改content正文部分的样式
      // contentStyle = 'iframeContent';
    } else if (isHideMenu || lodash.get(location, 'pathname', '').indexOf('/system/monitor/view') !== -1) { // 如果是放大页面或者是系统监控页面(/system/monitor)，则不需要边距
      contentStyle = 'noPadding'; //  如果为放大页面，则修改content正文部分的样式
    }
    const { hasAuthed } = this.props;
    const { menuTree = [], name = '', menuTreeLoaded, describe } = this.state;
    if (!hasAuthed) {
      return null;
    }
    let toDefaultLink = {}; // eslint-disable-line
    if (menuTree.length > 0) {
      // 设置默认显示url
      const firstItem = menuTree[0] || {};
      let itemPath = '';
      // let fiframeUrl = '';
      if (firstItem.menu) {
        const secUrlTemp = lodash.get(firstItem, 'menu.item[0].url', '');
        if (secUrlTemp !== '') { // 不存在三级菜单
          itemPath = secUrlTemp;
        } else { // 存在三级菜单
          itemPath = lodash.get(firstItem, 'menu.item[0].menu.item[0].url', '');
        }
      } else {
        itemPath = firstItem.url || '';
      }
      if (itemPath.startsWith('{') && itemPath.endsWith('}')) {
        itemPath = JSON.parse(itemPath);
        const urlType = itemPath.type || 'ifm'; // ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
        if (urlType === 'ifm') {
          itemPath = itemPath.url.startsWith('http') ? `/iframe/${itemPath.url}` : `/iframe${itemPath.url}`;
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
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    // 此处为顶部菜单选择某模块的逻辑，现去掉顶部菜单，不需要此操作
    // const currentMenuData = finalMenuData.filter((item) => {
    //   const tempKey = this.menuLangKey(item);
    //   return tempKey === this.state.selectedMenuKeys[0];
    // });
    // 此处为获取模块子item逻辑，现去掉顶部菜单，不需要此操作
    // const subMenuTree = lodash.get(currentMenuData[0], "menu.item", []);

    /**
     * 权限数组中一定存在两个元素，即运维管理和系统管理的一层数据，用于展示，
       可能存在两个元素，即系统管理或运维管理的多层数据，用于接收卡片信息
       顺序为【系统管理A，运维管理B，系统管理（可能存在）C，运维管理（可能存在）D】
     */
    //  console.log('finalMenuData=============', finalMenuData);
    const len = finalMenuData.length;
    let showList = []; // 展示数据
    let systemManageTree = {}; // 系统管理数据
    let maintainManageTree = {}; // 运维管理数据

    if(len > 0 && finalMenuData[len - 1] && finalMenuData[len - 1].menu){ // 存在系统管理或运维管理的权限
      if(finalMenuData[len - 1]['title'][0]['text'] === '系统管理'){ // 只有系统管理的权限
        showList = finalMenuData.slice(0, len - 2); //D不存在，去掉BC
        systemManageTree = finalMenuData[len - 1];
      } else { // 存在运维管理，但不确定是否存在系统管理
        if(finalMenuData[len - 2]['title'][0]['text'] === '运维管理'){ // 两个运维管理的名字相邻，说明只有运维管理权限
          showList = finalMenuData.slice(0, len - 1); // C不存在，去掉D
          showList.slice(len - 3, 1); // 去掉A
          maintainManageTree = finalMenuData[len - 1];
        } else { // 系统管理和运维管理权限都存在
          showList = finalMenuData.slice(0, len - 2); // 去掉CD
          systemManageTree = finalMenuData[len - 2];
          maintainManageTree = finalMenuData[len - 1];
        }
      }
    } else { // 没有系统管理或运维管理的权限
      showList = finalMenuData.slice(0, len - 2); // 没有CD，去掉AB
    }

    let manageNum = 0; //系统管理，运维管理权限存在的数量

    const subMenuTree = showList; // 由于现在卡片路由的接口是从menus传出，所以需要截取出展示的数据
    // 卡片页面接收该字段
    if(JSON.stringify(systemManageTree) !== '{}') {sessionStorage.setItem('systemManageTree', JSON.stringify(systemManageTree)); manageNum++;}
    if(JSON.stringify(maintainManageTree) !== '{}') {sessionStorage.setItem('maintainManageTree', JSON.stringify(maintainManageTree)); manageNum++;}

    sessionStorage.setItem('menuTree', JSON.stringify(menuTree)); // menus接口返回的菜单信息
    const cacheRoutes = this.packageRoutes(menuTree, tmpRoutes); // 组装routes,获取路由是否需要缓存
    sessionStorage.setItem('cacheRoutes', JSON.stringify(cacheRoutes)); // routeConfig配置信息(包含isCache)
    // 底端空白处理
    let isSonApp = false;
    apps.forEach((item) => {
      if (curl.startsWith(item.base)) {
        isSonApp = true;
      }
    });
    const sonAppHeight = isSonApp ? '100%' : '0';
    // 是否开启水印
    const isOpenSecureMarker = localStorage.getItem('openSecureMarker') === '1';
    // 判断是否为特殊链接
    const specialUrl = SpecialUrl.filter(item => location.pathname.startsWith(item));
    // 是否有历史地址
    const oldURl = localStorage.getItem('oldURl') || '';

    const { pathname = '' } = location;
    const isIframe = pathname.startsWith('/iframe');
    let bottomLen = '25px';
    let isWork = false;
    let isMerge = false;
    // 服务记录页面特殊处理
    if(pathname === '/iframe/bss/ncrm/ncustomer/serviceRecord/page/index.sdo'){
      bottomLen = '40px';
    }
    // 客户概况页面特殊处理
    if(pathname === '/iframe/bss/ncrm/ncustomer/customerList/customerProfiling/page/customerProfiling.sdo'){
      bottomLen = '40px';
    }
    // 待办，消息页面特殊处理
    if(pathname.startsWith('/newProduct/work/backlog') || pathname.startsWith('/newProduct/work/message')) {
      isWork = true;
    }
    // livebos页面特殊处理
    if(pathname.startsWith('/iframe/UIProcessor')){
      bottomLen = '35px';
    }
    // 合并页面也隐藏最外层滚动条，在合并页面组件内部去判断
    if(pathname.startsWith('/merge')){
      isMerge = true;
    }
    // 解决滚动条重复问题
    const hideScroll = {
      height: '100%',
      paddingBottom: isIframe ? bottomLen : '0',
      overflowY: isIframe || isWork || isMerge ? 'hidden' : 'auto',
    };
    // console.log('最终路由===============', routes, tmpRoutes);

    return hasAuthed ? (
      <Layout className={theme} style={{ minHeight: "100%", height: "100%" }}>
        {!this.state.isIniframe&&<Layout.Header className="m-header-xin" style={{ padding: 0 }}>
          <div className="logo" />
          <PageHeader
            // style={{ display: isHideMenu ? 'none' : '' }}
            theme={theme}
            fetchMenuDatas={this.fetchMenuDatas}
            name={name}
            menuTree={menuTree}
            menuSchemeName={describe}
            menuLangKey={this.menuLangKey}
            handleThemeChange={this.handleThemeChange}
            location={location}
            logo={logo}
            dispatch={dispatch}
            userBasicInfo={userBasicInfo}
            dictionary={dictionary}
            userBusinessRole={userBusinessRole}
            authUserInfo={authUserInfo}
            // messageDrop={messageDrop}
            authorities={authorities}
          />
        </Layout.Header>}
        <Layout
          className="m-layout m-layout-xin"
          id="scrollContent"
          style={{ height: "100%" }}
        >
          {!this.state.isIniframe&&<Layout.Sider
            id="siderContent"
            trigger={null}
            collapsible
            collapsed={subMenuTree.length === 0 ? true : this.state.collapsed}
            collapsedWidth={subMenuTree.length === 0 ? 0 : 50}
            width={176}
          >
            <MenuSider
              location={location}
              routes={tmpRoutes}
              selectedMenuKeys={this.state.selectedMenuKeys}
              menuLangKey={this.menuLangKey}
              subMenuTree={subMenuTree}
              style={{ display: isHideMenu ? "none" : "" }}
              collapsed={this.state.collapsed}
              toggleCollapsed={this.toggleCollapsed}
              dispatch={dispatch}
              manageNum={manageNum}
            />
          </Layout.Sider>}
          <Layout id="htmlContent" style={hideScroll}>
            <Content
              className={
                contentStyle === ""
                  ? "m-layout-content"
                  : classnames(styles[contentStyle], "m-layout-content")
              }
            >
              {/* 访问过的url */}
              {!this.state.isIniframe&&<VisitedRoutes
                menuTree={menuTree}
                menuCollapsed={this.state.collapsed}
                menuTreeLoaded={menuTreeLoaded}
                menuSchemeName={describe}
              />}
              <CacheSwitch>
                {
                  // 路由
                  tmpRoutes.map(({ key, path, component }) => (
                    <CacheRoute
                      key={key || path}
                      path={path}
                      // component={component}
                      children={(props) => {
                        const C = component;
                        return <C routes={tmpRoutes} {...props} />;
                      }}
                    />
                  ))
                }
                {menuTree && menuTree.length > 0 && (
                  <Redirect exact from={`${prefix}/`} to={toDefaultLink} />
                )}
                {menuTreeLoaded && menuTree.length === 0 && (
                  <Redirect exact from={`${prefix}/`} to={`${prefix}/404`} />
                )}
                {menuTreeLoaded && menuTree.length === 0 && (
                  <Route render={NotPermit} />
                )}
                {!menuTreeLoaded && (
                  <Redirect
                    exact
                    from={`${prefix}/`}
                    to={`${prefix}/loading`}
                  />
                )}
                {!menuTreeLoaded && <Route render={loading} />}
              </CacheSwitch>
            </Content>
            <Content id="modalContent" />
          </Layout>
        </Layout>
      </Layout>
    ) : null;
  }
}

export default connect(({ global = {}, mainPage, base = {} }) => ({
  theme: global.theme || 'anxin-dark-theme',
  isHideMenu: global.isHideMenu,
  userBusinessRole: global.userBusinessRole,
  hasAuthed: global.hasAuthed, // 判断用户token是否有效
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
  authUserInfo: global.authUserInfo,
  authorities: global.authorities,
  messageDrop: mainPage.messageDrop,
  base: base,
  sysParam: global.sysParam,
}))(MainPageLayout);
