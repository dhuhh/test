import request from '../../utils/request';
import config from '../../utils/config';

const { ftq } = config;

const { searchProcess: { queryDictionary,queryBusinessNameList,queryBusinessProcedureList,queryCustomerSearchHistoryList,
} } = ftq;


// 聚安一站通--关系/客户/处理状态--字典接口
export async function getQueryDictionary(payload) {
  const option = {
    url: queryDictionary ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 聚安一站通--业务名称--字典接口
export async function getBusinessNameList(payload) {
  const option = {
    url: queryBusinessNameList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 聚安一站通--业务名称--字典接口
export async function getProcedureList(payload) {
  const option = {
    url: queryBusinessProcedureList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 聚安一站通--业务名称--字典接口
export async function getHistoryList(payload) {
  const option = {
    url: queryCustomerSearchHistoryList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}