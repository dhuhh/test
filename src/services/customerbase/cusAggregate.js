import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { aggregateDimensionIndicator, transFlowStats, transFlowStatsForBO, myAggregateScheme, saveAggregateScheme, holdPositionStatsForBO, holdPositionStats, cusAggs, holdPosition, holdPositionForBO, transFlow, transFlowForBO, cashFlowModel, cashFlowForBO } } = api;

// 客户聚合--获取获取客户聚合统计维度输出指标
export async function fetchCusAggregateDimensionIndicator(payload) {
  const option = {
    url: aggregateDimensionIndicator,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合--我的客户、团队客户交易流水统计
export async function fetchCusAggregateTransFlowStats(payload) {
  const option = {
    url: transFlowStats,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合--营业部交易流水统计
export async function fetchCusAggregateTransFlowStatsForBO(payload) {
  const option = {
    url: transFlowStatsForBO,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合--获取我的客户聚合方案
export async function fetchMyAggregateScheme(payload) {
  const option = {
    url: myAggregateScheme,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合--保存我的客户聚合方案 1|新增;2|修改;3|删除
export async function fetchSaveAggregateScheme(payload) {
  const option = {
    url: saveAggregateScheme,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合--营业部持仓
export async function fetchCusAggregateHoldPositionStatsForBO(payload) {
  const option = {
    url: holdPositionStatsForBO,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合--客户团队持仓
export async function fetchCusAggregateHoldPositionStats(payload) {
  const option = {
    url: holdPositionStats,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合-- 基础指标统计
export async function fetchCusAggs(payload) {
  const option = {
    url: cusAggs,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户聚合-- 持仓-我的客户、团队客户持仓查询
export async function fetchHoldPosition(payload) {
  const option = {
    url: holdPosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户聚合-- 持仓-营业部持仓查询
export async function fetchHoldPositionForBO(payload) {
  const option = {
    url: holdPositionForBO,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户聚合-- 我的客户、团队客户交易流水查询
export async function fetchTransFlow(payload) {
  const option = {
    url: transFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户聚合-- 营业部交易流水查询
export async function fetchTransFlowForBO(payload) {
  const option = {
    url: transFlowForBO,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户聚合-- 我的，团队客户资金流水查询
export async function fetchcashFlowModel(payload) {
  const option = {
    url: cashFlowModel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户聚合-- 营业部资金流水查询
export async function fetchcashFlowModelBo(payload) {
  const option = {
    url: cashFlowForBO,
    method: 'post',
    data: payload,
  };
  return request(option);
}
