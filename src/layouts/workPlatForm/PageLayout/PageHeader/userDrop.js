import React, { Fragment } from 'react';
import { Card, Row, Col, Button, List, Tag, Spin, Modal, message, Popover } from 'antd';
import lodash from 'lodash';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { FetchTokenAuth } from '../../../../services/token';
import { AES } from '../../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../../utils/config';
import styles from './userDrop.less';
import avatorPng from '../../../../assets/user.jpg';
import DropdownBox from '../../../../components/Common/DropdownBox';
import ChangePwd from './ChangePwd';
// import { SysVersionNum } from '../../../../../services/login'; // 查询当前版本 -废掉
import BasicModal from '../../../../components/Common/BasicModal';
import VersionInfoList from './versionInfoList';
import Avator from './Avator';
import addTabbar from '$utils/addTabbar';
import { FetchQueryOtherUsers } from '../../../../services/commonbase';
import { fetchUserBasicInfo } from '../../../../services/commonbase/userBasicInfo';
// import VersionInfoList from './versionInfoList';
import OtherUser from './OtherUser';
import { FetchAes } from '../../../../services/tool';
import { AdminAccountLogout } from '$services/login';
import close from '$assets/pageLayout/close.png';
import rightArrow from '$assets/pageLayout/right_arrow.png';
import quit from '$assets/pageLayout/quit.png';
import userImage from '$assets/pageLayout/userImage.png';

const { confirm } = Modal;

class UserDrop extends React.Component {
  constructor(props) {
    super(props);
    const { authUserInfo } = props;
    const { photo = '' } = authUserInfo;
    // const showPic = photo ? `data:image/png;base64,${photo}` : this.getDefaultPng();
    // const showPic = this.getDefaultPng();
    const showPic = userImage;
    this.state = {
      // sysVersionNum: {
      //   bbh: '',
      //   xqqx: '',
      // },
      logoutData: [
        {
          key: 'logout',
          title: '登出',
          icon: 'icon-getOut',
        },
      ],
      visible: false,
      roleVisible: false,
      otherusers: [], // 带条件查出来的其它用户
      allotherusers: [], // 登陆用户的可切换用户
      total: 0, // 带条件查询的用户总数
      allTotal: 0, // 登陆查询的用户总数
      loading: false, // 切换用户弹窗
      userId: '',
      avatorShowPic: showPic,
      popoverVisible: false, // 控制气泡卡片是否弹出
      TableData: [], // 其他用户角色信息
      UserData: [], // 模糊搜索用户名信息
      userTotal: 0, // 记录下拉列表用户数
    };
  }

  componentDidMount() {
    const { userBasicInfo = {} } = this.props;
    const { loading } = userBasicInfo;
    if (loading === false && Object.keys(userBasicInfo).length > 1) {
      this.getAES();
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { userBasicInfo: newUserBasicInfo = {} } = nextProps;
    const { loading: newloading } = newUserBasicInfo;
    let newIsEnd = false;
    if (newloading === false && Object.keys(newUserBasicInfo).length > 1) {
      newIsEnd = true;
    }

    const { userBasicInfo = {} } = this.props;
    const { loading } = userBasicInfo;
    let IsEnd = false;
    if (loading === false && Object.keys(userBasicInfo).length > 1) {
      IsEnd = true;
    }
    // IsEnd|newIsEnd true 表示数据加载完毕
    if (!IsEnd && newIsEnd) {
      this.getAES();
    }

    this.forceRender();
  }
  getAES = () => {
    const userId = localStorage.getItem('firstUserID') || '';
    const isSwitchUser = localStorage.getItem('isSwitchUser') || '';
    if (isSwitchUser === 'false') {
      return;
    }
    FetchAes({
      optType: 'encode',
      content: userId,
    }).then((ret) => {
      const { code = 0, note = '', data = '' } = ret;
      if (code > 0) {
        this.setState({ userId: data }, () => this.getOtherUsers({}));
      } else {
        message.error(note);
      }
    });
  }
  getOtherUsers = ({ userInfo = '' }) => {
    this.setState({ loading: true });
    const { userId } = this.state;
    FetchQueryOtherUsers({
      userId,
      paging: 1,
      userInfo: userInfo || '',
      // pageSize: 5,
      // current,
      sort: '',
      total: -1,
    }).then((response) => {
      const { records = [], total = 0 } = response;
      // 存储其他用户角色信息
      this.setState({ TableData: records });

      const arr = records.map((it) => {
        const { roleName } = it;
        const arrroleName = JSON.parse(roleName);
        return { ...it, roleName: arrroleName };
      });
      if (!userInfo) { 
        this.setState({ allotherusers: arr, allTotal: total });
      }
      this.setState({ otherusers: arr, total, loading: false });
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 输入框下拉列表搜索回调
  getUserName = (userInfo = '', curPage ) => {
    const { userId } = this.state;
    FetchQueryOtherUsers({
      userId,
      paging: 1,
      userInfo: userInfo || '',
      pageSize: 10,
      current: curPage,
      sort: '',
      total: -1,
    }).then((response) => {
      const { records = [], total = 0 } = response;
      // 存储下拉列表用户角色信息
      this.setState({ UserData: [...this.state.UserData, ...records], userTotal: total });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 关键字清空列表数据
  clearUserData = () => {
    this.setState({
      UserData: [],
    });
  }

  showConfirm = () => {
    const userId = localStorage.getItem('firstUserID') || '';
    confirm({
      title: '提示：',
      content: `是否切回初始用户{${userId}}？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const obj = { timestamp: new Date().getTime(), target: userId };
        let objJson = '{}';
        try {
          objJson = JSON.stringify(obj);
        } catch (e) {
          // do not
        }
        AES.setSecret(APP_SECRET);
        const config = {
          headers: { 'X-Auth-Token': AES.encryptBase64(objJson) },
        };
        // 该字段为true, 表明进行了退出切换
        sessionStorage.setItem('isUserChange', 'true');
        FetchTokenAuth({
          CLIENTID,
        }, config).then((result) => {
          const { code = -1 } = result;
          if (code) {
            window.location.href = '';
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() { },
    });
  }

  // 用户下拉选项
  userPopover = (dispatch) => {
    const { authUserInfo = {} } = this.props;
    const { loginName = '' } = authUserInfo || {}; // loginName 为当前登陆人
    const userId = localStorage.getItem('firstUserID') || ''; // userId为从登录界面登录的用户id
    const list = [{ name: '员工主页', icon: rightArrow }, { name: loginName === userId && loginName === 'admin' ? '切换用户' : '退出切换', icon: rightArrow }, { name: '退出登录', icon: quit }];
    // const list = [{ name: '员工主页', icon: rightArrow }, { name: loginName === userId && loginName === 'admin' ? '切换用户' : '退出切换', icon: rightArrow }];
    return(
       // 1,2,3个模块高度分别为45, 89, 132
       <div style={{ width: '204px', height: loginName !== 'admin' && loginName === userId ? '89px' : '132px' }}>
        {
          list.map((item, index) => {
            return(
              <Link key={index} to={ '/newProduct/staff' } style={{ display: index === 1 && loginName !== 'admin' && loginName === userId ? 'none' : 'visible' }}>
                <div onClick={ (e) => this.popoverClick(e, index, dispatch, loginName === userId)} style={{ cursor: 'pointer' }}>
                  <div className={index === 2 ? '' : styles.itemHover} style={{ display: 'flex', padding: '12px', width: '204px', height: '44px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: index === 2 ? '#F6F6F6' : '#ffffff' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px' }}>{item.name}</span>
                      { index === 1 && loginName !== userId && (
                          <div className={styles.switch}>已切换</div>
                        ) 
                      }
                    </div>
                    <img src={item.icon} style={{ width: '14px', height: '14px' }} />
                  </div>
                  { index === 0 && (<div style={{ width: '180px', height: '1px', backgroundColor: '#F6F6F6' }} />) }
                </div>
              </Link>
            );
          })
        }
      </div>
    );
  }

  // 用户点击跳转页面
  popoverClick = (e, index, dispatch, isCurrent) => { // isCurrent为true表示还没有切换用户
    if(index === 0) { // 员工主页
      // 添加当前页面页签到tablan
      addTabbar('/newProduct/staff|');
      // 关闭气泡
      this.setState({
        popoverVisible: false,
      });
    } else if(index === 1){
      if(isCurrent) {
        // 用户切换
        this.showRoleModal();
        // 关闭气泡
        this.setState({
          popoverVisible: false,
        });
        // 防止触发link
        e.preventDefault();
      } else {
        this.showConfirm();
        // 防止触发link
        e.preventDefault();
      }
    } else {
      // 退出登录
      this.handleLogout(dispatch);
      // 关闭气泡
      this.setState({
        popoverVisible: false,
      });
      // 防止触发link
      e.preventDefault();
    }
  }

  getDropdownBoxTitle = (authUserInfo, userBasicInfo, showPic, dispatch) => {
    const { name = '' } = authUserInfo || {};
    return (
      <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        <Popover placement="bottomRight" visible={this.state.popoverVisible} onVisibleChange={this.handleVisibleChange} content={this.userPopover(dispatch)} trigger="click" overlayClassName={styles.popover}>
          <img className="m-avatar" src={showPic} title="头像" alt="avator"  onError={this.showDefaultImgError} />
        </Popover>
        <span style={{ paddingLeft: '6px', paddingRight: '16px' }}>
          <span className="name" style={{ fontSize: '14px', color: '#FFFFFF' }}>{name}</span>
        </span>
      </a>
    );
  }

  // 从浮层内关闭
  handleVisibleChange= (visible) =>{
    this.setState({
      popoverVisible: visible,
    });
  }

  getDropbox = (dispatch, userBasicInfo, otherusers = [], showPic) => {
    // 注意 这里的userBasicInfo是this.props.authUserInfo
    // loginName 为当前登陆人
    const { name = '', loginName = '' } = userBasicInfo || {};
    const { allotherusers = [] } = this.state;
    let arr = [];
    otherusers.every((it) => {
      if (it.loginName === loginName) {
        arr = it.roleName;
        return false;
      }
      return true;
    });
    const lastlogin = lodash.get(userBasicInfo, 'extAttr.LAST_LOGIN', '--');
    const loginmethod = lodash.get(userBasicInfo, 'extAttr.LOGIN_METHOD', '');
    lastlogin.replace(/-/g, '.');
    const userId = localStorage.getItem('firstUserID') || '';
    let span = 24;
    if (allotherusers.length > 0 && loginName !== userId) {
      span = 8;
    } else if (allotherusers.length === 0 && loginName === userId) {
      span = 24;
    } else {
      span = 12;
    }
    return (
      <Card
        className="m-card m-user"
        style={{height: '54px'}}
      >
        <Row>
          <Col span={24}>
            <div className="m-panel-img" style={{ paddingLeft: '0.583rem', paddingRight: '0.583rem' }}>
              <Avator dispatch={dispatch} avatorShowPic={showPic} userBasicInfo={userBasicInfo} forceRender={this.forceRender} />
            </div>
            <div className="m-panel-introduce" style={{ float: 'unset' }}>
              <div className="m-panel-name">{name}</div>
              <div className="m-panel-id">上次登录时间 {lastlogin.replace(/-/g, '.')}</div>
              {
                loginmethod !== '1' &&
                (
                  <React.Fragment>
                    <Button className="m-btn m-btn-small m-btn-headColor" onClick={() => { return this.cpForm && this.cpForm.showModal(); }}>
                      <span>修改密码</span>
                    </Button>
                    <ChangePwd ref={(node) => { this.cpForm = node; }} />
                  </React.Fragment>
                )
              }
            </div>
          </Col>
        </Row>
        {
          arr.length > 0 && (
            <div className="clearfix" style={{ padding: '0.833rem 1rem', borderTop: '1px solid #ecedee' }}>
              <span style={{ float: 'left' }}>当前角色：</span>
              {
                arr.map((it, index) => {
                  return <Tag style={{ float: 'left', marginBottom: '0.2rem' }} key={index} color="blue">{it}</Tag>;
                })
              }
            </div>
          )
        }
        <List
          className="m-list-icon-small"
          itemLayout="horizontal"
          style={{ padding: '0.833rem 0', marginTop: '0.833rem' }}
          dataSource={this.state.logoutData}
          renderItem={item => (
            <Row>
              {
                allotherusers.length > 0 (
                  <Col span={span}>
                    <List.Item
                      style={{ borderBottom: 'none' }}
                    >
                      <List.Item.Meta
                        onClick={() => this.showRoleModal()}
                        avatar={<i className="iconfont icon-groupLine" />}
                        title={<span>用户切换</span>}
                      />
                    </List.Item>
                  </Col>
                )
              }
              {
                loginName !== userId && (
                  <Col span={span}>
                    <List.Item
                      style={{ borderBottom: 'none' }}
                    >
                      <List.Item.Meta
                        onClick={() => this.showConfirm()}
                        avatar={<i className="iconfont icon-addressee" />}
                        title={<span>退出切换</span>}
                      />
                    </List.Item>
                  </Col>
                )
              }
              <Col span={span}>
                <List.Item
                  style={{ borderBottom: 'none' }}
                >
                  <List.Item.Meta
                    onClick={() => this.handleLogout(dispatch)}
                    avatar={<i className={`iconfont ${item.icon}`} />}
                    title={<span>{item.title}</span>}
                  />
                </List.Item>
              </Col>
            </Row>
          )}
        />
      </Card>
    );
  }
  showDefaultImgError = (e) => {
    e.target.src = this.getDefaultPng();
  }

  getDefaultPng = () => {
    // const { sysParam = [] } = this.props;
    const server = 'https://crm.essence.com.cn:8081';
    return `${server}/Picture?dFVzZXIvUGhvdG8vMC8wLzE4MWY2OWE4ZjE1`;
  }

  handleLogout = (dispatch) => {
    const { authUserInfo } = this.props;
    const { loginName = '' } = authUserInfo || {};
    if(loginName && loginName === 'admin' ) {
      dispatch({ type: 'login/fetOperationLogOut' });
      dispatch({ type: 'global/adminLogout' });
    } else {
      dispatch({ type: 'login/fetOperationLogOut' });
      dispatch({ type: 'global/logout' });
    }
  }

  showRoleModal = () => {
    const { allotherusers = [], allTotal = 0 } = this.state;
    this.setState({
      roleVisible: true,
      otherusers: allotherusers,
      total: allTotal,
    });
  }

  closeRoleModal = () => {
    this.setState({
      roleVisible: false,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  // 强制重新渲染
  forceRender = () => {
    fetchUserBasicInfo({
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        const photo = records[0].extAttr.profileBase64;
        // const showPic = this.getDefaultPng();
        const showPic = userImage;
        let userInfoAvatorImg = document.getElementById('userInfoAvatorImg');
        if (userInfoAvatorImg) {
          userInfoAvatorImg.setAttribute('src', showPic); // userInfo的头像
        }
        this.setState({ avatorShowPic: showPic });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { otherusers = [], loading = false, total = 0, avatorShowPic: showPic = '', TableData = [], UserData = [], roleVisible, userTotal } = this.state;
    const { authUserInfo, userBasicInfo = {}, dispatch } = this.props;
    // const dropdownBoxProps = {
    //   id: 'user',
    //   title: this.getDropdownBoxTitle(authUserInfo, userBasicInfo, showPic, dispatch),
    //   dropbox: this.getDropbox(dispatch, authUserInfo, otherusers, showPic),
    // };
    return (
      <Fragment>
        <Spin spinning={loading}>
          { this.getDropdownBoxTitle(authUserInfo, userBasicInfo, showPic, dispatch) }
          {/* <DropdownBox
            className={styles.userDrop}
            style={{ float: 'right', width: 'auto' }}
            {...dropdownBoxProps}
          /> */}
          {/* <BasicModal
            visible={this.state.visible}
            onCancel={this.closeModal}
            footer={null}
            width="60rem"
            title="版本信息"
          >
            <VersionInfoList />
          </BasicModal> */}
          <BasicModal
            visible={this.state.roleVisible}
            className={styles.userModal}
            onCancel={this.closeRoleModal}
            width="757px"
            title="切换用户"
            centered
            footer={null}
            closeIcon={<img src={close} style={{ height: '16px', width: '16px' }} />}
          >
            <OtherUser total={total} userTotal={userTotal} TableData={TableData} UserData={UserData} getOtherUserloading={loading} getOtherUsers={this.getOtherUsers} getUserName={this.getUserName} clearUserData={this.clearUserData} dispatch={dispatch} closeRoleModal={this.closeRoleModal} otherusers={otherusers} userBasicInfo={authUserInfo} roleVisible={roleVisible}  />
          </BasicModal>
        </Spin>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  authUserInfo: global.authUserInfo,
  sysParam: global.sysParam,
}))(UserDrop);
