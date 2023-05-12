import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customersenior: {  queryCustomerTips } } = api;

// 获取客户列表的数据-模糊搜索
export async function FetchCustomerTips(payload) {
  const option = {
    url: queryCustomerTips,
    method: 'post',
    data: payload,
  };
  return request(option);
}
