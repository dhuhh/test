import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusSysemLable, cusSysemLableHis, cusLabelConfigList, cusLabelConfigDetail, cusLabelRuleDefine, cusLabelValueDefine, cusLabelValueConfig, cusLabelConfigLabelList, cusLabelParameter, cusLabelIndexExplain, updateLabelValueSeq } } = api;

// 客户全景-客户画像-获取客户系统标签
export async function FetchCusSysemLable(payload) {
  const option = {
    url: cusSysemLable,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户全景-客户画像-获取客户系统标签历史
export async function FetchCusSysemLableHis(payload) {
  const option = {
    url: cusSysemLableHis,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户标签配置列表
export async function FetchCusLabelConfigList(payload) {
  const option = {
    url: cusLabelConfigList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户标签配置明细
export async function FetchCusLabelConfigDetail(payload) {
  const option = {
    url: cusLabelConfigDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户标签规则定义明细
export async function FetchCusLabelRuleDefine(payload) {
  const option = {
    url: cusLabelRuleDefine,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户标签配置-标签值定义
export async function FetchCusLabelValueDefine(payload) {
  const option = {
    url: cusLabelValueDefine,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户标签配置-标签值操作
export async function DoCusLabelValueConfig(payload) {
  const option = {
    url: cusLabelValueConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户标签配置-获取可配置标签或指标列表
export async function FetchCusLabelConfigLabelList(payload) {
  const option = {
    url: cusLabelConfigLabelList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户标签配置-标签值参数操作
export async function FetchCusLabelParameter(payload) {
  const option = {
    url: cusLabelParameter,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户标签配置-指标解释
export async function FetchCusLabelIndexExplain(payload) {
  const option = {
    url: cusLabelIndexExplain,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户标签配置-更新标签排序
export async function DoUpdateLabelValueSeq(payload) {
  const option = {
    url: updateLabelValueSeq,
    method: 'post',
    data: payload,
  };
  return request(option);
}
