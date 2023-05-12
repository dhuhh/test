import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { managingMyLable,
  cusGroupImport,
  cusBelongsGroup,
  cusGetVocation,
  cusStarChangeHis,
  cusRelationshipChangeLog,
  userScenarioLabelConfigList,
  userScenarioLabelConfig,
  cusKYCSplicingIndexRelateInfo,
  cusPreciousMetalsAccount,
  cusTradeOverview,
  cusAssetsTrends,
  cusPreciousMetalsPosition,
  cusPreciousMetalsStock,
  cusPreciousMetalsDealDetails,
  cusPreciousMetalsEntrustDetails,
  cusPreciousMetalsCapitalDetails,
  cusAssetsSummary,
  cusLifeCycleConditionConfig,
  staffCusDynamicDetails,
  customerProfile,
  labelCircleQueryGroup,
  exportCusGroupData,
  userGroupLstExport,
  labelCircleSaveScheme,
  labelCircleQueryScheme,
  cusPositionQuery,
  firstServiceCustomerList,
  searchConfigurationPlan,
  proConfigurationPlanSearch,
  requireClassingSearch,
  highNavRequireRegister,
  highNavBusinessOpportunity,
  cusOrVisitorSuitProducts,
} } = api;

// 获取客户KYC指标关联关系
export async function FetchCusKYCSplicingIndexRelateInfo(payload) {
  const option = {
    url: cusKYCSplicingIndexRelateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 保存用户方案
export async function FetchLabelCircleSaveScheme(payload) {
  const option = {
    url: labelCircleSaveScheme,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询用户方案
export async function FetchLabelCircleQueryScheme(payload) {
  const option = {
    url: labelCircleQueryScheme,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 查询用户可选用户群
export async function FetchLabelCircleQueryGroup(payload) {
  const option = {
    url: labelCircleQueryGroup,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 自定义标签处理
export async function FetchManagingMyLable(payload) {
  const option = {
    url: managingMyLable,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 导入客户群
export async function FetchCusGroupImport(payload) {
  const option = {
    url: cusGroupImport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取用户所属客户群
export async function FetchCusBelongsGroup(payload) {
  const option = {
    url: cusBelongsGroup,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户全景  单客户业务开通情况
export async function FetchCusGetVocation(payload) {
  const option = {
    url: cusGetVocation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户全景  获取客户星级变动信息
export async function FetchcusStarChangeHis(payload) {
  const option = {
    url: cusStarChangeHis,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景  查询客户关系变动日志
export async function FetchcusRelationshipChangeLog(payload) {
  const option = {
    url: cusRelationshipChangeLog,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景  查询用户场景化标签配置
export async function FetchUserScenarioLabelConfigList(payload) {
  const option = {
    url: userScenarioLabelConfigList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景  用户场景化标签配置
export async function FetchUserScenarioLabelConfig(payload) {
  const option = {
    url: userScenarioLabelConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户信息
export async function FetchCusPreciousMetalsAccount(payload) {
  const option = {
    url: cusPreciousMetalsAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取贵金属账户概览数据
export async function FetchCusTradeOverview(payload) {
  const option = {
    url: cusTradeOverview,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询客户资产趋势
export async function FetchCusAssetsTrends(payload) {
  const option = {
    url: cusAssetsTrends,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户持仓
export async function FetchCusPreciousMetalsPosition(payload) {
  const option = {
    url: cusPreciousMetalsPosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户持仓-库存信息
export async function FetchCusPreciousMetalsStock(payload) {
  const option = {
    url: cusPreciousMetalsStock,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户时间段内成交流水
export async function FetchCusPreciousMetalsDealDetails(payload) {
  const option = {
    url: cusPreciousMetalsDealDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户时间段内委托流水
export async function FetchCusPreciousMetalsEntrustDetails(payload) {
  const option = {
    url: cusPreciousMetalsEntrustDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户时间段内资金流水
export async function FetchCusPreciousMetalsCapitalDetails(payload) {
  const option = {
    url: cusPreciousMetalsCapitalDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户时间段内资金流水
export async function FetchCusAssetsSummary(payload) {
  const option = {
    url: cusAssetsSummary,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户贵金属账户时间段内资金流水
export async function FetchCusLifeCycleConditionConfig(payload) {
  const option = {
    url: cusLifeCycleConditionConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页-客户动态-动态详情
export async function FetchStaffCusDynamicDetails(payload) {
  const option = {
    url: staffCusDynamicDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页水波球描述
export async function FetchCustomerProfile(payload) {
  const option = {
    url: customerProfile,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户群导出
export async function FetchExportCusGroupData(payload) {
  const option = {
    url: exportCusGroupData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 用户群导出
export async function FetchUserGroupLstExport(payload) {
  const option = {
    url: userGroupLstExport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户持仓查询修改
export async function FetchCusPositionQuery(payload) {
  const option = {
    url: cusPositionQuery,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-客户服务左侧客户列表
export async function fetchFirstServiceCustomerList(payload) {
  const option = {
    url: firstServiceCustomerList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-客户服务-未服务-登记需求表单-需求类型
export async function FetchrequireClassingSearch(payload) {
  const option = {
    url: requireClassingSearch,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-客户服务-未服务-登记需求
export async function FetchhighNavRequireRegister(payload) {
  const option = {
    url: highNavRequireRegister,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-客户服务-未服务-客户机会标签
export async function FetchHighNavBusinessOpportunity(payload) {
  const option = {
    url: highNavBusinessOpportunity,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-客户服务-未服务-客户、游客推荐产品
export async function FetchCusOrVisitorSuitProducts(payload) {
  const option = {
    url: cusOrVisitorSuitProducts,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-方案配置操作-新增修改删除
export async function FetchsearchConfigurationPlan(payload) {
  const option = {
    url: searchConfigurationPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 高净值客户-方案配置列表
export async function FetchproConfigurationPlanSearch(payload) {
  const option = {
    url: proConfigurationPlanSearch,
    method: 'post',
    data: payload,
  };
  return request(option);
}

