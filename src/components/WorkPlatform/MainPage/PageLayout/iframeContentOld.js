/* eslint-disable no-debugger */
import React from 'react';
import LBFrame from 'livebos-frame';
import debounce from 'lodash.debounce';
import eventUtils from 'livebos-frame/dist/utils/event';
import { prefix } from '../../../../utils/config';

class IframeContent extends React.Component {
  constructor(props) {
    super(props);
    this.setIframeHeight = debounce(this.setIframeHeight, 300);
    this.state = {
      iframeHeight: 0,
    };
  }

  componentWillMount() {
    eventUtils.attachEvent('message', this.onMessage);
    window.addEventListener('resize', this.setIframeHeight); // 后期优化为resizeobserver
    this.setIframeHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setIframeHeight);
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
        window.location.href = `/#${prefix}/login`;
        break;
      default:
        break;
    }
  }

  setIframeHeight = () => {
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `${windowInnerHeight - 128}px`;
    this.setState({
      iframeHeight,
    });
  }

  handleExclude = (pathname = '') => {
    const includes = ['/OperateProcessor', '/ShowWorkflow', '/StartWorkflow', '/WorkProcessor', 'UIProcessor'];
    let flag = true;
    includes.forEach((item) => {
      if (pathname.indexOf(item)) {
        flag = false;
      }
    });
    return flag;
  }

  render() {
    const { iframeHeight } = this.state;
    const { location: { pathname, search = '' } } = this.props;
    let livebosUrl;
    livebosUrl = pathname + search; // 支持点击菜单刷新
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const includeUrl = [];
    recentlyVisitedUrls.forEach((item) => {
      const itemUrl = item.split('|')[0];
      if (itemUrl.startsWith('/OperateProcessor') || itemUrl.startsWith('/ShowWorkflow')) {
        includeUrl.push(itemUrl);
      }
    });
    const tempUrls = includeUrl.filter(item => item === livebosUrl);
    if (tempUrls.length === 0) {
      includeUrl.push(livebosUrl);
    }
    return (
      <React.Fragment>
        {
          includeUrl.map((item) => {
            return (
              <div
                key={item}
                style={{
                  overflow: 'hidden',
                  display: livebosUrl === item ? '' : 'none',
                }}
              >
                <LBFrame
                  key={item}
                  src={`${localStorage.getItem('livebos') || ''}${item}`}
                  height={iframeHeight}
                  id="myId"
                  className=""
                  style={{ position: 'relative', display: 'initial', width: '100%' }}
                  allowFullScreen
                  frameBorder="no"
                  border="0"
                  onMessage={this.onMessage}
                />
              </div>
            );
        })
        }
      </React.Fragment>
    );
  }
}

export default IframeContent;
