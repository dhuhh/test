import React from 'react';
import { connect } from 'dva';
import { Layout, Popover, Row, Col } from 'antd';
import classnames from 'classnames';
import LoginForm from '../../components/WorkPlatForm/LoginPage';
import mapLogo from '../../assets/apex-logo-login.png';
import mapImg from '../../assets/map.png';
import TrackCanvas from './TrackCanvas';
import testImg from '../../assets/dev_app_qrcode.png';
import styles from './index.less';
import { isAuthCode } from '../../utils/config';
import { FetchQryLoginPageConf } from '../../services/commonbase';
import { getUserIP } from '../../utils/getClientIp';

const { Header, Content, Footer } = Layout;

class LoginPageLayout extends React.PureComponent {
  state = {
    bgpicture: '', // 背景图片
    fontcolor: '', // 字体颜色
    sbjcolor: '', // 背景颜色
    logo: '', // logo
    description: '', // 首页描述文字
    sysname: '', // 项目名称
    copyright: '', // 底部版权
    captcha: '',
    qrcode: '', // 二维码
    qrCodeArr: [],

  }

  componentDidMount() {
    this.fetchData();
    // 进入登录页面先获取用户ip保存起来
    this.getIp();
  }

  getIp = () => {
    const isIE = navigator.userAgent.indexOf('Trident') >= 0 || navigator.userAgent.indexOf('Edge') >= 0;
    // eslint-disable-next-line import/no-mutable-exports
    let ip = '';
    if (isIE) {
      ip = '无法获取ip,原因:ie浏览器无法获取';
      localStorage.setItem('userIP', ip);
    } else {
      getUserIP((ipTemp) => {
        if ((ipTemp && ipTemp === -1) || (ipTemp && ipTemp.indexOf(':') === -1)) {
          ip = ipTemp === -1 ? '无法获取ip,原因:浏览器设置不允许' : ipTemp;
          localStorage.setItem('userIP', ip);
        }
      });
    }
  }

  fetchData = () => {
    FetchQryLoginPageConf({
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        const { bgpicture, fontcolor, sbjcolor, logo, description, sysname, copyright, captcha, qrcode } = records[0] || {};
        if (qrcode) {
          const qrCodeArr = JSON.parse(qrcode);
          this.setState({ bgpicture, fontcolor, sbjcolor, logo, description, sysname, copyright, captcha, qrcode, qrCodeArr });
        } else {
          this.setState({ bgpicture, fontcolor, sbjcolor, logo, description, sysname, copyright, captcha, qrcode });
        }
        sessionStorage.setItem('isCaptcha', captcha);
      }
    });
  }

  showDefaultImgError = (e) => {
    e.target.src = testImg;
  }

  setLayoutBg = () => {
    const { sbjcolor = '' } = this.state;
    const bg = document.getElementById('pageLayout');
    if (bg && sbjcolor) {
      bg.style.setProperty('background-color', sbjcolor, 'important');
    }
  }

  render() {
    const { fontcolor = '', bgpicture, logo, description, sysname, copyright, sbjcolor, captcha, qrcode, qrCodeArr } = this.state;
    const { dispatch, theme } = this.props;
    const qrlength = qrCodeArr.length;
    this.setLayoutBg();

    return (
      <Layout id="pageLayout" className={`${theme} loginBg`} style={{ height: '100%', background: `url(https://crm.axzq.com.cn:8081/plug-in/ncrm/images/login/background.png) no-repeat center center`, backgroundSize: bgpicture && 'cover' }}>
        <Header style={{ width: '100%', height: '60px', zIndex: '999', background: '#fff' }}>
          <div className="m-header-login-content">
            <div className="m-logo">
              {
                logo && (
                  <a href="#" className="m-logo-link"><img src={logo} alt="" /></a>
                )
              }
              {
                !logo && (
                  <a href="#" className="m-logo-link"><img src={'https://crm.axzq.com.cn:8081/plug-in/ncrm/images/login/logo.png'} alt="" /></a>
                )
              }
            </div>
            {
              // qrcode
              //   ? (
              //     <div className="m-cellphone">
              //       <Popover
              //         placement="bottom"
              //         title={<div>APP二维码</div>}
              //         content={
              //           <Row>
              //             {/* <QRCode
              //                 value={item.url} //value参数为生成二维码的链接
              //                 alt={item.name}
              //                 size={200} //二维码的宽高尺寸
              //                 fgColor="#000000"  //二维码的颜色
              //                 onError={this.showDefaultImgError}
              //                 logo={item.lj}
              //                 logoWidth={40}
              //                 logoHeight={40}
              //               /> */}
              //             {
              //               qrCodeArr.map((item) => {
              //                 return (
              //                   <Col span={24 / qrlength} key={item.url}>
              //                     <Row>{item.name}</Row>
              //                     <Row>
              //                       <img src={item.url} alt="" />
              //                     </Row>
              //                   </Col>
              //                 );
              //               })
              //             }
              //           </Row>
              //         }
              //       >
              //         <a className="m-cellphone-link"><i className="iconfont icon-phone3" />超级APP下载</a>
              //       </Popover>
              //     </div>
              //   )
              //   : null
            }
          </div>
        </Header>
        <Content style={{ background: bgpicture && 'none' }}>
          <div className="m-layout-content-box">
            {/* {
              bgpicture === '' && (
                <div className="m-layout-content-map">
                  <img src={mapImg} alt="map" />
                  <TrackCanvas width={977} height={737} />
                </div>
              )
            } */}
            <div className="m-layout-content-box-item">
              {/* <div className="m-item-info">
                {
                  sysname && (
                    <h2 style={{ color: fontcolor || '#FFFFFF' }}>{sysname}</h2>
                  )
                }
                {
                  sysname === '' && (
                    <h2 style={{ color: fontcolor || '#FFFFFF' }}>安信证券CRM</h2>
                  )
                }
                <div style={{ color: fontcolor || '#FFFFFF' }}>
                  {
                    description && (
                      <div dangerouslySetInnerHTML={{ __html: description || '' }} />
                    )
                  }
                  {
                    description === '' && (
                      <div>大数据  微服务 智能化<br /> 线上线下全面融合构建业务生态圈<br /> 全新客户画像，全新业务场景、全新MOT<br />  全新互联网交互界面</div>
                    )
                  }
                </div>
              </div> */}
              <div className="m-login-box">
                <div className={classnames('m-login-box-item', isAuthCode === 1 && styles.loginFormBottom)}>
                  <h3 className="login-name" style={{ color: sbjcolor || '' }}>用户登录</h3>
                  <LoginForm dispatch={dispatch} authUserInfo={this.props.authUserInfo} login={this.props.login} sbjcolor={sbjcolor} captcha={captcha} />
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* {
          copyright && (
            <Footer style={{ textAlign: 'center' }}>{copyright}</Footer>
          )
        }
        {
          copyright === '' && (
            <Footer style={{ textAlign: 'center' }}>©福建顶点软件股份有限公司版权所有</Footer>
          )
        } */}
      </Layout>
    );
  }
}

export default connect(({ global, login }) => ({
  authUserInfo: global.authUserInfo,
  theme: global.theme,
  login,
}))(LoginPageLayout);
