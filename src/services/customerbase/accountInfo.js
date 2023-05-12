import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusShareholderAccount, cusBankAccount, cusFundAccount, cusOTCAccount } } = api;

// 客户全景--账户分析--普通账户--股东账户
export async function fetchCusShareholderAccount(payload) {
  const option = {
    url: cusShareholderAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--账户分析--普通账户--银行账户
export async function fetchCusBankAccount(payload) {
  const option = {
    url: cusBankAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--账户分析--理财账户--基金账户
export async function fetchCusFundAccount(payload) {
  const option = {
    url: cusFundAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--账户分析--理财账户--理财账户
export async function fetchCusOTCAccount(payload) {
  const option = {
    url: cusOTCAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
