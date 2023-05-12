import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusBasicInfo, cusAssetsCoreData, cusTradeOverview, cusGeneralTradeOverview, cusCreditTradeOverview,
  cusFinancialTradeOverview, cusStockOptionTradeOverview, updateCusBasicInfo, cusAppropriateInfo, cusKYCInfo, cusBusinessRightsInfo, cusServicePlan,
  cusKYCSplicingInfo, addPool, customerProfile, nonTradableShareCus, potLossCus, iPOReminds, prodMaturityReminds, largeFundsTransferReminds, keyCus,
  cusOtherConnections, saveContactWay, cusReturnVisitInfo, cusComplaintInfo } } = api;

// 获取客户基本信息的数据
export async function getCusBasicInfo(payload) {
  const option = {
    url: cusBasicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取客户其他联系方式
export async function getCusOtherConnections(payload) {
  const option = {
    url: cusOtherConnections,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 修改客户联系方式
export async function fetchSaveContactWay(payload) {
  const option = {
    url: saveContactWay,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 修改客户基本信息
export async function operateCusBasicInfo(payload) {
  const option = {
    url: updateCusBasicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景-业务权限开通  获取业务权限开通情况
export async function getCusBusinessRightsInfo(payload) {
  const option = {
    url: cusBusinessRightsInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取持仓交易--客户核心数据
export async function getCusAssetsCoreData(payload) {
  const option = {
    url: cusAssetsCoreData,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 持仓交易--合并账户概览信息
export async function getCusTradeOverview(payload) {
  const option = {
    url: cusTradeOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 持仓交易--普通账户概览信息
export async function getCusGeneralTradeOverview(payload) {
  const option = {
    url: cusGeneralTradeOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 持仓交易-- 信用账户概览数据
export async function getCusCreditTradeOverview(payload) {
  const option = {
    url: cusCreditTradeOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 持仓交易 -- 理财账户概览数据
export async function getCusFinancialTradeOverview(payload) {
  const option = {
    url: cusFinancialTradeOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 持仓交易--股票期权概览数据
export async function getCusStockOptionTradeOverview(payload) {
  const option = {
    url: cusStockOptionTradeOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取适当性基础信息
export async function FetchCusAppropriateInfo(payload) {
  const option = {
    url: cusAppropriateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户背景信息查询
export async function FetchCusKYCInfo(payload) {
  const option = {
    url: cusKYCInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询客户服务计划
export async function FetchCusServicePlan(payload) {
  const option = {
    url: cusServicePlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景-单客户背景信息查询
export async function FetchCusKYCSplicingInfo(payload) {
  const option = {
    url: cusKYCSplicingInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户列表-加入客户池
export async function FetchAddPool(payload) {
  const option = {
    url: addPool,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户模块 客户首页相关概况
export async function FetchCustomerProfile() {
  const option = {
    url: customerProfile,
    method: 'post',
  };
  return request(option);
}
// 客户首页-实时提醒-大小非客户
export async function FetchNonTradableShareCus(payload) {
  const option = {
    url: nonTradableShareCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户首页-实时提醒-潜在流失客户
export async function FetchPotLossCus(payload) {
  const option = {
    url: potLossCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户首页-实时提醒-新股中签
export async function FetchIPOReminds(payload) {
  const option = {
    url: iPOReminds,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户首页-实时提醒-产品过期
export async function FetchProdMaturityReminds(payload) {
  const option = {
    url: prodMaturityReminds,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户首页-实时提醒-大额资金转入转出
export async function FetchLargeFundsTransferReminds(payload) {
  const option = {
    url: largeFundsTransferReminds,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户首页-实时提醒-重点客户
export async function FetchKeyCus(payload) {
  const option = {
    url: keyCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员全景 获取客户回访信息
export async function getCusReturnVisitInfo(payload) {
  const option = {
    url: cusReturnVisitInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员全景 获取客户回访信息
export async function getCusComplaintInfo(payload) {
  const option = {
    url: cusComplaintInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
