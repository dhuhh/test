import React from 'react';
import { Row, Col, Tabs, Affix, Dropdown, Menu, Icon } from 'antd';
import lodash from 'lodash';
import { withRouter, Link } from 'dva/router';
// import debounce from 'lodash/debounce';
import { suffix } from '../../../utils/config';
import RecentlyVisiteUtils from '../../../utils/recentlyVisiteUtils';
import LocalPathUtils from '../../../utils/localPathUtils';
import close from '$assets/pageLayout/close.png';
import tag from '$assets/pageLayout/down_tag.png';
import { DecryptBase64 } from '$components/Common/Encrypt';
import IframeContent from '$pages/intergration/iframeContent';
import DoIframeContent from '$pages/intergration/doIframeContent';

class VisitedRoutes extends React.Component {
  constructor(props) {
    super(props);
    // this.onChangeHistory = debounce(this.onChangeHistory, props.wait);
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    this.isFirstRender = true;
    this.state = {
      urls: recentlyVisitedUrls,
      isVisible: false, // 控制右侧下拉菜单是否显示
    };
  }

  UNSAFE_componentWillMount() {
    this.unlisten = this.props.history.listen(this.onChangeHistory);
  }

  componentWillUnmount() {
    this.unlisten();
    // LocalPathUtils.cleanRouterList();
  }

  onChangeHistory = (e = {}) => {
    setTimeout(() => {
      const { pathname = '', search = '' } = e;
      let tmpl = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
      // 排除首页问题产生的多余路由
      if (tmpl.indexOf(`${pathname}${search}|`) < 0 && pathname !== '/' && pathname !== '' && search !== '?title=%E9%A6%96%E9%A1%B5&url=/bss/ncrm/home/page/index.sdo&display=none') {
        if(pathname !== '/iframe/UIProcessor'){ 
          tmpl.push(`${pathname}${search}|`);
        }
        // 团队客户查询页面路由是/iframe/UIProcessor开头，所以特殊处理
        if(search.startsWith('?Table=JspTDKH')) {
          tmpl.push(`${pathname}${search}|`);
        }
      }
      if(tmpl.includes('|')){
        tmpl.splice(tmpl.indexOf('|'), 1);
      }
      // 无菜单但是要有页签的页面特殊处理
      // 用户新建人群
      const labelCircle = tmpl.filter((m) => { return m.startsWith('/dgt/user/newCrowd/labelCircle'); });
      const importCrowd = tmpl.filter((m) => { return m.startsWith('/dgt/user/newCrowd/importCrowd'); });
      const groupSpread = tmpl.filter((m) => { return m.startsWith('/dgt/user/newCrowd/groupSpread'); });
      const combination = tmpl.filter((m) => { return m.startsWith('/dgt/user/newCrowd/combination'); });
      // 客户新建人群
      const cusImportCrowd = tmpl.filter((m) => { return m.startsWith('/dgt/customer/importCrowd'); });
      // 员工主页
      const staffHomePage = tmpl.filter((m) => { return m.startsWith('/newProduct/staff'); });
      // 待办，消息
      const todoPage = tmpl.filter((m) => { return m.startsWith('/newProduct/work/backlog'); });
      const messagePage = tmpl.filter((m) => { return m.startsWith('/newProduct/work/message'); });
      
      // tmpl = tmpl.filter((m) => { // 把菜单中没有返回的剔除出去
      //   const tempIndex = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { 
      //     // 当页面为iframe页面时，判断是否包含路由，例如/iframe/ShowWorkflow?....包含/iframe/ShowWorkflow
      //     if(tempItem.url.indexOf('/iframe') >= 0){
      //       return tempItem.url.includes(m.substring(0, m.indexOf('|')));
      //     }
      //     return tempItem.url === m.substring(0, m.indexOf('|'));
      //   });
      //   if (tempIndex > -1 || m.indexOf('/wm/')>-1) {
      //     return true;
      //   }
      //   return false;
      // });
      // 处理的路由 只保留一个路由
      // if (labelCircle.length > 0) {
      //   tmpl.push(labelCircle[labelCircle.length - 1]);
      // }
      // if (importCrowd.length > 0) {
      //   tmpl.push(importCrowd[importCrowd.length - 1]);
      // }
      // if (groupSpread.length > 0) {
      //   tmpl.push(groupSpread[groupSpread.length - 1]);
      // }
      // if (combination.length > 0) {
      //   tmpl.push(combination[combination.length - 1]);
      // }
      // if (cusImportCrowd.length > 0) {
      //   tmpl.push(cusImportCrowd[cusImportCrowd.length - 1]);
      // }
      // if (staffHomePage.length > 0) {
      //   tmpl.push(staffHomePage[staffHomePage.length - 1]);
      // }
      // if (todoPage.length > 0) {
      //   tmpl.push(todoPage[todoPage.length - 1]);
      // }
      // if (messagePage.length > 0) {
      //   tmpl.push(messagePage[messagePage.length - 1]);
      // }
      if (RecentlyVisiteUtils.mapUrls.length === 0) {
        tmpl = [];
      }
      let urls = tmpl;
      if (tmpl.length > 10) {
        urls = tmpl.slice(-10);
      }
      // 首页要保留
      // if (tmpl.includes('/index|')) {
      //   urls = urls.filter(m => m !== '/index|');
      //   urls = ['/index|', ...urls];
      // }
      //刷新保留当前页面
      if(JSON.stringify(tmpl) === '[]'){
        const { pathname = '', search = '' } = this.props.location;
        // 每次刷新后，路由中的‘首页’汉字就会变成%E9%A6%96%E9%A1%B5，需做特殊处理
        if(search === '?title=%E9%A6%96%E9%A1%B5&url=/bss/ncrm/home/page/index.sdo&display=none'){
          tmpl.push(`${pathname}?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none|`);
        } else {
          tmpl.push(`${pathname}${search}|`);
        }
        // tmpl.push(`${pathname}${search}|`);
      }
      sessionStorage.setItem('recentlyVisited', tmpl);
      this.setState({
        urls,
      });
    }, 100);
  }

  getNameAndUrl = (value) => { // 遍历目录树 找到url 和name
    const { url = '', title = [], menu = {} } = value;
    if (url && title.length > 0) {
      let aUrl = '';
      if (url.indexOf('{') === 0) {
        const ob = JSON.parse(url);
        aUrl = ob.url;
        if (ob.type === 'ifm') {
          aUrl = `/iframe${aUrl}`;
        }
      } else {
        aUrl = url;
      }
      RecentlyVisiteUtils.mapUrls.push({
        url: aUrl,
        name: title[0].text,
      });
    }
    if (Reflect.has(menu, 'item')) {
      menu.item.forEach((tempItem) => {
        this.getNameAndUrl(tempItem);
      });
    }
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

  // 删除路由
  handleDeleteUrl = (url = '') => {
    const { location: { pathname: prefixPath = '', search: suffixPath = '' } } = this.props; // livebos 页面会存在带?号的路由
    let currentPath = prefixPath + suffixPath;
    if(suffixPath === '?title=%E9%A6%96%E9%A1%B5&url=/bss/ncrm/home/page/index.sdo&display=none'){
      currentPath = prefixPath + '?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none';
    }
    // 删除对象缓存
    const urls = RecentlyVisiteUtils.mapUrls || [];
    const tmpl = urls.filter(item => item.url !== url);
    RecentlyVisiteUtils.mapUrls = tmpl;
    let recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    // 如果关闭的不是当前页签，不用跳转
    if (url === currentPath || currentPath.startsWith(url)) {
    // 跳转到临近的url（优先前一个）
      let tmplHrefs = recentlyVisitedUrls.filter(m => m !== '/loading|');
      tmplHrefs = tmplHrefs.map(m => m.replace('|', ''));
      const tmplIndex = tmplHrefs.findIndex(m => m === url);
      const tmplArr = [tmplHrefs[tmplIndex - 1], tmplHrefs[tmplIndex + 1]];
      const tmplHref = tmplArr[0] ? tmplArr[0] : tmplArr[1];
      window.location.href = `/#${tmplHref}`;
    }
    // 删除session缓存
    const tmplSesn = recentlyVisitedUrls.filter(item => item.indexOf(`${url}|`) < 0);
    sessionStorage.setItem('recentlyVisited', tmplSesn);
    // 删除组件缓存
    this.setState({
      urls: tmplSesn,
    });
  }

  // 点击tab跳转,value值为路由#后对应的内容
  tabLinkHref = (value) => {
  }

  // 右边下拉菜单
  getExtraDropdownMenu = () => {
    // 关闭Tabs
    const closeTabs = (type) => { // 0全部，1其他
      const { urls: cuUrls = [] } = this.state;
      const { location: { pathname = '', search = '' }, menuTree } = this.props;
      // 删除对象缓存
      const urls = RecentlyVisiteUtils.mapUrls || [];
      let tmpl = [];
      if (type === 1) {
        tmpl = urls.filter(item => item.url === `${pathname}${search}`);
      } else if (type === 0) {
        tmpl = [];
      }
      RecentlyVisiteUtils.mapUrls = tmpl;
      // 删除session缓存
      const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
      // 删除session缓存
      let tmplSesn = [];
      if (type === 1) {
        // 关闭其他时，recentlyVisitedUrls中显示‘首页’，search则为‘%E9%A6%96%E9%A1%B5’，需转化一下
        let tmpSearch = search;
        if(search === '?title=%E9%A6%96%E9%A1%B5&url=/bss/ncrm/home/page/index.sdo&display=none'){
          tmpSearch = '?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none';
        }
        tmplSesn = recentlyVisitedUrls.filter(item => item.indexOf(`${pathname}${tmpSearch}|`) === 0);
        // if (cuUrls.includes('/index|')) { // 有首页权限
        //   tmplSesn = ['/index|', ...tmplSesn];
        // }
      } else if (type === 0) {
        const firstMenu = lodash.get(menuTree, '[0].menu.item[0].url', '');
        tmplSesn = [`${firstMenu}|`];
      }
      sessionStorage.setItem('recentlyVisited', tmplSesn);
      // 删除组件缓存
      this.setState({
        urls: tmplSesn,
      });
      // 关闭全部，跳转
      if (type === 0 && tmplSesn.length > 0) {
        const tgt = tmplSesn[0] || '';
        window.location.href = `/#${tgt.substring(0, tgt.indexOf('|'))}`;
      }
    };
    // 构建菜单
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => { closeTabs(0); }}>
            关闭全部
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { closeTabs(1); }}>
            关闭其他
          </a>
        </Menu.Item>
      </Menu>
    );
    return menu;
  }

  // 关闭下拉框
  closeDropdown = () => {
    this.setState({
      isVisible: false,
    });
  }

  // 控制右边下拉菜单显隐
  dorpDownVisible = (e) => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
    // 在包含tabs的Col上写了个点击关闭下拉菜单，所以此处阻止事件冒泡
    e.stopPropagation();
  }

  // 判断是新增还是编辑
  judgeCreateOrEdit=(url) => {
    const tempIndex = LocalPathUtils.extraJudgeUrlList.findIndex((item) => {
      return url.indexOf(item.path) !== -1;
    });
    return tempIndex >= 0 ? LocalPathUtils.extraJudgeUrlList[tempIndex].note : '';
  }

  render() {
    const { urls = [] } = this.state;
    const { menuTree = [], location: { pathname = '', search = '' } } = this.props;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    RecentlyVisiteUtils.mapUrls = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    finalMenuData.forEach((item) => {
      this.getNameAndUrl(item);
    });
    // 处理顺序,首页第一
    let tmplUrls = urls;
    // if (urls.includes('/index|')) { // 没有首页权限的话不加
    //   tmplUrls = urls.filter(m => m !== '/index|');
    //   tmplUrls = ['/index|', ...tmplUrls];
    // }
    // 选中的Tabkey，是url井号后面的内容
    let activeKey = '';
    const href = lodash.get(window, 'location.href', '');
    const tmplIndex = href.indexOf('#');
    if (tmplIndex > -1) {
      activeKey = href.substring(tmplIndex + 1);
      // 解决首页页签选中效果问题
      if(href.substring(tmplIndex + 1) === '/iframe/plug-in/workplatform/index.jsp?title=%E9%A6%96%E9%A1%B5&url=/bss/ncrm/home/page/index.sdo&display=none'){
        activeKey = '/iframe/plug-in/workplatform/index.jsp?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none';
      }
    }
    // 去掉加载页面带来的路由
    if(tmplUrls.includes('/loading|')){
      tmplUrls.splice(tmplUrls.indexOf('/loading|'), 1);
    }

    return (
      tmplUrls.length > 0 ? (
        <Affix target={() => document.getElementById('htmlContent')}>
          <Row className="m-row-top" style={{ backgroundColor: '#FFFFFF', margin: '0 -1rem' }}>
            <Col span={24} onClick={ this.closeDropdown }>
              <Tabs
                className="m-tabs-nav"
                tabPosition="top"
                type="line"
                animated={false}
                activeKey={activeKey}
                style={{ width: '100%' }}
                onTabClick={this.tabLinkHref}
                tabBarExtraContent={
                  <Dropdown visible={this.state.isVisible} overlay={this.getExtraDropdownMenu()} onClick={this.dorpDownVisible}>
                    <span style={{ display: 'inline-block', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '38px', height: '36px', cursor: 'pointer', backgroundColor: '#F2F3F7' }}>
                      {/* <Icon type="down" style={{ fontSize: '1.586rem', marginTop: '.86rem' }} /> */}
                      <img src={tag} style={{ width: '20px', height: '20px' }} />
                    </span>
                  </Dropdown>
                }
              >
                {
                  tmplUrls.map((item, index) => {
                    const url = item.substring(0, item.indexOf('|'));
                    let key = url;
                    if (url === '/' || url === '/loading') {
                      return null;
                    }
                    let name = item.substring(item.indexOf('|') + 1);
                    name = this.judgeCreateOrEdit(url);
                    if (!name || name === '') {
                      const tempIndex = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { 
                        // 当页面为iframe页面时，判断是否包含路由，例如/iframe/ShowWorkflow?....包含/iframe/ShowWorkflow
                        if(tempItem.url.indexOf('/iframe') >= 0){
                          return tempItem.url.includes(url);
                        }
                        return tempItem.url === url;
                      });
                      name = tempIndex >= 0 ? RecentlyVisiteUtils.mapUrls[tempIndex].name : '';
                      if (url === '/iframe/plug-in/workplatform/index.jsp?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none') {
                      // if (url === '/iframe/homePage') {
                        name = '首页';
                      }
                      // 用户新建人群特殊处理
                      if (url.startsWith('/dgt/user/newCrowd/labelCircle')) {
                        name = '标签圈人';
                      }
                      if (url.startsWith('/dgt/user/newCrowd/importCrowd') || url.startsWith('/dgt/customer/importCrowd')) {
                        name = '模版导入';
                      }
                      if (url.startsWith('/dgt/user/newCrowd/groupSpread')) {
                        name = '种群扩散';
                      }
                      if (url.startsWith('/dgt/user/newCrowd/combination')) {
                        name = '交并差组合';
                      }
                      if(url.startsWith('/newProduct/staff')) {
                        name = '员工主页';
                      }
                      if(url.startsWith('/newProduct/work/backlog')) {
                        name = '工作';
                      }
                      if(url.startsWith('/newProduct/work/message')) {
                        name = '消息';
                      }
                      if(url.startsWith('/newProduct/myTask')) {
                        name = '我的任务';
                      }
                      if(url.startsWith('/iframe/bss/ncrm/work/customerService/page/addCustomer.sdo?rwid=')) {
                        name = '编辑任务';
                      }
                      if(url.startsWith('/newProduct/chance')) {
                        name = '业务机会';
                      }
                      if(url.startsWith('/incidentialServices/valueSearch')) {
                        name = '伴随服务管理';
                      }
                      if(url.startsWith('/customer/enquire')) {
                        name = '查一查';
                      }
                      if(url.startsWith('/newProduct/xqing')) {
                        name = '考核明细';
                      }
                      if(url.startsWith('/iframe/UIProcessor?Table=JspTDKH')) {
                        name = '团队客户查询';
                      }
                      if(url.startsWith('/newProduct/customerList')) {
                        name = '等级客户列表';
                      }
                      if (url.startsWith("/newProduct/optionDetail")) {
                        name = "持仓客户";
                      }
                      //判断是否为产品全景页面
                      if(url.startsWith('/productSalesPanorama/index')){
                        // 通过解密提出路由参数中的name
                        const tmpName = JSON.parse(DecryptBase64(decodeURIComponent(url.substring(url.lastIndexOf('/') + 1)))).productName;
                        name = tmpName;
                      }
                      //判断是否为客户360页面
                      if(url.startsWith('/customerPanorama/customerInfo')){
                        name = url;
                      }
                      // 遍历系统管理和运维管理中的所有路由
                      const systemUrl = JSON.parse(sessionStorage.getItem('systemUrl')) || [];
                      const maintainUrl = JSON.parse(sessionStorage.getItem('maintainUrl')) || [];
                      const cardUrl = [...new Set([...systemUrl, ...maintainUrl])];
                      cardUrl.forEach((item)=>{
                        if(url.startsWith(item.url)){
                          name = item.name;
                        }
                      });
                      // 判断是否是投顾
                      // const tempIndexWM = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url.indexOf('/wm/') > -1; });
                      // const routerList = LocalPathUtils.getRoutesHaveName();
                      // console.log('routerList========', routerList);
                      // if (name === '' && routerList.length > 0 && tempIndexWM > -1) {
                      //   const listIndex = routerList.findIndex((tempItem) => {
                      //     return url.indexOf(tempItem.path) > -1;
                      //   });
                      //   name = listIndex >= 0 ? LocalPathUtils.getRoutesHaveName()[listIndex].note : '';
                      // }
                      if (activeKey === url) {
                        key = activeKey;
                      }
                    }
                    if (name === '') {
                      return null;
                    }
                    return (
                      <Tabs.TabPane
                        key={key}
                        tab={
                          <React.Fragment>
                            {
                              <Link to={url} style={{ display: 'inline-block' }} >
                                <div style={{ width: '98px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                              </Link>
                            }
                            {
                              tmplUrls.length > 1 && <img src={close} style={{ display: 'inline-block',position: 'absolute' , height: '16px', width: '16px', top: '7px', right: '10px' }} onClick={() => { this.handleDeleteUrl(url); }} />
                            }
                            {
                              // 选中的tab和前一个tab没有竖线
                              tmplUrls[index] !== `${activeKey}|` && tmplUrls[index + 1] !== `${activeKey}|` && (
                                <div style={{ position: 'absolute', width: '1px', height: '20px', right: '0', top: '5px', backgroundColor: '#D1D5E6' }} />
                              )
                            }
                          </React.Fragment>
                        }
                      >
                      </Tabs.TabPane>
                    );
                  })
                }
              </Tabs>
            </Col>
          </Row>
        </Affix>
      ) : (
        // 添加一行空的来占位, 避免客户列表等地方有固定的组件会出现空的
        <Affix target={() => document.getElementById('htmlContent')}>
          <Row className="m-row-top m-tabs-nav" style={{ backgroundColor: '#FFFFFF', margin: '0 -1rem', height: '3.5rem' }} />
        </Affix>
      )
    );
  }
}

export default withRouter(VisitedRoutes);
