import React from 'react';
import { Form, Input, Button, Alert, Layout, message, Row, Col, Checkbox } from 'antd';
import lodash from 'lodash';
import classnames from 'classnames';
import BasicModal from '../../../components/Common/BasicModal';
import ChangePwdContent from '../../../layouts/workPlatForm/PageLayout/PageHeader/ChangePwd';
// import SaveCheckbox from './SaveCheckbox';
import FindPwd from './FindPwd';
import { FetchResetPassword, FetchLoginPageConf } from '../../../services/commonbase';
import { FetchSmsCaptcha, FetchCheckWhtLstIP } from '../../../services/login';
import { AES } from '../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../utils/config';
import styles from './index.less';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    // 安全等级字典
    this.aqdjDic = {
      0: { label: '', color: '' },
      1: { label: '弱', color: '#AA0033' },
      2: { label: '中等', color: '#FFCC33' },
      3: { label: '安全', color: '#6699CC' },
      4: { label: '高', color: '#008000' },
    };
    this.state = {
      inputType: 'text',
      visible: false,
      okBtnVisible: true,
      errMsg: '',
      // captcha: 'false',
      timeCount: 60,
      timeVisible: false, // 手机验证码计时器
      whtLstIpRslt: 'false', // ip是否在白名单，protoType: String
      allowCRMLogin: '1', // 非admin用户是否允许从本页面登录
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.checkWhtLstIP();
    this.verifyOtherUserLogin();
  }


  componentWillReceiveProps(nextProps) {
    // const { login: { loginNote: preLoginNote } } = this.props;
    const { login: { loginCode, loginNote } } = nextProps;
    if (loginCode < 0 && loginNote.indexOf('周期') >= 0) { //  && preLoginNote !== loginNote
      if (this.cpForm) {
        this.cpForm.showModal();
      }
    }
  }

  componentWillUnmount() {
    this.aqdjDic = null;
  }

  // 判断非admin用户是否能从crm登录
  verifyOtherUserLogin = () => {
    FetchLoginPageConf({}).then((response) => {
      const { code = 0, record = [] } = response || {};
      if(code > 0 && record.length > 0 && record[0].csz) {
        this.setState({ allowCRMLogin: record[0].csz });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 判断IP是否在白名单
  checkWhtLstIP = () => {
    FetchCheckWhtLstIP({
      tgtIp: '',
    }).then((ret = {}) => {
      const { code = 0, checkRslt = '' } = ret;
      console.log("999999999999:",ret);
      if (code > 0) {
        this.setState({ whtLstIpRslt: checkRslt });
      }
    });
  }

  onChangeRemember = (e) => {
    if (e.target.checked) {
      localStorage.setItem('isRemeber', '0');
    } else {
      localStorage.setItem('isRemeber', '1');
    }
  }

  setOkVisible = (isNot) => {
    this.setState({
      okBtnVisible: isNot,
    });
  }

  ChangeType = () => {
    const { inputType } = this.state;
    if (inputType === 'text') {
      this.setState({
        inputType: 'password',
      });
    }
  }

  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { captcha } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (localStorage.getItem('isRemeber') === '0') { // 记住密码
          localStorage.setItem('rUserName', values.userName || '');
        }
        if(values.userName === 'admin' ) {
          this.props.dispatch({
            type: 'login/adminLogin',
            payload: values,
          }).then(() => {
            // 刷新验证码
            this.changeAuthCode();
          });
        } else {
          if(this.state.allowCRMLogin === '1') { // 允许非admin用户从crm登录
            this.props.dispatch({
              type: 'login/adminLogin', // 为C5登录接口，对所有用户通用
              payload: values,
            }).then(() => {
              // 刷新验证码
              this.changeAuthCode();
            });
          } else if(this.state.allowCRMLogin === '0') {
            message.info('您无法通过此页面登录！');
          }
        }
      } else {
        const { userName = '', password = '', verifyCode = '', authCode = '' } = values;
        let authCodeFlag = 0;
        if (captcha) {
          const isCaptchaOb = JSON.parse(captcha);
          authCodeFlag = isCaptchaOb[CLIENTID]; // 0都不开，1开图形验证码，2开短信验证码
        }
        let errNote = '';
        if (userName === '') {
          errNote = lodash.get(err, 'userName.errors[0].message', '');
        } else if (password === '') {
          errNote = lodash.get(err, 'password.errors[0].message', '');
        } else if (Number.parseInt(authCodeFlag, 10) === 1 && verifyCode === '') {
          errNote = lodash.get(err, 'verifyCode.errors[0].message', '');
        } else if (Number.parseInt(authCodeFlag, 10) === 2 && authCode === '') {
          errNote = lodash.get(err, 'authCode.errors[0].message', '');
        }
        this.setState({ errMsg: errNote });
      }
    });
  }

  showFindPwd = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  }

  handlClose = () => {
    this.setState({
      visible: false,
    });
  }

  resetPwd = async (payload) => {
    await FetchResetPassword(payload).then((res) => {
      const { code = 0, note = '' } = res;
      if (code > 0) {
        message.info('密码重置成功，请重新登录！');
        this.setState({
          visible: false,
        });
        return false;
      }
      message.error(note);
      return false;
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  changeAuthCode = (e) => {
    const src = `/api/auth/captcha/fetch?type=0&clientId=${CLIENTID}&d=${new Date() * 1}`;
    if (e) {
      e.target.src = src;
    } else if (document.getElementById('loginCaptcha')) {
      document.getElementById('loginCaptcha').src = src;
    }
  }

  handleChangePwd = async () => {
    if (this.resetForm) {
      const { validateFields } = this.resetForm;
      validateFields((err, values) => {
        if (!err) {
          const { newPwd, reNewPwd, yhm, phone, authCode } = values;
          const validateRes = this.validatePwd(values);
          if (validateRes !== true) {
            message.error(validateRes);
            return false;
          }
          const salt = new Date().getTime();
          const params = {
            passwordSign: '',
            clientId: CLIENTID,
            salt,
            authCode,
            yhm,
            phone,
          };
          AES.setSecret(APP_SECRET);
          params.passwordSign = AES.encryptBase64(JSON.stringify([newPwd, reNewPwd, salt]));
          this.resetPwd(params);
        }
      });
    }
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  // 获取密码安全等级
  getPwdLevel = (org) => {
    let pwd = '';
    if (typeof org === 'string') {
      pwd = org;
    } else if (org) {
      pwd = org().newPwd || ''; // eslint-disable-line
    }
    if (pwd.length < 6) {
      return 0;
    }
    const regxs = ['.*[0-9]+.*', '.*[a-z]+.*', '.*[A-Z]+.*', '.*[\\W]+.*'];
    let strength = 0;
    let level = 1;
    for (let i = 0; i < regxs.length; i++) {
      if (pwd.match(regxs[i])) {
        strength++;
      }
    }
    switch (strength) {
      case 0:
      case 1: level = 1; break;
      case 2: level = 2; break;
      case 3: level = 3; break;
      case 4:
      default: {
        if (pwd.length >= 14) {
          level = 4;
        } else {
          level = 3;
        }
      }
    }
    return level;
  }

  // 校验密码
  validatePwd = (values) => {
    const { newPwd, reNewPwd } = values;
    const usrPwdStrengthLevel = localStorage.getItem('usrPwdStrengthLevel') ? Number.parseInt(localStorage.getItem('usrPwdStrengthLevel'), 10) : 3;
    const usrPwdMinLength = localStorage.getItem('usrPwdMinLength') ? Number.parseInt(localStorage.getItem('usrPwdMinLength'), 10) : 8;
    if (!newPwd) {
      return '新密码不可为空';
    } else if (newPwd.length < usrPwdMinLength) {
      return `长度不少于${usrPwdMinLength}位`;
    }
    const level = this.getPwdLevel(newPwd);
    if (level < usrPwdStrengthLevel) {
      const strength = this.aqdjDic[usrPwdStrengthLevel].label || '';
      return `密码强度至少为 ${strength} （${this.getPwdStrengthTip(usrPwdStrengthLevel)}）`;
    }
    if (!reNewPwd) {
      return '确认密码不可为空';
    } else if (reNewPwd.length < usrPwdMinLength) {
      return `长度不少于${usrPwdMinLength}位`;
    } else if (reNewPwd !== newPwd) {
      return '两次输入的新密码不相同';
    }
    return true;
  }

  getPwdStrengthTip = (strength) => {
    const level = Number.parseInt(strength, 10);
    let tip = '';
    if (level === 1) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的一种';
    } else if (level === 2) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的两种；不能以用户帐号，用户姓名作为开头；不能包含敏感字符';
    } else if (level === 3) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的三种；不能以用户帐号，用户姓名作为开头；不能包含敏感字符';
    } else if (level === 4) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的四种；不能以用户帐号，用户姓名作为开头；不能包含敏感字符';
    }
    return tip;
  }

  // 获取手机验证码
  fetchPhoneAuthCode = (userName) => {
    FetchSmsCaptcha({
      name: userName,
      clientId: CLIENTID,
    }).then((res) => {
      const { code = 0, message: msg = '' } = res;
      if (code > 0) {
        this.setState({
          timeVisible: true,
        });
        const { timeCount } = this.state;
        let temp = timeCount;
        this.timer = setInterval(() => {
          if (temp > 0) {
            this.setState({
              timeCount: --temp,
            });
            this.setOkVisible(false);
          } else {
            clearInterval(this.timer);
            this.setState({
              timeCount: 60,
              timeVisible: false,
            });
            this.setOkVisible(true);
          }
        }, 1000);
      } else {
        message.error(msg);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 手机发短信
  sendMsg = (e) => {
    e.preventDefault();
    if (this.props.form) {
      const { validateFieldsAndScroll } = this.props.form;
      validateFieldsAndScroll((err, values) => {
        const { userName = '' } = values;
        if (err) {
          if (userName === '') {
            message.error('请输入账号！');
            return false;
          }
          if (!err.userName) {
            this.fetchPhoneAuthCode(userName);
          }
        } else {
          this.fetchPhoneAuthCode(userName);
        }
      });
    }
  }

  render() {
    const {
      getFieldDecorator,
      // getFieldsError,
      getFieldValue,
      getFieldError,
      isFieldTouched,
    } = this.props.form;
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const authCodeError = isFieldTouched('authCode') && getFieldError('authCode');
    const { login: { loginCode, loginNote, loginLoading = false }, dispatch, captcha, sbjcolor } = this.props;
    const { inputType, visible, okBtnVisible = true, errMsg = '', timeCount, timeVisible, whtLstIpRslt = '' } = this.state;

    const rUserName = localStorage.getItem('rUserName') || '';
    let authCodeFlag = 0;
    if (captcha) {
      const isCaptchaOb = JSON.parse(captcha);
      authCodeFlag = isCaptchaOb[CLIENTID]; // 0都不开，1开图形验证码，2开短信验证码
    }
    return (
      <Form layout="inline" className="login-form m-login-form">
        <FormItem
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}
        >
          {getFieldDecorator('userName', {
            initialValue: localStorage.getItem('isRemeber') === '0' ? rUserName : '',
            rules: [{ required: true, message: '请输入账号' }],
          })(<Input prefix={<i className="iconfont icon-user" style={{ color: '#D1D5E6' }} />} placeholder="输入账号" style={{ height: '40px' }} />)}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入账号密码' }],
          })(<Input prefix={<i className="iconfont icon-mima" style={{ color: '#D1D5E6' }} />} type={inputType} style={{ height: '40px' }} autoComplete="off" onFocus={this.ChangeType} placeholder="账号密码" />)}
        </FormItem>
        {/* 手机验证码 */}
        {
          Number.parseInt(authCodeFlag, 10) === 2 && whtLstIpRslt === 'false' && (
            <Row>
              <Col sm={12} md={12} xxl={12}>
                <FormItem
                  validateStatus={authCodeError ? 'error' : ''}
                  help={authCodeError || ''}
                >
                  {
                    getFieldDecorator('authCode', {
                      rules: [{ required: true, len: 6, pattern: /^[a-zA-Z0-9]{6}$/, message: '请正确输入手机验证码' }],
                    })(<Input style={{ height: '40px' }} autoComplete="off" placeholder="手机验证码" />)
                  }
                </FormItem>
              </Col>
              <Col sm={12} md={12} xxl={12}>
                <div style={{ paddingTop: '.5rem' }}>
                  <span className="blue" onClick={this.sendMsg} style={{ display: timeVisible ? 'none' : '', cursor: 'pointer' }}>获取手机验证码</span>
                  <span className="blue" style={{ display: timeVisible ? '' : 'none' }}>剩余{timeCount}秒</span>
                </div>
              </Col>
            </Row>
          )
        }
        {
          Number.parseInt(authCodeFlag, 10) === 1 && (
            <Row>
              <Col span={12}>
                <FormItem help="">
                  {getFieldDecorator('verifyCode', { rules: [{ required: true, message: '请正确输入验证码' }] })(<Input prefix={<i className="iconfont icon-yanzhengma" style={{ color: '#ddd7d7' }} />} style={{ height: '40px' }} placeholder="验证码" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  <img id="loginCaptcha" alt="验证码" onClick={(e) => { this.changeAuthCode(e); }} src={`/api/auth/captcha/fetch?type=0&clientId=${CLIENTID}`} />
                </FormItem>
              </Col>
            </Row>
          )
        }
        <FormItem>
          {
            loginCode < 0 &&
            this.renderMessage(loginNote)
          }
          {
            errMsg !== '' && this.renderMessage(errMsg)
          }
          {
            !sbjcolor && (
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                // disabled={hasErrors(getFieldsError())}
                onClick={this.handleSubmit}
                loading={loginLoading}
              >
                登 录
              </Button>
            )
          }
          {
            sbjcolor && (
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                // disabled={hasErrors(getFieldsError())}
                onClick={this.handleSubmit}
                loading={loginLoading}
                style={{ backgroundColor: sbjcolor, borderColor: sbjcolor }}

              >
                登 录
              </Button>
            )
          }
          <Checkbox style={{ color: sbjcolor }} className={classnames('left', styles.save)} onChange={e => this.onChangeRemember(e)} defaultChecked={localStorage.getItem('isRemeber') === '0' || false}>保存账号</Checkbox>
          {/* <a style={{ color: sbjcolor }} className="right" onClick={this.showFindPwd}>忘记密码？</a> */}
        </FormItem>
        <ChangePwdContent getFieldValue={getFieldValue} dispatch={dispatch} login={this.props.login} ref={(node) => { this.cpForm = node; }} />
        {/* <BasicModal
          width="40%"
          height="30rem"
          title="更密周期到了,请修改密码"
          visible={loginCode === -7 || loginNote.indexOf('周期') > 0}
          onOk={this.handleCPModalOk}
          onCancel={this.handleCPModalCancel}
        >
          <ChangePwdContent ref={(node) => { this.cpForm = node; }} />
        </BasicModal> */}
        <Layout.Content id="modalContent" />
        <BasicModal
          width="40%"
          height="40rem"
          title="密码找回"
          visible={visible}
          destroyOnClose={false}
          onOk={this.handleChangePwd}
          onCancel={this.handlClose}
          confirmDisabled={okBtnVisible}
        >
          <FindPwd ref={(c) => { this.resetForm = c; }} setOkVisible={this.setOkVisible} aqdjDic={this.aqdjDic} getPwdLevel={this.getPwdLevel} />
        </BasicModal>
      </Form>
    );
  }
}
export default Form.create()(LoginForm);

