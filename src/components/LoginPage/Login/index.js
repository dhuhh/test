/* eslint-disable eqeqeq */
/* eslint-disable no-debugger */
/* eslint-disable react/no-unused-state */
import React from 'react';
import lodash from 'lodash';
import { Form, Icon, Input, Button, Alert, Layout, Row, Col } from 'antd';
import ChangePwdContent from '../../WorkPlatform/MainPage/PageLayout/PageHeader/ChangePwd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginLoading: false,
      visible: false,
      errMsg: '',
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  componentWillReceiveProps(nextProps) {
    const {
      login: { loginNote: preLoginNote },
    } = this.props;
    const {
      login: { loginCode, loginNote },
    } = nextProps;
    if (
      loginCode < 0 &&
      loginNote.indexOf('周期') >= 0 &&
      preLoginNote !== loginNote
    ) {
      if (this.cpForm) {
        this.cpForm.showModal();
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loginLoading: true,
          errMsg: '',
        });
        this.props
          .dispatch({
            type: 'login/login',
            payload: values,
          })
          .then(() => {
            this.setState({
              loginLoading: false,
              errMsg: '',
            });
            this.changeAuthCode();
          });
      } else {
        const { userName = '', password = '', verifyCode = '' } = values;
        let errNote = '';
        if (userName === '') {
          errNote = lodash.get(err, 'userName.errors[0].message', '');
        } else if (password === '') {
          errNote = lodash.get(err, 'password.errors[0].message', '');
        } else if (verifyCode === '') {
          errNote = lodash.get(err, 'verifyCode.errors[0].message', '');
        }
        this.setState({ errMsg: errNote });
      }
    });
  };

  showFindPwd = (e, modalTitle) => {
    e.preventDefault();
    this.setState({
      visible: true,
      modalTitle,
    });
  };

  changeAuthCode = (e) => {
    const src = `/api/auth/captcha/fetch?type=0&d=${new Date() * 1}`;
    if (e) {
      e.target.src = src;
    } else if (document.getElementById('loginCaptcha')) {
      document.getElementById('loginCaptcha').src = src;
    }
  };

  // 取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      getFieldError,
      isFieldTouched,
    } = this.props.form;
    const userNameError =
      isFieldTouched('userName') && getFieldError('userName');
    const passwordError =
      isFieldTouched('password') && getFieldError('password');
    const verifyCodeError =
      isFieldTouched('verifyCode') && getFieldError('verifyCode');
    const {
      login: { loginCode, loginNote },
      dispatch,
      captcha,
    } = this.props;
    const { loginLoading, errMsg } = this.state;
    const cap1 = captcha ? JSON.parse(captcha) : '';
    const captchaVlue = cap1['c5::pc'];
    return (
      <Form layout="inline" className="login-form m-login-form">
        <FormItem
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入账号' }],
          })(<Input
            prefix={
              <Icon
                type="user"
                style={{ color: 'rgba(0, 0, 0, 0.247059)' }}
              />
              }
            placeholder="输入账号"
          />)}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入账号密码' }],
          })(<Input
            prefix={
              <Icon
                type="lock"
                style={{ color: 'rgba(0, 0, 0, 0.247059)' }}
              />
              }
            type="password"
            placeholder="账号密码"
          />)}
        </FormItem>
        {captchaVlue == '2' && (
        <FormItem
          validateStatus={verifyCodeError ? 'error' : ''}
          help={verifyCodeError || ''}
        >
          {getFieldDecorator('verifyCode', {
            rules: [{ required: true, message: '请联系管理员获取令牌' }],
          })(<Input
            prefix={
              <i
                className="iconfont icon-yanzhengma"
                style={{ color: '#ddd7d7' }}
              />
              }
            style={{ height: '40px' }}
            placeholder="令牌"
          />)}
        </FormItem>
         )}
        <FormItem>
          {captchaVlue == '1' && (
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={verifyCodeError ? 'error' : ''}
                  help={verifyCodeError || ''}
                >
                  {getFieldDecorator('verifyCode', {
                    rules: [{ required: true, message: '请正确输入验证码' }],
                  })(<Input
                    prefix={
                      <i
                        className="iconfont icon-yanzhengma"
                        style={{ color: '#ddd7d7' }}
                      />
                      }
                    style={{ height: '40px' }}
                    placeholder="验证码"
                  />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  <img
                    id="loginCaptcha"
                    alt="验证码"
                    onClick={(e) => {
                      this.changeAuthCode(e);
                    }}
                    src="/api/auth/captcha/fetch?type=0"
                  />
                </FormItem>
              </Col>
            </Row>
          )}
        </FormItem>
        <FormItem>
          {
            (errMsg !== '' || loginCode < 0) &&
            this.renderMessage(errMsg || loginNote)
          }

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
        </FormItem>
        <Layout.Content id="modalContent" />
        <ChangePwdContent
          getFieldValue={getFieldValue}
          dispatch={dispatch}
          login={this.props.login}
          ref={(node) => {
            this.cpForm = node;
          }}
        />
      </Form>
    );
  }
}
export default Form.create()(LoginForm);
