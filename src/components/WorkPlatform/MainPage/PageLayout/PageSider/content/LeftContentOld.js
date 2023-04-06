/* eslint-disable no-nested-ternary */
/* eslint-disable no-debugger */
import React from 'react';
import { Menu } from 'antd';
import lodash from 'lodash';
import { Link } from 'dva/router';
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
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMenuKeys = [], collapsed } = nextProps;
    this.setState({
      openKeys: !collapsed ? [] : selectedMenuKeys,
      // openKeys: !collapsed ? [] : selectedMenuKeys.length > 2 ? [selectedMenuKeys[0], selectedMenuKeys[1], selectedMenuKeys[2], selectedMenuKeys[3]] : [selectedMenuKeys[0]],
    });
  }

  render() {
    const { menuTree = [], selectedMenuKeys, collapsed, menuLangKey } = this.props;
    const { openKeys = [] } = this.state;
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
                    return (
                      <Menu.SubMenu
                        key={name}
                        title={
                          <span>
                            <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '', display: `${lodash.get(item, 'iconUrl', '')}` !== '' ? 'inline-block' : 'none' }} />
                            {collapsed && <span className="hide-menu" style={{ marginLeft: '1rem' }}>{name}</span>}
                          </span>}
                      >
                        {
                          tempSubMenuTree.map((temp) => {
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
                            const namea = menuLangKey(temp);

                            if (hasChildTh) {
                              return (
                                <Menu.SubMenu
                                  key={namea}
                                  title={
                                    <span>
                                      <i className={`iconfont ${lodash.get(temp, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '', display: `${lodash.get(temp, 'iconUrl', '')}` !== '' ? 'inline-block' : 'none' }} />
                                      {collapsed && <span className="hide-menu" style={{ marginLeft: '1rem' }}>{namea}</span>}
                                    </span>}
                                >
                                  {
                                    tempSubMenuTreeTh.map((three) => {
                                      const subMenuFour = lodash.get(three, 'menu.item', []);
                                      console.log(tempSubMenuTreeTh, subMenuFour, '________________three');
                                      const subNames = menuLangKey(three);
                                      const itemPaths = lodash.get(three, 'url', '');

                                      const toLinkObjs = {
                                        pathname: itemPaths,
                                      };
                                      let iframeUrls = '';
                                      if (itemPaths.startsWith('{') && itemPaths.endsWith('}')) {
                                        iframeUrls = JSON.parse(itemPaths);
                                        const custType = iframeUrls.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
                                        iframeUrls = iframeUrls.url || '';
                                        if (custType === 'ifm') {
                                          if (iframeUrls.startsWith('http')) {
                                            iframeUrls = `/#/iframe/${iframeUrls}`;
                                          } else {
                                            iframeUrls = `/#/iframe${iframeUrls}`;
                                          }
                                        }
                                      }

                                      const hasChildFo = subMenuFour.length !== 0;
                                      const nameFo = menuLangKey(three);
                                      if (hasChildFo) {
                                        return (
                                          <Menu.SubMenu
                                            key={nameFo}
                                            title={
                                              <span>
                                                {/* <i className={`iconfont ${lodash.get(temp, 'iconUrl', '')}`} style={{ fontSize: collapsed ? '1.666rem' : '', display: `${lodash.get(temp, 'iconUrl', '')}` !== '' ? 'inline-block' : 'none' }} /> */}
                                                {collapsed && <span className="hide-menu" style={{ marginLeft: '1rem' }}>{nameFo}</span>}
                                              </span>}
                                          >
                                            {
                                              subMenuFour.map((four) => {
                                                const subNamesFour = menuLangKey(four);
                                                const itemPathsFour = lodash.get(four, 'url', '');

                                                const toLinkObjsFour = {
                                                  pathname: itemPathsFour,
                                                };
                                                let iframeUrlsFour = '';
                                                if (itemPathsFour.startsWith('{') && itemPathsFour.endsWith('}')) {
                                                  iframeUrlsFour = JSON.parse(itemPathsFour);
                                                  const custType = iframeUrlsFour.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
                                                  iframeUrlsFour = iframeUrlsFour.url || '';
                                                  if (custType === 'ifm') {
                                                    if (iframeUrlsFour.startsWith('http')) {
                                                      iframeUrlsFour = `/#/iframe/${iframeUrlsFour}`;
                                                    } else {
                                                      iframeUrlsFour = `/#/iframe${iframeUrlsFour}`;
                                                    }
                                                  }
                                                }
                                                if (/^http|https?:\/\//.test(itemPathsFour)) {
                                                  return (
                                                    <Menu.Item key={subNamesFour}>
                                                      <a
                                                        key={guid()}
                                                        href={iframeUrlsFour || `#${itemPathsFour}`}
                                                        target={four.windowType === 1 ? '_blank' : ''}
                                                        title={lodash.get(four, 'title[0].text', '')}
                                                      >
                                                        {/* <i className="m-circular" /> */}
                                                        <span>{lodash.get(four, 'title[0].text', '')}</span>
                                                      </a>
                                                    </Menu.Item>
                                                  );
                                                }
                                                return (
                                                  <Menu.Item key={subNamesFour}>
                                                    <Link
                                                      key={guid()}
                                                      to={iframeUrlsFour || toLinkObjsFour}
                                                      target={lodash.get(four, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
                                                      replace={itemPathsFour === this.props.location.pathname}
                                                      title={lodash.get(four, 'title[0].text', '')}
                                                    >
                                                      <span>{lodash.get(four, 'title[0].text', '')}</span>
                                                    </Link>
                                                  </Menu.Item>
                                                );
                                              })
                                            }
                                          </Menu.SubMenu>
                                        );
                                      }


                                      if (/^http|https?:\/\//.test(itemPaths)) {
                                        return (
                                          <Menu.Item key={subNames}>
                                            <a
                                              key={guid()}
                                              href={iframeUrls || `#${itemPaths}`}
                                              target={three.windowType === 1 ? '_blank' : ''}
                                              title={lodash.get(three, 'title[0].text', '')}
                                            >
                                              {/* <i className="m-circular" /> */}
                                              <span>{lodash.get(three, 'title[0].text', '')}</span>
                                            </a>
                                          </Menu.Item>
                                        );
                                      }
                                      return (
                                        <Menu.Item key={subNames}>
                                          <Link
                                            key={guid()}
                                            to={iframeUrls || toLinkObjs}
                                            target={lodash.get(three, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
                                            replace={itemPaths === this.props.location.pathname}
                                            title={lodash.get(three, 'title[0].text', '')}
                                          >
                                            <span>{lodash.get(three, 'title[0].text', '')}</span>
                                          </Link>
                                        </Menu.Item>
                                      );
                                    })
                                  }
                                </Menu.SubMenu>
                              );
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
                                    {/* <i className="m-circular" /> */}
                                    <i className={`iconfont ${lodash.get(temp, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '' }} />
                                    <span>{lodash.get(temp, 'title[0].text', '')}</span>
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
                                  <i className={`iconfont ${lodash.get(temp, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '' }} />
                                  <span className={`${lodash.get(temp, 'iconUrl', '')}`.length > 0 ? 'hide-menu' : ''}>{lodash.get(temp, 'title[0].text', '')}</span>
                                </Link>
                              </Menu.Item>
                            );
                          })
                        }
                      </Menu.SubMenu>
                    );
                  }
                  return /^http|https?:\/\//.test(path) ? (
                    <Menu.Item
                      key={name}
                    >
                      <span className="m-link-span">
                        <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '' }} />
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
                      <span className="m-link-span">
                        <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '' }} />
                        {collapsed && <span className="hide-menu">{name}</span>}
                      </span>
                      <Link
                        key={guid()}
                        to={toLinkObjMain}
                        target={lodash.get(item, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
                        replace={path === this.props.location.pathname}
                        title={lodash.get(item, 'title[0].text', '')}
                      >
                        <i className={`iconfont ${lodash.get(item, 'iconUrl', '')}`} style={{ fontSize: !collapsed ? '1.666rem' : '' }} />
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
