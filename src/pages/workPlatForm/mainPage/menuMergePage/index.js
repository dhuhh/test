import { useState, useEffect } from 'react';
import PageRouteTab from '$components/Common/PageRouteTab';
import getIframeSrc from '$utils/getIframeSrc';

export default function menuMergePage(props) {
  const [routeList, setRouteList] = useState([]); // includeUrl中所有页面分别对应的tab路由数组
  const [currentUrl, setCurrentUrl] = useState(''); // 当前页面的路由
  const [includeUrl, setIncludeUrl] = useState([]); // 访问的所有合并页面

  useEffect(() => {
    getIframeSrc(); // 更新iframeTabToken
  }, [])

  useEffect(()=>{
    const { location: { pathname, search = '' } } = props;
    setCurrentUrl(`${pathname}${search}`);
  }, [`${props.location.pathname}${props.location.search}`]);

  useEffect(()=>{
    const tmpIncludeUrl = [];
    // 防止recentlyVisited更新不及时导致resultUrl为空的问题
    const timer = setInterval(() => {
      const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
      recentlyVisitedUrls.forEach((item) => {
        const itemUrl = item.split('|')[0];
        if (itemUrl.startsWith('/merge')) {
          tmpIncludeUrl.push(itemUrl);
        }
      });
      const resultUrl = [...new Set(tmpIncludeUrl)];
      /** 只有/merge开头的路由会匹配到此组件，所以最终tmpIncludeUrl长度一定大于0
       *  由于recentlyVisited依赖可能更新不及时，所以用定时器不断获取
       */
      if(JSON.stringify(resultUrl) !== JSON.stringify(includeUrl)) {
        setIncludeUrl(resultUrl);
        if(tmpIncludeUrl.length > 0) clearInterval(timer);
      }
    }, 500)
    return () => { if(timer) clearInterval(timer) };
  }, [sessionStorage.getItem('recentlyVisited'), currentUrl])

  useEffect(()=>{
    const menuTree = JSON.parse(sessionStorage.getItem('menuTree')) || [];
    const routeList = [];
    menuTree.forEach((item)=>{
      if(item.menu && item.menu.item && item.menu.item.length > 0) { // 存在二级菜单
        item.menu.item.forEach((obj)=>{
          // 传入对应当前路由的二级菜单下的三级菜单(tab)路由
          if(obj.url && includeUrl.includes(obj.url) && obj.menu && obj.menu.item && obj.menu.item.length > 0) {
            routeList.push(obj);
          }
        });
      }
    });
    setRouteList(routeList);
  }, [sessionStorage.getItem('menuTree'), JSON.stringify(includeUrl)]);

  return (
    routeList.map((item) => {
      return (
        <div key={JSON.stringify(item.url)} style={{ display: currentUrl === item.url ? '' : 'none', height: currentUrl === item.url ? '100%' : '0' }}>
          <PageRouteTab 
            routes={props.routes} 
            routeList={item.menu.item}
            third_module={item.title[0]?.text} 
            {...props} 
          />
        </div>
        );
      }
    )
  );
}