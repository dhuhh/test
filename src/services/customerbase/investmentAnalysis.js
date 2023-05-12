import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { assetDistribution, assetInfo, statementBaseInfo, statementDetailInfo, investmentAbility, investmentKeyWord, profitCalendar, investmentPreferences, growthRateTrend, totalAssetChange, investmentStyle, profitStocking } } = api;

// 客户全景--投资分析--资产分布
export async function FetchAssetDistribution(payload) {
  const option = {
    url: assetDistribution,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--资产信息
export async function FetchAssetInfo(payload) {
  const option = {
    url: assetInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--账单信息
export async function FetchStatementBaseInfo(payload) {
  const option = {
    url: statementBaseInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--账单详细信息
export async function FetchStatementDetailInfo(payload) {
  const option = {
    url: statementDetailInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--投资能力
export async function FetchInvestmentAbility(payload) {
  const option = {
    url: investmentAbility,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--投资关键字
export async function FetchInvestmentKeyWord(payload) {
  const option = {
    url: investmentKeyWord,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--盈亏日历
export async function FetchProfitCalendar(payload) {
  const option = {
    url: profitCalendar,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--投资偏好
export async function FetchInvestmentPreferences(payload) {
  const option = {
    url: investmentPreferences,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--总资产增长率
export async function FetchGrowthRateTrend(payload) {
  const option = {
    url: growthRateTrend,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--总资产变动
export async function FetchTotalAssetChange(payload) {
  const option = {
    url: totalAssetChange,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--投资风格
export async function FetchInvestmentStyle(payload) {
  const option = {
    url: investmentStyle,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景--投资分析--盈利股票
export async function FetchProfitStocking(payload) {
  const option = {
    url: profitStocking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

