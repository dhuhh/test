import request from '../utils/request';
import config from '../utils/config';

const { api } = config;
const { commonbase: { userBasicInfo }, login: { auth, logout, user, qryLoginPageConf, ssoLogin, ssoReceive, logoutSSO, appSSOLogin } } = api;

// 登录接口
export async function AccountLogin(params) {
  const option = {
    url: auth,
    method: 'post',
    data: params,
  };
  return request(option);
}
// 退出接口
export async function AccountLogout() {
  const option = {
    url: logout,
    method: 'post',
  };
  return request(option);
}
// 查询用户信息
export async function AccountUser(params) {
  const option = {
    url: user,
    method: 'post',
    data: params,
  };
  return request(option);
}

// 获取用户基本信息(包含系统角色信息)
export async function UserBasicInfo(params) {
  const option = {
    url: userBasicInfo,
    method: 'post',
    data: params,
  };
  return request(option);
}

// 查询登录页面配置
export async function FetchQryLoginPageConf(payload) {
  const option = {
    url: qryLoginPageConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 单点登录
export async function FetchSsoLogin(payload) {
  const option = {
    url: ssoLogin,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 单点回调接口
export async function FetchSsoReceive(payload) {
  const option = {
    url: ssoReceive,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 登出
export async function FetchLogout(payload) {
  const option = {
    url: logoutSSO,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 登出
export async function FetchAppSSOLogin(payload) {
  const option = {
    url: appSSOLogin,
    method: 'post',
    data: payload,
  };
  return request(option);
}
