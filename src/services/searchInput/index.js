import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;

const { searchInput: { queryRecentSearchProduct, queryHotSearchProduct, clearSearchRecord, saveSearchRecord, queryBackLogNum, queryCustomerHomepage } } = api;


// 查询最近搜索
export async function FetchQueryRecentSearchProduct(payload) {
  const option = {
    url: queryRecentSearchProduct ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询热门搜索
export async function FetchQueryHotSearchProduct(payload) {
  const option = {
    url: queryHotSearchProduct ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 记录搜索
export async function FetchSaveSearchRecord(payload) {
  const option = {
    url: saveSearchRecord ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 清空搜索记录
export async function FetchClearSearchRecord(payload) {
  const option = {
    url: clearSearchRecord ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询待办数
export async function FetchQueryBackLogNum(payload) {
  const option = {
    url: queryBackLogNum ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页客户搜索查询
export async function FetchQueryCustomerHomepage(payload) {
  const option = {
    url: queryCustomerHomepage ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

