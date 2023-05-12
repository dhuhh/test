import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: {
  entDetailsDeclarationResults,
  cusDealDetails,
  cusGeneralDealDetails,
  cusCreditDealDetails,
  cusFinancialDealDetails,
  cusStockOptionDealDetails,
  cusEntrustDetails,
  cusGeneralEntrustDetails,
  cusCreditEntrustDetails,
  cusStockOptionEntrustDetails,
  cusCapitalDetails,
  cusGeneralCapitalDetails,
  cusCreditCapitalDetails,
  cusStockOptionCapitalDetails,
  cusFinancialEntrustNewDetails,
},
} = api;

// 获取委托明细-申报结果种类
export async function getEntDetailsDeclarationResults(payload) {
  const option = {
    url: entDetailsDeclarationResults,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户合并账户时间段内成交流水
export async function getCusDealDetails(payload) {
  const option = {
    url: cusDealDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户普通账户时间段内成交流水
export async function getCusGeneralDealDetails(payload) {
  const option = {
    url: cusGeneralDealDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户信用账户时间段内成交流水
export async function getCusCreditDealDetails(payload) {
  const option = {
    url: cusCreditDealDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户理财账户时间段内成交流水
export async function getCusFinancialDealDetails(payload) {
  const option = {
    url: cusFinancialDealDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户股票期权账户时间段内成交流水
export async function getCusStockOptionDealDetails(payload) {
  const option = {
    url: cusStockOptionDealDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户合并账户时间段内委托流水
export async function getCusEntrustDetails(payload) {
  const option = {
    url: cusEntrustDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户普通账户时间段内委托流水
export async function getCusGeneralEntrustDetails(payload) {
  const option = {
    url: cusGeneralEntrustDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户信用账户时间段内委托流水
export async function getCusCreditEntrustDetails(payload) {
  const option = {
    url: cusCreditEntrustDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户股票期权账户时间段内委托流水
export async function getCusStockOptionEntrustDetails(payload) {
  const option = {
    url: cusStockOptionEntrustDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户理财账户时间段内委托流水
export async function getCusFinancialEntrustNewDetails(payload) {
  const option = {
    url: cusFinancialEntrustNewDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户合并账户时间段内资金流水
export async function getCusCapitalDetails(payload) {
  const option = {
    url: cusCapitalDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户普通账户时间段内资金流水
export async function getCusGeneralCapitalDetails(payload) {
  const option = {
    url: cusGeneralCapitalDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户信用账户时间段内资金流水
export async function getCusCreditCapitalDetails(payload) {
  const option = {
    url: cusCreditCapitalDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户股票期权账户时间段内资金流水
export async function getCusStockOptionCapitalDetails(payload) {
  const option = {
    url: cusStockOptionCapitalDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}
