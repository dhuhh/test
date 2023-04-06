/* eslint-disable no-debugger */
import React, { Fragment } from 'react';
import LBFrame from 'livebos-frame';
import { Card, Row, Col, Button, List, message, Modal } from 'antd';
import lodash from 'lodash';
import avatorPng from '@/assets/avatar-person-male.png';
import DropdownBox from '@common/DropdownBox';
import BasicModal from '@common/BasicModal';
import { FetchQueryOtherUsers } from '@/services/commonbase';
import { FetchLogout } from '@/services/login';
import { FetchAes } from '@/services/tool';
import { FetchTokenAuth } from '@/services/token';
import { AES } from '@/utils/aes_utils';
import { APP_SECRET, CLIENTID } from '@/utils/config';
import OtherUser from './OtherUser';
import ChangePwd from './ChangePwd';
import styles from './userDrop.less';

const { confirm } = Modal;

export default class UserDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutData: [
        {
          key: 'logout',
          title: '登出',
          icon: 'icon-getOut',
        },
      ],
      visible: false,
      modalTitle: '',
      target: '',
      visibleM: false,
      otherusers: [], // 带条件查出来的其它用户
      allotherusers: [], // 登陆用户的可切换用户
      total: 0, // 用户总数
      loading: false, // 切换用户弹窗
      userId: '',
      roleVisible: false,
      userInfo: '',
      current: '1',
      photos: this.props.userBasicInfo.profileBase64,
    };
  }


  componentDidMount() {
    const { userBasicInfo = {} } = this.props;
    const { loading } = userBasicInfo;
    if (loading === false && Object.keys(userBasicInfo).length > 1) {
      this.getAES();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userBasicInfo } = this.props;
    const { userBasicInfo: newUserBasicInfo = {} } = nextProps;
    const { loading: newloading } = newUserBasicInfo;
    let newIsEnd = false;
    if (newloading === false && Object.keys(newUserBasicInfo).length > 1) {
      newIsEnd = true;
    }
    const { loading } = userBasicInfo;
    let IsEnd = false;
    if (loading === false && Object.keys(userBasicInfo).length > 1) {
      IsEnd = true;
    }
    // IsEnd|newIsEnd true 表示数据加载完毕
    if (!IsEnd && newIsEnd) {
      this.getAES();
    }

    this.setState({
      photos: userBasicInfo.profileBase64,
    });
  }

  getAES = () => {
    const { authUserInfo = {} } = this.props;
    const userId = lodash.get(authUserInfo, 'loginName', '');
    const isSwitchUser = localStorage.getItem('isSwitchUser') || '';
    if (isSwitchUser === 'false') {
      return;
    }
    FetchAes({
      optType: 'encode',
      key: '',
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

  hanldeOtherUsers = ({ userInfo = '', current = '1' }) => {
    this.setState({
      userInfo,
      current,
    }, () => {
      this.getOtherUsers();
    });
  }

  getOtherUsers = () => {
    this.setState({ loading: true });
    const { userInfo, current, userId } = this.state;
    FetchQueryOtherUsers({
      userId,
      paging: 1,
      userInfo: userInfo || '',
      pageSize: 5,
      current,
      sort: '',
      total: -1,
    }).then((response) => {
      const { records = [], total = 0 } = response;
      const arr = records.map((it) => {
        const { roleName } = it;
        const arrroleName = roleName ? JSON.parse(roleName) : '';
        return { ...it, roleName: arrroleName };
      });
      if (!userInfo) {
        this.setState({ allotherusers: arr });
      }
      this.setState({ otherusers: arr, total, loading: false });
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }

  onMessage = (messageObj) => { // iframe的回调事件
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.handleCancel();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      this.props.dispatch({
        type: 'global/checkAuth',
      });
      this.handleCancel();
    }
  }

  buttonShowModal = (url, modalTitle) => {
    const target = `${localStorage.getItem('livebos') || ''}${url}`;
    this.setState({
      visibleM: true,
      target,
      modalTitle,
    });
  }

  // 取消
  handleCancel = () => {
    this.setState({
      visibleM: false,
    });
  }

  showConfirm = () => {
    const userId = localStorage.getItem('firstUserID') || '';
    confirm({
      title: '提示：',
      content: `是否切回初始用户${userId}？`,
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
        FetchTokenAuth({
          CLIENTID,
        }, config).then((result) => {
          const { code = -1 } = result;
          if (code) {
            window.location.href = '';
            localStorage.setItem('firstUserID', ''); // 清除 firstUserID
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() { },
    });
  }

  getDropdownBoxTitle = (userBasicInfo, authUserInfo, photos) => {
    const { width } = this.props;
    const { name = '' } = authUserInfo || {};
    const showPic = photos;
    return (
      <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        <img className="m-avatar" id="userInfoAvatorImg" src={showPic ? `data:image/png;base64,${showPic}` : avatorPng} title="头像" alt="avator" onError={this.showDefaultImgError} />
        <span style={{ paddingLeft: '0.5rem' }}>
          <span className="name" style={{ display: `${width < 1280 ? 'none' : 'inline-block'}` }}>{name}</span>
          <i className="iconfont icon-down-solid-arrow" style={{ fontSize: '1rem', paddingLeft: '0.5rem' }} />
        </span>
      </a>
    );
  }

  getDropbox = (dispatch, userBasicInfo, authUserInfo, otherusers = [], photos) => {
    const { allotherusers } = this.state;
    const { name = '', lastlogin = '', userid = '' } = userBasicInfo || {};
    otherusers.every((it) => {
      if (it.loginName === userid) {
        return false;
      }
      return true;
    });
    const loginmethod = lodash.get(userBasicInfo, 'extAttr.LOGIN_METHOD', '');
    lastlogin.replace(/-/g, '.');
    const userIdOld = localStorage.getItem('firstUserID') || '';
    let span = 24;
    if (allotherusers.length > 0 && userIdOld && userid !== userIdOld) {
      span = 8;
    } else if (allotherusers.length === 0 && !userIdOld) {
      span = 24;
    } else {
      span = 12;
    }
    return (
      <Card
        className="m-card m-user"
      >
        <Row>
          <Col span={24} className="dis-fx">
            <div className="m-panel-introduce flex" style={{ paddingLeft: '1.5rem' }}>
              <div className="m-panel-name">{name}</div>
              <div className="m-panel-id">上次登录时间 {lastlogin}</div>
              {
                loginmethod !== '1' &&
                (
                  <React.Fragment>
                    <Button className="m-btn m-btn-small m-btn-headColor" onClick={() => { return this.cpForm && this.cpForm.showModal(); }}>
                      <span>修改密码</span>
                    </Button>
                    <ChangePwd handleHide={this.handleHide} ref={(node) => { this.cpForm = node; }} />
                  </React.Fragment>
                )
              }
            </div>
          </Col>
        </Row>
        <List
          className="m-list-icon-small"
          itemLayout="horizontal"
          style={{ padding: '0.833rem 0', marginTop: '0.833rem' }}
          dataSource={this.state.logoutData}
          renderItem={item => (
            <Row>
              {
                allotherusers.length > 0 && (
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
                userid !== userIdOld && userIdOld && (
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
                    onClick={() => this.Logout()}
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
  checkPhoto = (photo) => {
    if (photo === '') {
      return avatorPng;
    }
    return `${localStorage.getItem('livebos') || ''}${photo}`;
  }
  showDefaultImgError = (e) => {
    e.target.src = avatorPng;
  }

  Logout = () => {
    FetchLogout({}).then((res) => {
      const { code, note, ssoLogOutUrl } = res;
      if (code === 1) {
        message.success(note);
        window.location.href = ssoLogOutUrl;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 回调 onVisibleChange
  onVisibleChange = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  // showRoleModal
  showRoleModal = () => {
    const { allotherusers = [] } = this.state;
    this.setState({
      roleVisible: true,
      otherusers: allotherusers,
    });
  }

  // closeRoleModal
  closeRoleModal = () => {
    this.setState({
      roleVisible: false,
    });
  }

  // 修改密码成功回调函数
  handleHide = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  // 强制重新渲染
  forceRender = (imageUrl) => {
    const userInfoAvatorImg = document.getElementById('userInfoAvatorImg');
    const userInfoAvatorImgs = document.getElementById('userInfoAvatorImgs');
    if (userInfoAvatorImg) {
      userInfoAvatorImg.src = imageUrl; // userInfo的头像
    }
    if (userInfoAvatorImgs) {
      userInfoAvatorImgs.src = imageUrl; // userInfo的头像
    }
    this.setState({
      // eslint-disable-next-line
      photo: imageUrl,
    });
  }

  // 切换页码
  onPageChange = (page) => {
    this.setState({
      current: page,
    }, () => {
      this.getOtherUsers();
    });
  }

  render() {
    const { userBasicInfo = {}, dispatch, authUserInfo } = this.props;
    const { visibleM, otherusers, total, loading, photos } = this.state;
    const visible = visibleM;
    const dropdownBoxProps = {
      id: 'user',
      title: this.getDropdownBoxTitle(userBasicInfo, authUserInfo, photos),
      dropbox: this.getDropbox(dispatch, userBasicInfo, authUserInfo, otherusers, photos),
    };
    const modalProps = {
      title: this.state.modalTitle,
      width: '36rem',
      height: '46rem',
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };

    return (
      <Fragment>
        <DropdownBox
          className={styles.userDrop}
          visible={this.state.visible}
          style={{ float: 'right', width: 'auto' }}
          onVisibleChange={this.onVisibleChange}
          {...dropdownBoxProps}
        />
        <BasicModal {...modalProps}>
          <LBFrame
            src={this.state.target}
            id="myId"
            className=""
            display="initial"
            allowFullScreen
            frameBorder="no"
            border="0"
            onMessage={this.onMessage}
            style={{ background: 'white', position: 'absolute', width: '100%', height: '36rem' }}
          />
        </BasicModal>
        <BasicModal
          visible={this.state.roleVisible}
          onCancel={this.closeRoleModal}
          footer={null}
          width="60rem"
          title="切换用户"
        >
          <OtherUser
            total={total}
            getOtherUserloading={loading}
            hanldeOtherUsers={this.hanldeOtherUsers}
            dispatch={dispatch}
            closeRoleModal={this.closeRoleModal}
            otherusers={otherusers}
            userBasicInfo={userBasicInfo}
            onPageChange={this.onPageChange}
          />
        </BasicModal>
      </Fragment>
    );
  }
}
