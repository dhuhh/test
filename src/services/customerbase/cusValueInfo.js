import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusValueInfo, cusLifeCycleView, cusQuotaOverview, cusSuitProducts, cusAssetsTrends, cusOpenBusiness } } = api;

// 获取客户价值的数据
export async function getCusValueInfo(payload) {
  const option = {
    url: cusValueInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户生命周期的数据
export async function getCusLifeCycleView(payload) {
  const option = {
    url: cusLifeCycleView,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--客户概况，环比信息
export async function getCusQuotaOverview(payload) {
  const option = {
    url: cusQuotaOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--客户概况，获取适合客户产品
export async function getCusSuitProducts(payload) {
  const option = {
    url: cusSuitProducts,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--客户概况，查询客户资产趋势
export async function getCusAssetsTrends(payload) {
  const option = {
    url: cusAssetsTrends,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--客户概况，查询客户开通业务，可开通业务
export async function getCusOpenBusiness(payload) {
  const option = {
    url: cusOpenBusiness,
    method: 'post',
    data: payload,
  };
  return request(option);
}

