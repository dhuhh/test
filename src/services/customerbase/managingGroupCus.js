import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { managingGroupCus } } = api;

// 客户群组, 管理客户群中的客户
export async function manageCusGroupCustomer(payload) {
  const option = {
    url: managingGroupCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
