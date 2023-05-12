import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusMoreInfo, cusKYCSplicingInfoConfigCate, cusKYCSplicingInfoConfig } } = api;

// 获取客户详细信息的数据
export async function getCusMoreInfo(payload) {
  const option = {
    url: cusMoreInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取KYC背景信息配置分类
export async function getCusKYCSplicingInfoConfigCate(payload) {
  const option = {
    url: cusKYCSplicingInfoConfigCate,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取KYC背景信息配置
export async function getCusKYCSplicingInfoConfig(payload) {
  const option = {
    url: cusKYCSplicingInfoConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}
