import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { amslb: {
  access, auths, pwd, menu, link,
} } = api;

// 根据Livebos权限验证用户是否允许操作某功能
export async function FetchAccess(payload) {
  const option = {
    url: access,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取当前登录用户的功能权限
export async function FetchAuths(payload) {
  const option = {
    url: auths,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 修改用登录密码
export async function FetchPwd(payload) {
  const option = {
    url: pwd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取系统提醒消息数目
export async function FetchMenu(payload) {
  const option = {
    url: menu,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取首页权限数据
export async function FetchPageReveal(payload) {
  const data = {
    records: [
      { id: 1, name: '总部领导首页' },
    ],
    code: 1,
    total: 1,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

// livebos扩展
export async function FetchLivebosLink(payload) {
  const option = {
    url: link,
    method: 'post',
    data: payload,
  };
  return request(option);
}
