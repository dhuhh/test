import request from '../../utils/request';
import config from '../../utils/config';
// import * as mockData from './mockData';
import { cloneDeep } from 'lodash';

const { api } = config;

const { newProduct: { findHomePage, findstocks, findfinancials, nationaldebtdetail, findOtherDetails, findDetailed, findCalenderList, optionFindHomePage, optionFindHomePageList, optionFindCalenderList, optionFindDetailed, updateday,
  hisstocksdetail, hisstockslist, hisfundsdetail, hisfundslist, jyhgupdateday, findPostion, findPostionNameAndCode, findPositionSummary, findAvailableAccount,
} } = api;

// T-1账单首页接口文档
export async function FindHomePage(payload) {
  const option = {
    url: findHomePage,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 账单区间内股票列表接口文档
export async function Findstocks(payload) {
  const option = {
    url: findstocks,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 账单区间基金理财列表接口文档
export async function Findfinancials(payload) {
  const option = {
    url: findfinancials,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 区间内国债逆回购接口
export async function Nationaldebtdetail(payload) {
  const option = {
    url: nationaldebtdetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// T-1账单其他收益明细
export async function FindOtherDetails(payload) {
  const option = {
    url: findOtherDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// T-1账单收益明细查询接口文档
export async function FindDetailed(payload) {
  const option = {
    url: findDetailed,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// T-1账单收益明细查询接口文档
export async function FindCalenderList(payload) {
  const option = {
    url: findCalenderList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 期权T-1账单首页接口
export async function OptionFindHomePage(payload) {
  const option = {
    url: optionFindHomePage,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 期权T-1账单列表
export async function OptionFindHomePageList(payload) {
  const option = {
    url: optionFindHomePageList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 期权账户T-1账单日历接口文档
export async function OptionFindCalenderList(payload) {
  const option = {
    url: optionFindCalenderList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 期权账户T-1账单收益明细查询接口文档
export async function OptionFindDetailed(payload) {
  const option = {
    url: optionFindDetailed,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取历史持股详情
export async function Hisstocksdetail(payload) {
  const option = {
    url: hisstocksdetail,
    method: 'post',
    data: payload,
  };
  return request(option);
  // return { code: 1, note: '成功', records: cloneDeep(mockData.hisstocksdetailData) };
}

// 获取历史持股列表
export async function Hisstockslist(payload) {
  const option = {
    url: hisstockslist,
    method: 'post',
    data: payload,
  };
  return request(option);
  // return { code: 1, note: '成功', records: cloneDeep(mockData.hisstockslistData) };
}
// 获取历史基金详情
export async function Hisfundsdetail(payload) {
  const option = {
    url: hisfundsdetail,
    method: 'post',
    data: payload,
  };
  return request(option);
  // return { code: 1, note: '成功', records: cloneDeep(mockData.hisfundsdetailData) };
}
// 获取历史基金列表
export async function Hisfundslist(payload) {
  const option = {
    url: hisfundslist,
    method: 'post',
    data: payload,
  };
  return request(option);
  // return { code: 1, note: '成功', records: cloneDeep(mockData.hisfundslistData) };
}
// 获取最新日期
export async function Jyhgupdateday(payload) {
  const option = {
    url: jyhgupdateday,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 最新持仓列表
export async function FindPostion(payload) {
  const option = {
    url: findPostion,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 最新持仓-持仓名称查询
export async function FindPostionNameAndCode(payload) {
  const option = {
    url: findPostionNameAndCode,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 最新持仓概要
export async function FindPositionSummary(payload) {
  const option = {
    url: findPositionSummary,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询可用账户
export async function FindAvailableAccount(payload) {
  const option = {
    url: findAvailableAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// T-1账单更新最新日期查询
export async function Updateday(payload) {
  const option = {
    url: updateday,
    method: 'post',
    data: payload,
  };
  return request(option);
}
