import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LBFrame from 'livebos-frame';
// import debounce from 'lodash.debounce';
import eventUtils from 'livebos-frame/dist/utils/event';
import getIframeSrc from '$utils/getIframeSrc';
import { viewSensors } from './utils.js';
import { FetchUrlAccessControl } from '$services/commonbase/index';

class IframeContent extends React.Component {
  constructor(props) {
    super(props);
    this.iframeHeight = 0;
  }

  componentWillMount() {
    //调用改函数存储iframeToken
    getIframeSrc('', '', '', false);
    eventUtils.attachEvent('message', this.onMessage);
    this.setIframeHeight();
  }

  componentDidMount() {
    const opt = document.getElementsByClassName('myBox');
    opt.forEach((item)=>{
      item.parentNode.style.height = '100%';
    });
    const { location: { pathname, search = '' } } = this.props;
    if(`${pathname}${search}` === '/iframe/homePage') viewSensors();
  }

  onMessage = (event) => { // iframe的回调事件
    let msg = {};
    try {
      msg = JSON.parse(event.data);
    } catch (ignored) {
      return;
    }
    switch (msg.type) {
      case 'sessionTimeout':
        window.location.href = '/#/login';
        break;
      default:
        break;
    }
  }

  setIframeHeight = () => {
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `${windowInnerHeight - 66 - 55}px`;
    this.iframeHeight = iframeHeight;
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

  handleOnLoad = () => {
    //alert('加载完成');
    document.getElementById('htmlContent').scrollTo(0, 0);
  }

  // 排除用户没有权限的C4页面路由
  getNeedRoutes = (routes) => {
    const allMenuRoutes =  JSON.parse(sessionStorage.getItem('allMenuRoutes')) || [];
    let urlList = []; // qx为0时表示当前用户没有这个路由的查看权限
    allMenuRoutes.forEach((item) => {
      if (item.qx === '0') {
        urlList.push(item.url);
      }
    });
    // 有权限就返回路由
    let tmpRoutes = routes.filter((item)=>{
      return (!urlList.includes(item.replace('/iframe', '')));
    });
    // 可能存在多个相同路由，若存在与无权限路由数组(urlList)中同样的路由且qx === '1'，则再添加到路由数组中
    allMenuRoutes.forEach((item)=>{
      if(urlList.includes(item.url) && item.qx === '1') {
        tmpRoutes.push(item.url);
      }
    });
    return tmpRoutes;
  }

  render() {
    const { location: { pathname, search = '' }, sysParam = [] } = this.props;
    let livebosUrl;
    // 首页路由 '/iframe/homePage'为C5的路由，C4实际路由为下面的地址
    // if(pathname + search === '/iframe/homePage'){
    //   livebosUrl = '/iframe/plug-in/workplatform/index.jsp?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none';
    // } else {
    //   livebosUrl = pathname + search;
    // }
    if (search.startsWith('?title=%E9%A6%96%E9%A1%B5')) {
      console.log("😅 => file: iframeContent.js:103 => IframeContent => render => search", search)
      
      livebosUrl = pathname + '?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none';
    // 首页路由 '/iframe/homePage'为C5的路由，C4实际路由为下面的地址
    } else {
      livebosUrl = pathname + search;
    }

    livebosUrl = livebosUrl.indexOf('?') > 0 ? `${livebosUrl}` : `${livebosUrl}`; // 支持点击菜单刷新
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const includeUrl = [];

    recentlyVisitedUrls.forEach((item) => {
      let itemUrl = item.split('|')[0];
      // if (itemUrl.startsWith('/iframe/UIProcessor') || itemUrl.startsWith('/iframe/OperateProcessor') || itemUrl.startsWith('/iframe/ShowWorkflow')
      // || itemUrl.startsWith('/iframe/plug-in/workplatform/ncrm.jsp') || itemUrl.startsWith('/iframe/plug-in/workplatform/index.jsp')) { // 首页和理财产品单独判断
      //   includeUrl.push(itemUrl);
      // }
      // 首页路由 '/iframe/homePage'为C5的路由，C4实际路由为下面的地址，这里需要转一下
      // if(itemUrl.startsWith('/iframe/homePage')) {
      //   itemUrl = '/iframe/plug-in/workplatform/index.jsp?title=首页&url=/bss/ncrm/home/page/index.sdo&display=none';
      // }
      // 由于改成所有的iframe页面都走这个组件，所以不用对路由进行筛选
      if(itemUrl.startsWith('/iframe')) includeUrl.push(itemUrl);
    });

    const tempUrls = includeUrl.filter(item => item === livebosUrl) || [];
    if (tempUrls.length === 0) {
      includeUrl.push(livebosUrl);
    }
    // 过滤掉没有权限的路由
    const tmpRoutes = this.getNeedRoutes(includeUrl);
    // console.log('最终路由========', tmpRoutes);
    console.log(sysParam,'sysParam');
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    // 用于判断display的显隐
    const tmpIncludeUrl = [...tmpRoutes];
    // 将includeUrl中的路由转化为拼接后的路由
    tmpRoutes.forEach((item, index)=>{
      const url = `${server}${item.startsWith('/UIProcessor?Table=WORKFLOW_TOTASKS') ? item : item.replace('/iframe', '')}`;
      const src = `${server}/loginServlet?token=${sessionStorage.getItem('iframeToken') || ''}&callBackUrl=${encodeURIComponent(encodeURIComponent(url))}`;
      tmpRoutes[index] = src;
    });

    return (
      <div className='myBox' style={{ height: '100%' }}>
      {
        server ? (
            tmpRoutes.map((item, index) => {
            console.log("😅 => file: iframeContent.js:152 => IframeContent => tmpRoutes.map => item", item)
            return (
              <div key={item} style={{ visibility: livebosUrl === tmpIncludeUrl[index] ? 'unset' : 'hidden', height: livebosUrl === tmpIncludeUrl[index] ? '100%' : '0' }}>
                <LBFrame
                  key={item}
                  src={item}
                  width="100%"
                  height="100%"
                  // height={livebosUrl === item ? this.iframeHeight : 0}
                  id="myId"
                  className=""
                  style={{ position: 'relative', display: 'initial', width: '100%' }}
                  allowFullScreen
                  frameBorder="no"
                  border="0"
                  onMessage={this.onMessage}
                  onLoad={this.handleOnLoad}
                />
              </div>
            );
          })
        ) : null
      }
      </div>
    );
  }
}
export default React.memo(connect(({ global }) => ({
  sysParam: global.sysParam,
  userBasicInfo: global.userBasicInfo,
}))(IframeContent));
