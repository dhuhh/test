/* eslint-disable no-nested-ternary */
/* eslint-disable no-debugger */
import React from 'react';
import { Menu } from 'antd';
import lodash from 'lodash';
import { Link } from 'dva/router';
import daohang from '@/assets/daohang.svg';
import home from '@/assets/home.svg';
import infoCenter from '@/assets/infoCenter.svg';
import triangle from '@/assets/triangle.svg';
import operationCenter from '@/assets/operationCenter.svg';
import systemCenter from '@/assets/systemCenter.svg';
import verticalLine from '@/assets/vertical-line.svg';
// 用于生成uuid
const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
};
const guid = () => {
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
};
const menuItemIcons = [
  { url: '/processNavigation', icon: daohang },
  { url: '/index', icon: home },
];
const subMenuItemIcons = [
  { url: 'icon-info', icon: infoCenter },
  { url: 'icon-yuny', icon: operationCenter },
  { url: 'icon-gongneng', icon: systemCenter },
  { url: 'icon-xueli', icon: verticalLine },
  { url: 'icon-linechart', icon: verticalLine },
  { url: 'icon-audit', icon: verticalLine },
  { url: 'icon-transaction', icon: verticalLine },
  { url: 'icon-jinrongchanpin', icon: verticalLine },
  { url: 'icon-yewuyunying', icon: verticalLine },
  { url: 'icon-moreKT', icon: verticalLine },
  { url: 'icon-motbanli', icon: verticalLine },
  { url: 'icon-table', icon: verticalLine },
  { url: 'icon-fuwuchanpin', icon: verticalLine },
  { url: 'icon-daochu', icon: verticalLine },
];
const backgroundManagementTitles = [
  '用户管理',
  '权限管理',
  '内部管理',
  '文档模板',
  '产品建模',
  '流程配置',
  '邮件配置',
  '系统管理',
  'ETL运维',
];

class LeftContent extends React.Component {
  menuReft = React.createRef;
  state = {
    openKeys: [],
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMenuKeys = [], collapsed } = nextProps;
    this.setState({
      openKeys: !collapsed ? [] : selectedMenuKeys,
      // openKeys: !collapsed ? [] : selectedMenuKeys.length > 2 ? [selectedMenuKeys[0], selectedMenuKeys[1], selectedMenuKeys[2], selectedMenuKeys[3]] : [selectedMenuKeys[0]],
    });
  }

  // 递归子级菜单渲染
  handleChildren = (childDatas, item, name) => {
    const { collapsed, menuLangKey } = this.props;
    const collapsedIconStyle = { display: 'inline-block', width: '21px', height: '22px' };
    const title = lodash.get(item, 'title', '');
    const titleText = title[0]?.text;
    return (
      <Menu.SubMenu
        key={name}
        title={
          <span style={collapsed ? {} : collapsedIconStyle}>
            {
              backgroundManagementTitles.includes(titleText) ?
                <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '', display: `${lodash.get(item, 'iconUrl', '')}` !== '' ? 'inline-block' : 'none' }} />
              :
              (
                <img
                  src={this.showSubMenuIcon(item)}
                  alt=""
                  style={{
                    width: collapsed ? '17px' : '21px',
                    height: collapsed ? '17px' : '22px',
                    marginRight: '.666rem',
                    verticalAlign: 'baseline',
                  }}
                />
              )
            }
            <span className="hide-menu" >{name}</span>
          </span>}
      >
        {
          childDatas.map((temp) => {
            const tempSubMenuTreeTh = lodash.get(temp, 'menu.item', []);
            const subName = menuLangKey(temp);
            const itemPath = lodash.get(temp, 'url', '');
            const toLinkObj = {
              pathname: itemPath,
            };
            let iframeUrl = '';
            if (itemPath.startsWith('{') && itemPath.endsWith('}')) {
              iframeUrl = JSON.parse(itemPath);
              const custType = iframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
              iframeUrl = iframeUrl.url || '';
              if (custType === 'ifm') {
                if (iframeUrl.startsWith('http')) {
                  iframeUrl = `/#/iframe/${iframeUrl}`;
                } else {
                  iframeUrl = `/#/iframe${iframeUrl}`;
                }
              }
            }

            const hasChildTh = tempSubMenuTreeTh.length !== 0;
            const names = menuLangKey(temp);

            if (hasChildTh) {
             return this.handleChildren(tempSubMenuTreeTh, temp, names);
            }

            if (/^http|https?:\/\//.test(itemPath)) {
              return (
                <Menu.Item key={subName}>
                  <a
                    key={guid()}
                    href={iframeUrl || `#${itemPath}`}
                    target={temp.windowType === 1 ? '_blank' : ''}
                    title={lodash.get(temp, 'title[0].text', '')}
                  >
                    <span >{lodash.get(temp, 'title[0].text', '')}</span>
                  </a>
                </Menu.Item>
              );
            }
            return (
              <Menu.Item key={subName}>
                <Link
                  key={guid()}
                  to={iframeUrl || toLinkObj}
                  target={lodash.get(temp, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
                  replace={itemPath === this.props.location.pathname}
                  title={lodash.get(temp, 'title[0].text', '')}
                >
                  <span>{lodash.get(temp, 'title[0].text', '')}</span>
                </Link>
              </Menu.Item>
            );
          })
        }
      </Menu.SubMenu>
    );
  }

  showMenuIcon = (item) => {
    const url = lodash.get(item, 'url', '');
    const len = menuItemIcons.length;
    let icon = '';
    for (let i = 0; i < len; i++) {
      if (url === menuItemIcons[i].url) {
        icon = menuItemIcons[i].icon; // eslint-disable-line
      }
    }
    return icon;
  }

  showSubMenuIcon = (item) => {
    const url = lodash.get(item, 'iconUrl', '');
    const len = subMenuItemIcons.length;
    let icon = triangle;
    for (let i = 0; i < len; i++) {
      if (url === subMenuItemIcons[i].url) {
        icon = subMenuItemIcons[i].icon; // eslint-disable-line
      }
    }
    return icon;
  }

  render() {
    const { menuTree = [], selectedMenuKeys, collapsed, menuLangKey } = this.props;
    const { openKeys = [] } = this.state;
    const collapsedIconStyle = { display: 'inline-block', width: '21px', height: '22px' };
    return (
      <React.Fragment>
        <div className="m-sider-top" style={{ display: menuTree.length === 0 ? 'none' : '' }}>
          <Menu
            className="m-menu m-menu-xin"
            selectedKeys={[selectedMenuKeys[selectedMenuKeys.length - 1]]}
            openKeys={openKeys}
            mode="inline"
            theme="dark"
            onOpenChange={(value) => { this.setState({ openKeys: value }); }}
            collapsed={!collapsed}
            inlineCollapsed
            ref={this.menuReft}
          >
            {
              menuTree.map((item) => {
                const tempSubMenuTree = lodash.get(item, 'menu.item', []);
                const path = lodash.get(item, 'url', '');
                let fiframeUrl = '';
                if (path.startsWith('{') && path.endsWith('}')) {
                  fiframeUrl = JSON.parse(path);
                  const subType = fiframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
                  fiframeUrl = fiframeUrl.url || '';
                  if (subType === 'ifm') {
                    if (fiframeUrl.startsWith('http')) {
                      fiframeUrl = `/#/iframe/${fiframeUrl}`;
                    } else {
                      fiframeUrl = `/#/iframe${fiframeUrl}`;
                    }
                  }
                }
                const hasChild = tempSubMenuTree.length !== 0;
                const name = menuLangKey(item);
                const toLinkObjMain = {
                  pathname: fiframeUrl || path,
                };

                if (hasChild) {
                  return this.handleChildren(tempSubMenuTree, item, name);
                }

                return /^http|https?:\/\//.test(path) ? (
                  <Menu.Item
                    key={name}
                  >
                    <span className="m-link-span" style={collapsed ? {} : collapsedIconStyle}>
                      <img
                        src={this.showMenuIcon(item)}
                        alt=""
                        style={{
                          width: collapsed ? '17px' : '21px',
                          height: collapsed ? '17px' : '22px',
                          marginRight: '.666rem',
                          verticalAlign: 'baseline',
                        }}
                      />
                      {collapsed && <span className={`${lodash.get(item, 'iconUrl', '')}`.length > 0 ? 'hide-menu' : ''}>{name}</span>}
                    </span>
                    <a
                      key={guid()}
                      title={lodash.get(item, 'title[0].text', '')}
                      href={fiframeUrl ? `${fiframeUrl}` : `#${path}`}
                      target={item.windowType === 1 ? '_blank' : ''}
                    >
                      <i className="m-circular" />
                      <span>{lodash.get(item, 'title[0].text', '')}</span>
                    </a>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key={name}
                  >
                    <span className="m-link-span" style={collapsed ? {} : collapsedIconStyle}>
                      <img
                        src={this.showMenuIcon(item)}
                        alt=""
                        style={{
                          width: collapsed ? '17px' : '21px',
                          height: collapsed ? '17px' : '22px',
                          marginRight: '.666rem',
                          verticalAlign: 'baseline',
                        }}
                      />
                      {/* <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '' }} /> */}
                      {collapsed && <span className="hide-menu">{name}</span>}
                    </span>
                    <Link
                      key={guid()}
                      to={toLinkObjMain}
                      target={lodash.get(item, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
                      replace={path === this.props.location.pathname}
                      title={lodash.get(item, 'title[0].text', '')}
                    >
                      <span>{lodash.get(item, 'title[0].text', '')}</span>
                    </Link>
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </div>

      </React.Fragment>
    );
  }
}
export default LeftContent;
