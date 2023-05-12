import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { managingCusGroup, userGroupOper } } = api;

// 客户群组, 创建/修改/删除客户群
export async function funcManagingCusGroup(payload) {
  const option = {
    url: managingCusGroup,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 用户群组 修改/删除客户群
export async function funcUserGroupOper(payload) {
  const option = {
    url: userGroupOper,
    method: 'post',
    data: payload,
  };
  return request(option);
}
