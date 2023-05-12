import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { staffCusDynamicDetails } } = api;

// 系统首页  人员名下客户动态详情明细
export async function FetchStaffCusDynamicDetails(payload) {
  const option = {
    url: staffCusDynamicDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

