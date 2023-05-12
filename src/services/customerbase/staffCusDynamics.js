import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { staffCusDynamics } } = api;

// 系统首页  人员名下客户动态
export async function FetchStaffCusDynamics(payload) {
  const option = {
    url: staffCusDynamics,
    method: 'post',
    data: payload,
  };
  return request(option);
}
