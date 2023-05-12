/**
 * 由于逻辑的更改，非menus接口的路由,且路由不是/iframe/UIProcessor开头的页面，现在不需要此方法也能自动添加到recentlyVisited中，
 * 只需利用Link跳转即可，然后在VisitedRoutes组件中添加name的单独判断
 */
// 添加当前页面页签到tab栏
function addTabbar(url) {
  let tmpUrl = sessionStorage.getItem('recentlyVisited').split(',') || [];
    if(tmpUrl.indexOf(url) === -1){
      tmpUrl.push(url);
      sessionStorage.setItem('recentlyVisited', tmpUrl.join(','));
    }
}

export default addTabbar;