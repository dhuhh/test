import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusExistingAndSysLable, cusExistingLable } } = api;

// 获取客户已有标签
export async function getCusExistingLable(payload) {
  const option = {
    url: cusExistingLable,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取客户已有标签和系统标签
export async function getCusExistingAndSysLable(payload) {
  const option = {
    url: cusExistingAndSysLable,
    method: 'post',
    data: payload,
  };
  return request(option);
}
