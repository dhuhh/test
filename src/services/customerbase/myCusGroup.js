import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { myCusGroup, myCusGroupDetail, cusRangeType } } = api;

// 客户群组件, 根据客户群类型获取客户群信息, 然后触发回调函数
export async function getCusGroup(payload) {
  const option = {
    url: myCusGroup,
    method: 'post',
    data: {
      paging: 0, // 设置不分页
      current: 1,
      pageSize: 10,
      total: -1,
      sort: '',
      ...payload,
    },
  };
  return request(option);
}
export async function getCusGroupDetail(payload) {
  const option = {
    url: myCusGroupDetail,
    method: 'post',
    data: {
      ...payload,
    },
  };
  return request(option);
}
// 根据系统角色获取客户范围类型
export async function FetchCusRangeType(payload) {
  const option = {
    url: cusRangeType,
    method: 'post',
    data: payload,
  };
  return request(option);
}
