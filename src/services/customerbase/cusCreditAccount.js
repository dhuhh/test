import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusCreditAccount, cusAccountCoreData, cusCreditAccountContract, cusStockOptionAccount, cusStockOptionAccountControl } } = api;

// 获取客户信用账户的数据
export async function FetchCreditAccountInfo(payload) {
  const option = {
    url: cusCreditAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取 客户全景--账户信息--普通账户下，客户核心信息
export async function FetchCusAccountCoreData(payload) {
  const option = {
    url: cusAccountCoreData,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取 客户全景--账户信息--信用账户下，合同信息
export async function FetchCusCreditContractInfo(payload) {
  const option = {
    url: cusCreditAccountContract,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取账户信息--期权账户--账户分析
export async function FetchCusOptionAccountInfo(payload) {
  const option = {
    url: cusStockOptionAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取账户信息--期权账户--控制信息
export async function FetchCusOptionControlInfo(payload) {
  const option = {
    url: cusStockOptionAccountControl,
    method: 'post',
    data: payload,
  };
  return request(option);
}
