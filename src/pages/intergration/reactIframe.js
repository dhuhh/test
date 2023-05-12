import React from 'react';
// import Iframe from 'react-iframe';
// import debounce from 'lodash.debounce';

class ReactIframe extends React.Component {
  state = {
    iframeHeight: '',
  }
  componentWillMount() {
    // this.setIframeHeight = debounce(this.setIframeHeight, 200);
    // window.addEventListener('resize', this.setIframeHeight); // 后期优化为resizeobserver
    this.setIframeHeight();
  }

  setIframeHeight = () => {
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `${windowInnerHeight - 66 - 55}px`;
    this.setState({
      iframeHeight,
    });
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
  render() {
    const { iframeHeight } = this.state;
    const { location: { pathname, search = '', hash = '' } } = this.props;
    let livebosUrl;
    livebosUrl = pathname + search + hash;

    if (livebosUrl.indexOf('iframe') >= 0) {
      livebosUrl = livebosUrl.replace('/iframe/', '');
    }
    if (livebosUrl.startsWith('http') === -1) {
      livebosUrl = livebosUrl.indexOf('?') > 0 ? `${livebosUrl}&time=${new Date().getTime()}` : `${livebosUrl}&time=${new Date().getTime()}`; // 支持点击菜单刷新
    }

    return (
      <iframe
        id="myId"
        title={livebosUrl}
        target="_top"
        src={livebosUrl}
        width="100%"
        frameBorder="no"
        height={iframeHeight}
        className=""
        display="initial"
        position="relative"
        style={{ position: 'relative', display: 'initial', width: '100%', paddingTop: '3px' }}
        allowFullScreen
      />
    );
  }
}
export default ReactIframe;
