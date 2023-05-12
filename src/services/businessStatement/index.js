import request from '../../utils/request';
import config from '../../utils/config';

const { ftq } = config;

const { businessStatement: { activityPerformance,borderEaux,performanceDetail,activityDetail,custConver,
} } = ftq;

// 港股通--活动业绩表
export async function getActivityPerformance(payload) {
  const option = {
    url: activityPerformance ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 港股通--活动业绩表--列表明细
export async function getActivityDetail(payload) {
  const option = {
    url: activityDetail ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 港股通--业务报表
export async function getBorderEaux(payload) {
  const option = {
    url: borderEaux ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 港股通--业绩明细
export async function getPerformanceDetail(payload) {
  const option = {
    url: performanceDetail ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 港股通--港股通潜客转化报表
export async function getcustConver(payload) {
  const option = {
    url: custConver ,
    method: 'post',
    data: payload,
  };
  return request(option);
}