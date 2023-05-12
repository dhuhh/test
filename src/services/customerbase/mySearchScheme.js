import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { mySearchScheme, searchSchemeDetail, saveSearchScheme, cusHotSearchQuota } } = api;

// 获取高级筛选的搜索方案 1系统推荐，2我保存的方案，3我最近的方案 fetchMySearchScheme
export async function FetchMySearchScheme(payload) {
  const option = {
    url: mySearchScheme,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取搜索方案内容明细
export async function FetchSearchSchemeDetail(payload) {
  const option = {
    url: searchSchemeDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 保存高级筛选搜索方案
export async function FetchSaveSearchScheme(payload) {
  const option = {
    url: saveSearchScheme,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户热门搜索
export async function FetchCusHotSearchQuota(payload) {
  const option = {
    url: cusHotSearchQuota,
    method: 'post',
    data: payload,
  };
  return request(option);
}
