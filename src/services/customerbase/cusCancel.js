import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { offsiteCancelAccountStatistics, offsiteCancelAccountInfo, offsiteCancelAccountTrend } } = api;

// 首页--查询非现场销户统计
export async function fetchOffsiteCancelAccountStatistics(payload) {
  const option = {
    url: offsiteCancelAccountStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页--查询非现场销户数据
export async function fetchOffsiteCancelAccountInfo(payload) {
  const option = {
    url: offsiteCancelAccountInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页--查询非现场销户趋势
export async function fetchOffsiteCancelAccountTrend(payload) {
  const option = {
    url: offsiteCancelAccountTrend,
    method: 'post',
    data: payload,
  };
  return request(option);
}
