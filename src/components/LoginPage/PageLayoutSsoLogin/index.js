/* 单点登录 */
/* eslint-disable no-debugger */
import React from 'react';
import { message, Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import lodash from 'lodash';
import { FetchSsoLogin, FetchAppSSOLogin } from '../../../services/login';

class PageLayoutSsoLogin extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      ssoLoginUrl: '',
      loading: false,
    };
  }

  componentDidMount() {
    this.handleSsoLogin();
  }

  componentWillReceiveProps(nextProps) {
    this.handleSsoLogin();
  }

  handleSsoLogin = () => {
    const beforeSsoLoginUrl = sessionStorage.getItem('beforeSsoLoginUrl');
    const iasId = '194'; // 测试环境为198，生产环境为194
    const userAgent = navigator.userAgent.toLocaleLowerCase();
    const device = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
    if (device.test(userAgent)) {
      // 移动端
      window.JQAPI.getSSOToken({ ISAID: iasId }, (data) => {
        const ssoIasKey = JSON.parse(data).SSOToken.token;
        const userAccount = JSON.parse(data).SSOToken.useraccount;
        const newResult = JSON.parse(data).SSOToken.result;
        const timeStamp = JSON.parse(data).SSOToken.timestamp;
        const errorDescription = JSON.parse(data).SSOToken.errordescription;
        FetchAppSSOLogin({
          iasId,
          userAccount,
          result: newResult,
          // 生产环境
          iasKey: 'F1706B927DD4A4636A96B87C7710A3EE9BE070F539DC86DF',
          // 测试环境
          // iasKey: '68E2D0D37623B9AF0D6F014E3E24F666DAC820E338B7EDCB',
          timeStamp,
          errorDescription,
          authenticator: ssoIasKey,
        }).then((response) => {
          if (!lodash.isEmpty(beforeSsoLoginUrl) && !lodash.isUndefined(beforeSsoLoginUrl) && !lodash.isNull(beforeSsoLoginUrl)) {
            this.props.dispatch(routerRedux.push(beforeSsoLoginUrl));
          } else {
            this.props.dispatch(routerRedux.push('/#/UIProcessor?Table=WORKFLOW_TOTASKS'));
          }
        }).catch((error) => {
          // eslint-disable-next-line
          alert('错误信息：', error);
        });
      }, (data) => {
        console.log(data);
      });
    } else {
      // PC端
      this.fetchSsoLogin();
    }
  }

  fetchSsoLogin = () => {
    this.setState({ loading: true });
    FetchSsoLogin({}).then((res = {}) => {
      const { data = {} } = res;
      this.setState({
        ssoLoginUrl: data?.content,
        loading: false,
      }, () => this.fetchSsoReceive());
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  fetchSsoReceive = () => {
    document.open();
    document.write(this.state.ssoLoginUrl);
    document.close();
  };

  render() {
    return (
      <React.Fragment>
        <div className="dis-fx alc">
          { this.state.loading ? <Spin size="large" /> : null }
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  theme: global.theme,
}))(PageLayoutSsoLogin);
