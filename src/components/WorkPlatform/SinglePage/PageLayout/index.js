import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Layout } from 'antd';
import Exception from '../../../../components/Exception';

const { Content } = Layout;

class SinglePageLayout extends React.PureComponent {
  componentDidMount() {
    this.setStyle();
  }

  setStyle = () => {
    document.getElementsByTagName('body')[0].className = 'blue-lightgray-theme';
  }

  render() {
    const { theme, routes } = this.props;
    return (
      <Layout className={`${theme}`} style={{ height: '100%' }}>
        <Content style={{ minHeight: '100%', backgroundColor: '#fff' }}>
          <CacheSwitch>
            {
              // 路由
              routes.map(({ key, path, component }) => (
                <CacheRoute
                  key={key || path}
                  path={path}
                  component={component}
                />
              ))
            }
            <CacheRoute render={() => <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />} />
          </CacheSwitch>
        </Content>
        <Content id="modalContent" />
      </Layout>
    );
  }
}

export default connect(({ global, singlePage }) => ({
  theme: global.theme || 'blue-lightgray-theme',
  singlePage,
}))(SinglePageLayout);
