/* eslint-disable no-debugger */
import React from 'react';
import lodash from 'lodash';
import { routerRedux } from 'dva/router';
import { suffix } from '../../../../../../utils/config';

class TopMenu extends React.Component {
  state = {
    curentKey: '',
  }
  componentDidMount() {
    const { menuTree = [], location: { pathname, search } } = this.props;
    this.changeSelected(pathname.concat(search), menuTree, '');
  }
  componentWillReceiveProps(nextProps) {
    const { menuTree = [], location: { pathname, search } } = nextProps;
    this.changeSelected(pathname.concat(search), menuTree, '');
  }
  getMenuData = (menuTree) => {
    const { menuLangKey } = this.props;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    const displayMenuData = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    for (let i = 0; i < finalMenuData.length; i++) {
      const item = finalMenuData[i];
      const iconUrl = lodash.get(item, 'iconUrl', '');
      const name = lodash.get(item, 'title[0].text', '');
      const curentKey = menuLangKey(item);
      const urlObj = this.getMeunUrl(item);
      displayMenuData.push({
        id: i + 1,
        name,
        iconUrl,
        curentKey,
        url: urlObj.url,
        windowType: urlObj.windowType,
      });
    }
    return displayMenuData;
  }
  getMeunUrl = (menuData) => { // 获取菜单中的一级菜单
    const url = lodash.get(menuData, 'url', '');
    const windowType = lodash.get(menuData, 'windowType', 0);
    if (url) {
      return { url, windowType };
    }
    const subMenuTree = lodash.get(menuData, 'menu.item', []);
    if (subMenuTree.length > 0) {
      const subMenu = subMenuTree[0] || {};
      return this.getMeunUrl(subMenu);
    }
    return {};
  }
  changeMeun = (key, windowType, url) => {
    const { dispatch } = this.props;
    this.setState({
      curentKey: key,
    });
    if (windowType === 1) { // 新窗口打开
      window.open(url);
    } else if (url.startsWith('{') && url.endsWith('}')) { // 定制路径
      let fiframeUrl = JSON.parse(url);
      const custType = fiframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
      fiframeUrl = fiframeUrl.url || '';
      if (custType === 'ifm') {
        if (fiframeUrl.startsWith('http')) { // 全路径时
          fiframeUrl = `/#/iframe/${fiframeUrl}`;
        } else {
          fiframeUrl = `/#/iframe${fiframeUrl}`;
        }
        window.location.href = fiframeUrl;
      } else if (custType === 'self') {
        window.location.href = fiframeUrl;
      } else if (custType === 'page') {
        window.open(fiframeUrl);
      }
      // window.location.href = fiframeUrl;
    } else if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      dispatch(routerRedux.push(url));
    }
  }
  changeSelected = (url, menus) => {
    const selectedKeys = this.findSelectedMenuKeys(url, menus) || [];
    if (selectedKeys.length !== 0) {
      this.setState({
        curentKey: selectedKeys[0],
      });
    }
  }
  findSelectedMenuKeys = (url, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      const curentKey = this.props.menuLangKey(item);
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

  handleCls = (id, name) => {
    let clas = '';
    let clas2 = '';
    if (id % 5 === 1) {
      clas = 'm-menu-icon-blue ';
    } else if (id % 5 === 2) {
      clas = 'm-menu-icon-orange ';
    } else if (id % 5 === 3) {
      clas = 'm-menu-icon-pink ';
    } else if (id % 5 === 4) {
      clas = 'm-menu-icon-violet ';
    } else if (id % 5 === 0) {
      clas = 'm-menu-icon-brown ';
    }

    if (name === '信息中心') {
      clas2 = 'info';
    } else if (name === '首页') {
      clas2 = 'home';
    } else if (name === '产品销售') {
      clas2 = 'sales';
    } else if (name === '内部管理') {
      clas2 = 'sales';
    } else if (name === '用户管理') {
      clas2 = 'home';
    }
    return clas + clas2;
  }

  render() {
    const { menuTree = [] } = this.props;
    const displayMenuData = this.getMenuData(menuTree);
    return (
      <ul style={{ background: 'transparent', padding: 0, width: '100%', overflow: 'hidden' }} className="m-menu-horizontal ant-menu ant-menu-root ant-menu-horizontal">
        {displayMenuData.map((menuData) => {
          const { id = '', name = '', curentKey = '', url = '', windowType = '0', iconUrl = '' } = menuData;
          return (
            <li className={`ant-menu-item ${this.state.curentKey === curentKey ? 'ant-menu-item-selected' : ''}`} onClick={() => { this.changeMeun(curentKey, windowType, url); }} key={curentKey} url={url} >
              <span className={`${this.handleCls(id, name)} m-menu-icon`}><i className={`${iconUrl} iconfont`} /></span>
              {name}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default TopMenu;
