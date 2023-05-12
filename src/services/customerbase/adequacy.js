import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusApprQuestionnaire, cusProductPosition, cusConversionRecord, cusEvalustionDetail, cusEvalustionRecordList, cusRelationList, cusOpenBusiness, cusProfileInfo, cusExtendInfo, cusEvalustionAnalysis, cusEvalustionTrend } } = api;

// 适当性-问卷
export async function fetchCusApprQuestionnaire(payload) {
  const option = {
    url: cusApprQuestionnaire,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 适当性-客户产品持仓
export async function fetchCusProductPosition(payload) {
  const option = {
    url: cusProductPosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-客户转换记录
export async function fetchCusConversionRecord(payload) {
  const option = {
    url: cusConversionRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-客户评测明细
export async function fetchCusEvalustionDetail(payload) {
  const option = {
    url: cusEvalustionDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-客户评测结果分析
export async function fetchCusEvalustionAnalysis(payload) {
  const option = {
    url: cusEvalustionAnalysis,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-客户评测结果趋势
export async function fetchCusEvalustionTrend(payload) {
  const option = {
    url: cusEvalustionTrend,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-查询客户风险评测流水
export async function fetchCusEvalustionRecordList(payload) {
  const option = {
    url: cusEvalustionRecordList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-查询客户间关系列表
export async function fetchcusRelationList(payload) {
  const option = {
    url: cusRelationList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性--查询客户开通业务，可开通业务
export async function getCusOpenBusiness(payload) {
  const option = {
    url: cusOpenBusiness,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性-适当性概况信息
export async function fetchCusProfileInfo(payload) {
  const option = {
    url: cusProfileInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 适当性--获取客户扩展信息
export async function fetchcusExtendInfo(payload) {
  const option = {
    url: cusExtendInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
