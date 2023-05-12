import React from 'react';
import { Layout, Row, Col, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import classnames from 'classnames';
import UserDrop from './userDrop';
import SearchInput from './searchInput';
import { FetchQueryBackLogNum } from '$services/searchInput';
import { FetchEncryptAES } from '$services/commonbase';
import { UserBasicInfo } from '$services/login';
import styles from './index.less';
import addTabbar from '$utils/addTabbar';
import CustomerTag from '../../../../assets/customer/customerTags3.png'
import apiUrl from '../../../../../config/proxy';

class PageHeader extends React.PureComponent {
  state = {
    number: 0, // 记录待办未读消息数
    xiaoanUrl: '', // 小安问答路由
  }

  componentDidMount() {
    this.getBackLogNum();
    this.getXiaoanUrl();
  }

  getBackLogNum = () => { // 获取消息未读数
    FetchQueryBackLogNum().then((response) => {
      const { total = 0 } = response || {};
      this.setState({
        number: total,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  getXiaoanUrl = () => {  // 获取用户id
    UserBasicInfo().then((response) => {
      const { code = 0, records = [] } = response || {};
      if(code > 0 && records && records.length > 0) {
        this.setResultUrl(records[0].id);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  setResultUrl = (id) => { // 拼接小安问答路由
    const { sysParam = [] } = this.props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    const key = '75144a55D3b24B95972C71FeC4FF5345';
    FetchEncryptAES({content: id, key: key}).then((response) => { 
      // 生产路由 https://icsp.essence.com.cn/xawdpc/user/login?staffId=
      const url = server === 'https://crm.axzq.com.cn:8081' ? 'https://test-h5.essence.com.cn/xawdpc/user/login?staffId=' : 'https://icsp.essence.com.cn/xawdpc/user/login?staffId=';
      const { result = '' } = response || {}; // result接口返回的加密后的内容
      // console.log('小安问答最终路由=========', `${url}${result}`);
      this.setState({
        xiaoanUrl: `${url}${result}`,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { menuLangKey, menuTree, style = {}, authorities = {}, logo, userBusinessRole, location, theme, handleThemeChange, dispatch, userBasicInfo, dictionary, authUserInfo, messageDrop, fetchMenuDatas, name = '', menuSchemeName = '' } = this.props;
    const { globalSearch } = authorities;
    const { number } = this.state;
    return (
      <Layout.Header className="m-header" style={{ width: '100%', ...style }}>
        <Row>
          <Col className='left'>
            <div style={{ marginLeft: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '55px' }}>
                <img src={logo} alt="logo" />
                <div style={{ width: '1px', height: '16px', marginLeft: '11px', marginRight: '10px', backgroundColor: '#D1D5E6', opacity: '0.6' }} />
                <span style={{ fontSize: '14px', color: 'white', height: '55px' }}>安信财富管家</span>
              </div>
            </div>
          </Col>
          <Col className="right" style={{ marginLeft: '22px' }}>
            <UserDrop dispatch={dispatch} userBasicInfo={userBasicInfo} authUserInfo={authUserInfo} />
          </Col>
          <Col className={classnames('right', styles.message)}>
            <Link to={'/customer/customerTags'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={CustomerTag} style={{width:'20px',height:'20px'}}/>
                <span style={{ fontSize: '14px', color: '#FFFFFF', marginLeft: '2px', verticalAlign: 'middle',fontWeight:'400' }}>标签指标说明</span>
              </div>
            </Link>
          </Col>
          <Col className={classnames('right', styles.message)}>
            <a href={this.state.xiaoanUrl} target='_blank'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className='iconfont icon-xiaoanwendaicon' style={{ fontSize: '20px', color: '#fff' }} />
                <span style={{ fontSize: '14px', color: '#FFFFFF', marginLeft: '2px', verticalAlign: 'middle',fontWeight:'400' }}>小安问答</span>
              </div>
            </a>
          </Col>
          <Col className={classnames('right', styles.message)}>
            <Link to={ '/newProduct/work/message' }>
              <div onClick={() => {addTabbar('/newProduct/work/message|');}} style={{ display: 'flex', alignItems: 'center' }}>
                <i className='iconfont icon-xiaoxiicon' style={{ fontSize: '20px', color: '#fff' }} />
                <span style={{ fontSize: '14px', color: '#FFFFFF', marginLeft: '2px', verticalAlign: 'middle',fontWeight:'400' }}>消息</span>
              </div>
            </Link>
          </Col>
          <Col className='right' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Link to={ '/newProduct/work/backlog' } className={styles.todo}>
              <div onClick={() => {addTabbar('/newProduct/work/backlog|');}} style={{ display: 'flex', alignItems: 'center' }}>
                <i className='iconfont icon-daibanicon' style={{ fontSize: '20px', color: '#fff' }} />
                <span style={{ fontSize: '14px', color: '#FFFFFF', marginLeft: '2px', verticalAlign: 'middle',fontWeight:'400' }}>待办</span>
              </div>
            </Link>
            {number ?
              (
                <span className="m-badge ant-badge ant-badge-not-a-wrapper">
                  <sup data-show="true" className="ant-scroll-number ant-badge-count ant-badge-multiple-words" title="109" 
                    style={{ 
                      display: 'block', height: '16px', marginLeft: '-14px', marginTop: '-15px', marginRight: '12px', lineHeight: '16px', padding: '0 2px', fontSize: '12px', backgroundColor: '#E81818' }}>
                      {number > 99 ? '99+' : number}
                  </sup>
                </span>
              ) : ''
            }
          </Col>
          {/* {
            Object.keys(authorities).includes('globalSearch') && ( */}
              <Col className="right" style={{ marginRight: '22px' }}>
                {/* <SearchInput menuTree={menuTree} searchAuth={globalSearch} /> */}
                <SearchInput menuTree={menuTree} searchAuth={'searchCustomer,searchProduct'} />
              </Col>
            {/* )
          } */}
        </Row>
      </Layout.Header>
    );
  }
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(PageHeader);