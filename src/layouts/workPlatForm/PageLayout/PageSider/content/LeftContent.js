import React from 'react';
import lodash from 'lodash';
import { Link } from 'dva/router';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import { viewSensors } from './utils.js';
import tagNew from '$assets/pageLayout/tag_new.svg';

// 用于生成uuid
const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
};
const guid = () => {
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
};
class LeftContent extends React.Component {
  state = {
    openKeys: [],
    lastKey: [],
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedMenuKeys = [], collapsed } = nextProps;
    this.setState({
      openKeys: collapsed ? [] : [selectedMenuKeys[1]],
    });
  }
  handleExclude = (pathname = '') => {
    const includes = ['/UIProcessor', '/OperateProcessor', '/ShowWorkflow'];
    let flag = true;
    includes.forEach((item) => {
      if (pathname.startsWith(item)) {
        flag = false;
      }
    });
    return flag;
  }
  // 选择menu时，若为iframe页面，改变路由
  setRoute = (value) => {
    const href = lodash.get(window, 'location.href', '');
    const tmplIndex = href.indexOf('#');
    // history.pushState('', 'title', `${href.substring(0, tmplIndex + 1)}${value}`);
    window.location.href = `${href.substring(0, tmplIndex + 1)}${value}`;
  }

  // 判断传进来的二级菜单是否显示新
  getIsMergeNew = (temp) => {
    // 只要有一个三级菜单为新，则二级菜单也显示新
    let hasNew = false;
    if(temp.menu && temp.menu.item && temp.menu.item.length > 0) {
      hasNew = temp.menu.item.some((ele) => {
        return ele.iconUrl && ele.iconUrl === 'NEW';
      });
    } 
    return hasNew;
  }

  // 点击菜单埋点
  menuClick = (url, name, moduleName) => { 
    // 合并菜单页面和业务机会页面单独添加了埋点
    if(!url.startsWith('/merge') && !url.startsWith('/newProduct/chance')) {
      viewSensors(name, moduleName, moduleName);
    }
  }

  render() {
    const { subMenuTree = [], selectedMenuKeys, menuLangKey, collapsed, toggleCollapsed, location = {}, manageNum } = this.props;
    const { lastKey } = this.state;
    // 如果当前页面为系统管理或运维管理中的页面，则菜单选中系统管理或运维管理
    const systemUrl = JSON.parse(sessionStorage.getItem('systemUrl')) || [];
    const maintainUrl = JSON.parse(sessionStorage.getItem('maintainUrl')) || [];
    const { pathname = '', search = '' } = location;
    let tmpSelectedMenuKeys = []; // 选中项，由于selectedMenuKeys只读，所以创建一个空数组用于存储
    let tmpOpenKeys = []; // 展开项
    // 当页面为系统或运维管理中的页面(路由不在menu中，但要显示选中系统或运维管理)
    systemUrl.forEach((item)=>{if(item.url === `${pathname}${search}`) { tmpSelectedMenuKeys = ['', '系统管理']; tmpOpenKeys = ['系统管理'];}});
    maintainUrl.forEach((item)=>{if(item.url === `${pathname}${search}`) { tmpSelectedMenuKeys = ['', '运维管理']; tmpOpenKeys = ['运维管理'];}});
    const tmpSelectedKeys = tmpSelectedMenuKeys.length > 0 ? [tmpSelectedMenuKeys[tmpSelectedMenuKeys.length - 1]] : [selectedMenuKeys[selectedMenuKeys.length - 1]];
    // 用于左侧menu判断有子项的模块是否展开，即对应的图标是否变色
    let OpenKeys = !['系统管理','运维管理'].includes(this.state.openKeys[0]) && ['系统管理','运维管理'].includes(tmpSelectedMenuKeys[1]) && this.state.openKeys.length < 2 ? tmpOpenKeys : this.state.openKeys;
    // 防止展开多个菜单，取最后一次点击的菜单展开,OpenKeys为菜单对应的name
    OpenKeys = [OpenKeys[OpenKeys.length - 1]];
    // console.log('OOOOOOOOOOOOOOOOOO', tmpSelectedKeys, OpenKeys);
    // console.log('?????????????', subMenuTree);
    return (
      <React.Fragment>
        <div className="m-sider-top" style={{ display: subMenuTree.length === 0 ? 'none' : '' }}>
          <Scrollbars
            autoHide
            style={{ width: '100%', height: '100%' }}
          >
            <Menu
              className={`${styles.m_menu} m-menu m-menu-xin`}
              style={{ width: '176px' }}
              selectedKeys={tmpSelectedKeys}
              // openKeys前面的判断条件表示页面选中系统管理或路由管理卡片中的页面
              openKeys={OpenKeys}
              mode="inline"
              onOpenChange={(value) => {
                if(value.length){
                  this.setState({
                    lastKey: value[value.length - 1],
                  });
                }
                this.setState({ openKeys: value }); }}
              // inlineCollapsed={collapsed}
              inlineCollapsed={false}
              // overflowedIndicator={(<img src={putAway} style={{ height: '16px', width: '16px' }} />)}
            >
              {
                subMenuTree.map((item, index) => {
                  const tempSubMenuTree = lodash.get(item, 'menu.item', []);
                  const path = lodash.get(item, 'url', '');
                  let fiframeUrl = '';
                  let custType = '';
                  let isUseA = false; // 是否需要使用A标签
                  if (path.startsWith('{') && path.endsWith('}')) {
                    fiframeUrl = JSON.parse(path);
                    custType = fiframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
                    fiframeUrl = fiframeUrl.url || '';
                    if (custType === 'ifm') {
                      if (fiframeUrl.startsWith('http')) {
                        fiframeUrl = `/iframe/${fiframeUrl}`;
                      } else {
                        fiframeUrl = `/iframe${fiframeUrl}`;
                      }
                    }
                  } else {
                    if (fiframeUrl.startsWith('http')) {
                      isUseA = true; // 直接跳转到对应地址
                    }
                  }
                  const hasChild = tempSubMenuTree.length !== 0;
                  const name = menuLangKey(item);
                  // 一级菜单是否显示"新"图标
                  let isNew = false;
                  // 是否显示一级菜单
                  let isHasContent = false; 
                  if(hasChild) {
                    // 有一个非合并二级菜单为新或合并菜单为新，则一级菜单显示新
                    isNew = tempSubMenuTree.some((item)=>{
                      let hasNew = false;
                      let isMergeNew = false;
                      if(lodash.get(item, 'iconUrl', '').split(';')[0] === 'NEW') {
                        hasNew = true;
                      }
                      isMergeNew = this.getIsMergeNew(item);
                      return hasNew || isMergeNew;
                    });
                    // 只要有非合并的二级菜单或者某个二级菜单中有三级菜单，则显示对应的一级菜单
                    isHasContent = tempSubMenuTree.some((opt) => {
                      if(!opt.url.startsWith('/merge')) {
                        return true;
                      } else if(opt.menu) {
                        return true;
                      }
                    });
                  }
                  if(hasChild && !isHasContent) { // 不显示该一级菜单
                    return;
                  }
                  if (hasChild) {
                    return (
                      <Menu.SubMenu
                        key={name}
                        popupClassName={{ bacgroundColor: '#F3F4F7' }}
                        title={
                          <span style={{ display: 'flex' }} className={lastKey === OpenKeys[0] ? '' : styles.isHover}>
                            {/* [0]是未选中图标，[1]是选中图标 */}
                            <i className={OpenKeys[0] === name || lastKey === name ? `iconfont ${lodash.get(item, 'iconUrl', '').split(';')[1] || 'icon-productK'}` : `iconfont ${lodash.get(item, 'iconUrl', '').split(';')[0] || 'icon-productK'}`} style={lastKey === OpenKeys[0] ? { fontSize: '18px',color: '#1A2243' } : { fontSize: '18px',color: '#666' }} />
                            {!collapsed && <span className="hide-menu" style={{ fontWeight: OpenKeys[0] === name || lastKey === name ? '700' : '' }}>{name}</span>}
                            {isNew && (<img width='25px' style={{ marginLeft: '2px' }} src={tagNew} /> )}
                          </span>
                        }
                      >
                        {
                          tempSubMenuTree.map((temp) => {
                            if(temp.url==="customerPanorama/customerInfo"){
                              return
                            }
                            const subName = menuLangKey(temp);
                            let itemPath = lodash.get(temp, 'url', '');
                            let iframeUrl = '';
                            let custType = '';
                            let isUseA = false; // 是否需要使用A标签
                            if (itemPath.startsWith('{') && itemPath.endsWith('}')) {
                              iframeUrl = JSON.parse(itemPath);
                              custType = iframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
                              iframeUrl = iframeUrl.url || '';
                              if (custType === 'ifm') {
                                if (iframeUrl.startsWith('http')) {
                                  iframeUrl = `/iframe/${iframeUrl}`;
                                } else {
                                  iframeUrl = `/iframe${iframeUrl}`;
                                }
                              } else {
                                if (iframeUrl.startsWith('http')) {
                                  isUseA = true; // 直接跳转到对应地址
                                }
                              }
                            }
                            // 二级菜单是否显示新
                            let isSecondMenuNew = false;
                            // 二级合并菜单是否显示新图标
                            const isMergeNew = this.getIsMergeNew(temp);
                            {/* 非合并页面：这里因为没有图标，所以只能是新标签；合并页面：某个子项有新图标 */}
                            if(isMergeNew || lodash.get(temp, 'iconUrl', '').split(';')[0] === 'NEW') {
                              isSecondMenuNew = true;
                            }
                            if (isUseA) {
                              return (
                                <Menu.Item key={subName}>
                                  <a
                                    key={guid()}
                                    href={iframeUrl || itemPath}
                                    title={lodash.get(temp, 'title[0].text', '')}
                                  >
                                    {/* <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: collapsed ? '1.833rem' : '' }} />&nbsp;&nbsp; */}
                                    {/* <i className="m-circular" /> */}
                                    <span className={styles.mPoint}>{lodash.get(temp, 'title[0].text', '')}</span>
                                  </a>
                                </Menu.Item>
                              );
                            } else if (!temp.url.startsWith('/merge') || temp.menu) { // 显示非合并页面和有子菜单的合并页面
                              return (
                                <Menu.Item key={subName} onClick={ () => { this.menuClick(iframeUrl || itemPath, name, lodash.get(temp, 'title[0].text', '')) } }>
                                  <Link
                                    key={guid()}
                                    to={iframeUrl || itemPath}
                                    target={temp.windowType === 1 ? '_blank' : ''}
                                    // title={lodash.get(temp, 'title[0].text', '')}
                                    style={{ display: 'flex', height: '100%', alignItems: 'center' }}
                                  >
                                    <span>{lodash.get(temp, 'title[0].text', '')}</span>
                                    {isSecondMenuNew && (<img width='25px' style={{ marginLeft: '2px' }} src={tagNew} />)}
                                  </Link>
                                </Menu.Item>
                              );
                            }
                          })
                        }
                      </Menu.SubMenu>
                    );
                  }
                  if (isUseA) {
                    return (
                      <Menu.Item
                        key={name}
                      >
                        <span>
                          <i className={`iconfont ${lodash.get(item, 'iconUrl', '') || 'icon-productK'}`} style={{ }} />
                          {!collapsed && <span className="hide-menu">{name}</span>}
                        </span>
                        <a
                          key={guid()}
                          title={lodash.get(item, 'title[0].text', '')}
                          href={fiframeUrl ? `${fiframeUrl}` : path}
                          target={item.windowType === 1 ? '_blank' : ''} rel="noreferrer"
                        >
                          {/* <i className="m-circular" /> */}
                          <span>{lodash.get(item, 'title[0].text', '')}</span>
                        </a>
                      </Menu.Item>
                    );
                  } else {
                    return (
                      <Menu.Item
                        key={name}
                        className={'single-menu'}
                        onClick={ () => { this.menuClick(fiframeUrl ? `${fiframeUrl}` : path, name, name ) } }
                      >
                        {
                          subMenuTree && subMenuTree.length > 2 && ((manageNum === 1 && index === subMenuTree.length - 1) || (manageNum === 2 && index === subMenuTree.length - 2)) && (
                            <div style={{ position: 'absolute', width: '148px', height: '1px', top: '0px', left: '14px', backgroundColor: '#EBECF2' }}></div>
                          )
                        }
                        {
                          <Link
                            key={guid()}
                            // title={lodash.get(item, 'title[0].text', '')}
                            to={fiframeUrl ? `${fiframeUrl}` : path}
                            target={item.windowType === 1 ? '_blank' : ''}
                            style={{ display: 'flex', height: '100%', alignItems: 'center' }}
                          >
                            {/* <span> */}
                            <i className={OpenKeys[0] === name ? `iconfont ${lodash.get(item, 'iconUrl', '').split(';')[1] || 'icon-productK'}` : `iconfont ${lodash.get(item, 'iconUrl', '').split(';')[0] || 'icon-productK'}`} style={{ fontSize: '18px', color: '#1A2243' }} />
                            {!collapsed && <span className="hide-menu" style={{ fontWeight: OpenKeys[0] === name || lastKey === name ? '700' : '' }}>{name}</span>}
                            {/* </span> */}
                          </Link>
                        }
                        
                        {
                          subMenuTree && index === 0 && (
                            <div style={{ position: 'absolute', width: '148px', height: '1px', bottom: '0px', left: '14px', backgroundColor: '#EBECF2' }}></div>
                          )
                        }
                      </Menu.Item>
                    );
                  }
                })
              }
            </Menu>
          </Scrollbars>
        </div>
        {/* <div className="m-sider m-sider-xin" style={{ overflow: 'hidden', display: subMenuTree.length === 0 ? 'none' : '' }} onClick={toggleCollapsed}>
          <div className="m-sider-head">
            <h3>
              <span>
                <i className="iconfont icon-menu" />
              </span>
            </h3>
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}
export default LeftContent;
