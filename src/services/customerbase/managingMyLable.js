import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { managingMyLable } } = api;

// 获取已选标签
export async function fetchManagingMyLable(payload) {
  const option = {
    url: managingMyLable,
    method: 'post',
    data: payload,
  };
  return request(option);
}
