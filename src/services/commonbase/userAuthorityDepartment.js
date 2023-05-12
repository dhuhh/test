import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { userAuthorityDepartment,userAuthorityDepartmentType } } = api;

// 获取数据权限营业部数据
export async function fetchUserAuthorityDepartment(payload) {
  const option = {
    url: userAuthorityDepartment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function fetchUserAuthorityDepartmentType(payload) {
  const option = {
    url: userAuthorityDepartmentType,
    method: 'post',
    data: payload,
  };
  return request(option);
}
