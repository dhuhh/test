import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import LoginForm from '../Login';
import logo from '../../../assets/apex-logo-logins.png';
import mapImg from '../../../assets/map.png';
import TrackCanvas from '../TrackCanvas';
import { FetchQryLoginPageConf } from '../../../services/login';

const { Header, Content, Footer } = Layout;

class LoginPageLayout extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      captcha: '',
      copyright: '',
    };
  }

  fetchData = () => {
    sessionStorage.setItem('isCaptcha', '{"c5::pc":0,"c5::app":0}');
    FetchQryLoginPageConf({}).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        const {
          copyright,
          captcha,
        } = records[0] || {};
        this.setState({
          captcha,
          copyright,
        });
        sessionStorage.setItem('isCaptcha', captcha);
      }
    });
  };

  componentDidMount() {
    // 设置应用名称
    const applicationName = localStorage.getItem('applicationName') || '产品中心';
    document.title = applicationName;
    this.fetchData();
  }

  render() {
    const { captcha, copyright } = this.state;
    const { dispatch, theme } = this.props;
    return (
      <Layout
        className={`${theme} loginBg {/*loginBg_ht*/}`}
        style={{ height: '100%' }}
      >
        <Header className="m-header-login">
          <div className="m-header-login-content">
            <div className="m-logo">
              <a href="#" className="m-logo-link">
                <img src={logo} alt="" width="160" />
              </a>
            </div>
            <h2
              style={{
                color: '#fff',
                float: 'left',
                paddingLeft: '1rem',
                fontSize: '2.333rem',
              }}
            >
              产品中心
            </h2>
          </div>
        </Header>
        <Content>
          <div className="m-layout-content-box">
            <div className="m-layout-content-map">
              <img src={mapImg} alt="map" />
              <TrackCanvas width={977} height={737} />
            </div>
            <div className="m-layout-content-box-item">
              <div className="m-item-info" />
              <div className="m-login-box">
                <div className="m-login-box-item">
                  <h3 className="login-name">用户登录</h3>
                  <LoginForm
                    dispatch={dispatch}
                    login={this.props.login}
                    captcha={captcha}
                  />
                </div>
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          {copyright || '@2021 武汉顶点软件有限公司 本系统由顶点软件有限公司开发制作，未经许可，不得侵权使用！'}
        </Footer>
      </Layout>
    );
  }
}

export default connect(({ global, login }) => ({
  theme: global.theme,
  login,
}))(LoginPageLayout);
