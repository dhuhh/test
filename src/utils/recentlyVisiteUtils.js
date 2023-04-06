/*
 * @Author: your name
 * @Date: 2021-07-16 11:40:38
 * @LastEditTime: 2021-07-16 11:40:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \product-react-web\src\utils\recentlyVisiteUtils.js
 */
/* eslint-disable no-debugger */
import lodash from 'lodash';
import { fetchRecordPageAccessLog } from '../services/basicservices';
/**
 * Object对象相关的自定义处理函数
 */
let menuName = {};
const RecentlyVisiteUtils = {
  getNameAndUrl(url, menuTree) { // 遍历目录树 找到url 和name
    if (menuTree) {
      menuTree.forEach((tempItem) => {
        if (tempItem.menu && tempItem.url !== url) {
          this.getNameAndUrl(url, tempItem.menu.item || []);
        } else if (lodash.get(tempItem, 'url', '').indexOf(url) !== -1) {
          const itemUrl = lodash.get(tempItem, 'url', '');
          if (itemUrl.indexOf('{') !== -1) {
            if (itemUrl.indexOf(url) !== -1) {
              menuName = tempItem;
            }
          }
          if (url.indexOf(itemUrl) !== -1) {
            menuName = tempItem;
          }
        }
      });
    }
    return menuName;
  },
  saveRecentlyVisiteUtils(plocPath, search, name = '') {
    let tempName = name;
    // 保存最近访问的url
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const tempRecentUrl = `${plocPath + search}|${name}`;
    const tempIndex = recentlyVisitedUrls.findIndex((item) => { return item.substring(0, item.indexOf('|')) === tempRecentUrl.substring(0, tempRecentUrl.indexOf('|')); });
    // const tempIndexName = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url === plocPath + search; });
    // tempName = tempIndexName >= 0 ? RecentlyVisiteUtils.mapUrls[tempIndexName].name : '';
    // 处理菜单路径的后缀
    const menuTree = JSON.parse(sessionStorage.getItem('menuTree')) || [];
    const tempObj = this.getNameAndUrl(`${plocPath + search}`, menuTree) || {};
    tempName = lodash.get(tempObj, 'title[0].text', '');
    if (tempName) {
      fetchRecordPageAccessLog({
        accessIp: '',
        accessParam: '',
        browserVerson: '',
        menuPrj: '',
        oprModule: '',
        pageCode: '',
        pageName: tempName,
        reqType: '',
        spentTime: '',
        srvSts: '',
        terminal: 0,
        url: `进入：${tempName}|${tempRecentUrl}`,
      });
    }
    if (tempIndex >= 0) {
      /* if (name) {
        recentlyVisitedUrls.push(tempRecentUrl);
      } else {
        recentlyVisitedUrls.push(recentlyVisitedUrls[tempIndex]);
      }
      recentlyVisitedUrls.splice(tempIndex, 1); */
      return;
    }
    recentlyVisitedUrls.push(tempRecentUrl);
    sessionStorage.setItem('recentlyVisited', recentlyVisitedUrls.join(','));
  },
  cleanRecentlyVisiteUtils() {
    sessionStorage.setItem('recentlyVisited', '');// 清除历史记录
  },
  mapUrls: [], // 所有目录的url和名称
};

export default RecentlyVisiteUtils;

