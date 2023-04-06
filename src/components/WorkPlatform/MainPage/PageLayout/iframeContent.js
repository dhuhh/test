import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Bridge from 'livebos-bridge';

const iframeRef = React.createRef();
const { events } = Bridge.constants;
class IframeContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframeHeight: 0,
    };
  }

  setIframeHeight = () => {
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `${windowInnerHeight - 114}px`;
    this.setState({
      iframeHeight,
    });
  };

  componentDidMount() {
    this.setIframeHeight();
    this.connect();
  }

  connect = () => {
    const bridge = new Bridge(iframeRef.current.contentWindow);
    bridge.onReady(() => {
      bridge.on(events.SESSION_TIME_OUT, () => {
        console.log('会话超时');
        routerRedux.push('/login');
      });
      bridge.on(events.SESSION_LOCKED, () => {
        console.log('会话锁定');
      });
      bridge.on(events.SESSION_UNLOCKED, () => {
        console.log('会话解锁');
      });
      bridge.on(events.THEME_CHANGED, ({ name }) => {
        console.log('主题切换:', name);
      });
      bridge.on(events.OPERATE_CALLBACK, (data) => {
        console.log('操作回调', data);
      });
    });
  };

  handleLoad = (e) => {
    const { search } = e.target.contentWindow.location;
    if (!search) {
      this.props.dispatch(routerRedux.push('/processNavigation'));
    }
  }

  render() {
    const { iframeHeight } = this.state;
    const { location: { pathname, search = '' } } = this.props;
    const livebosUrl = pathname + search; // 支持点击菜单刷新
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const includeUrl = [];
    recentlyVisitedUrls.forEach((item) => {
      const itemUrl = item.split('|')[0];
      if (itemUrl.startsWith('/UIProcessor') || itemUrl.startsWith('/OperateProcessor') || itemUrl.startsWith('/ShowWorkflow')) {
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
          includeUrl.map((item) => ( // eslint-disable-line
            <div
              key={item}
              style={{
                overflow: 'hidden',
                display: livebosUrl === item ? '' : 'none',
              }}
            >
              <iframe
                ref={iframeRef}
                title='livebos' // eslint-disable-line
                src={`${localStorage.getItem('livebos') || ''}${item}`}
                style={{
                  overflow: 'hidden',
                  width: '100%',
                  height: iframeHeight,
                  border: '0',
                }}
                onLoad={this.handleLoad}
              />
            </div>
          ))
        }
      </React.Fragment>
    );
  }
}
export default connect()(IframeContent);
