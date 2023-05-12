import React from 'react';
import Iframe from 'react-iframe';
import { connect } from 'dva';
import getIframeSrc from '$utils/getIframeSrc';
import styles from './index.less';

class DoIframeContent extends React.Component {
  componentWillMount() {
    //调用改函数存储iframeToken
    getIframeSrc();
  }

  componentDidMount() {
    const opt = document.getElementsByClassName('myBox');
    opt.forEach((item)=>{
      item.parentNode.style.height = '100%';
    });
  }
  render() {
    const { location: { pathname, search = '' }, sysParam = [], visiteUrl = '' } = this.props;
    let sdoUrl = pathname + search;
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const includeUrl = [];
    recentlyVisitedUrls.forEach((item) => {
      const itemUrl = item.split('|')[0];
      //参考Intergration.js路由，去掉iframeContent和reactIrame，剩下的即为doIframeContent类型的页面
      if (!(itemUrl.startsWith('/iframe/UIProcessor') || itemUrl.startsWith('/iframe/OperateProcessor') || itemUrl.startsWith('/iframe/ShowWorkflow')
      || itemUrl.startsWith('/iframe/plug-in/workplatform/ncrm.jsp') || itemUrl.startsWith('/iframe/plug-in/workplatform/index.jsp') 
      || itemUrl.startsWith('/iframe/iframe'))) {
        includeUrl.push(itemUrl);
      }
    });
    const tempUrls = includeUrl.filter(item => item === sdoUrl) || [];
    if (tempUrls.length === 0) {
      includeUrl.push(sdoUrl);
    }

    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    // 用于判断display的显隐
    const tmpIncludeUrl = [...includeUrl];
    // 将includeUrl中的路由转化为拼接后的路由
    includeUrl.forEach((item, index)=>{
      const src = `${server}/loginServlet?token=${sessionStorage.getItem('iframeToken') || ''}&callBackUrl=${encodeURIComponent(encodeURIComponent(item.replace('/iframe', '')))}`;
      includeUrl[index] = src;
    });

    return (
      <div className='myBox' style={{ height: '100%' }}>
        {
          includeUrl.map((item, index) => {
            return (
              <div key={item} style={{ visibility: sdoUrl === tmpIncludeUrl[index] ? 'unset' : 'hidden', height: sdoUrl === tmpIncludeUrl[index] ? '100%' : '0' }}>
                <Iframe
                  key={item}
                  target="_top"
                  src={item}
                  width="100%"
                  height="100%"
                  // height={iframeHeight}
                  id="myId"
                  className={styles.iframe}
                  display="initial"
                  position="relative"
                  styles={{ paddingTop: '3px' }}
                  allowFullScreen
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}
export default connect(({global}) => ({
  sysParam: global.sysParam,
}))(DoIframeContent);
