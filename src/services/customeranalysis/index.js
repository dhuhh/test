import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customeranalysis: { queryAssetChangeHistory, queryAssetTrend, queryAssetInflowAndOutflow, queryTradingMergeAccount, querystockHoldings, queryOpenFund, 
queryStockTransactionRanking, queryTradingOrdinaryAccount, queryTradingCreditAccount, queryTradingFinancialManageAccount, queryTradingOptionsAccount, 
queryCustomerDistribution, queryCusProfitAndLossDetails, querytransactionFlow, queryTradingClients, queryStockList, queryChnlList, queryAssetRanking, 
queryContributionRanking, queryMidRangeAffluenceAnalyse, queryIndividualStockRanking, queryPositionRanking, queryTurnoverRanking } } = api;

// 客户分析-资产流入流出-资产变动
export async function FetchQueryAssetChangeHistory(payload) {
  const option = {
    url: queryAssetChangeHistory,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-资产流入流出-资产趋势
export async function FetchQueryAssetTrend(payload) {
  const option = {
    url: queryAssetTrend,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-资产流入流出
export async function FetchQueryAssetInflowAndOutflow(payload) {
  const option = {
    url: queryAssetInflowAndOutflow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-交易流水
export async function FetchQuerytransactionFlow(payload) {
  const option = {
    url: querytransactionFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-账户信息-持仓股票
export async function FetchQuerystockHoldings(payload) {
  const option = {
    url: querystockHoldings,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-客户持仓-开放式基金
export async function FetchQueryOpenFund(payload) {
  const option = {
    url: queryOpenFund,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-个股成交排行
export async function FetchQueryStockTransactionRanking(payload) {
  const option = {
    url: queryStockTransactionRanking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-交易量排行-合并账户
export async function FetchQueryTradingMergeAccount(payload) {
  const option = {
    url: queryTradingMergeAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-交易量排行-普通账户
export async function FetchQueryTradingOrdinaryAccount(payload) {
  const option = {
    url: queryTradingOrdinaryAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-交易量排行-信用账户
export async function FetchQueryTradingCreditAccount(payload) {
  const option = {
    url: queryTradingCreditAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-交易量排行-理财账户
export async function FetchQueryTradingFinancialManageAccount(payload) {
  const option = {
    url: queryTradingFinancialManageAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-交易量排行-股票期权账户
export async function FetchQueryTradingOptionsAccount(payload) {
  const option = {
    url: queryTradingOptionsAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-客户分布
export async function FetchQueryCustomerDistribution(payload) {
  const option = {
    url: queryCustomerDistribution,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-客户盈亏明细
export async function FetchQueryCusProfitAndLossDetails(payload) {
  const option = {
    url: queryCusProfitAndLossDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-客户盈亏明细
export async function FetchQueryTradingClients(payload) {
  const option = {
    url: queryTradingClients,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 证券代码、证券名称查询
export async function FetchQueryStockList(payload) {
  const option = {
    url: queryStockList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 渠道名称、渠道代码
export async function FetchQueryChnlList(payload) {
  const option = {
    url: queryChnlList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-资产排行
export async function FetchQueryAssetRanking(payload) {
  const option = {
    url: queryAssetRanking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-贡献排行
export async function FetchQueryContributionRanking(payload) {
  const option = {
    url: queryContributionRanking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-中端富裕客户分析
export async function FetchQueryMidRangeAffluenceAnalyse(payload) {
  const option = {
    url: queryMidRangeAffluenceAnalyse,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-个股持仓排行
export async function FetchQueryIndividualStockRanking(payload) {
  const option = {
    url: queryIndividualStockRanking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-单只证券持仓排行
export async function FetchQueryPositionRanking(payload) {
  const option = {
    url: queryPositionRanking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户分析-周转率排行
export async function FetchQueryTurnoverRanking(payload) {
  const option = {
    url: queryTurnoverRanking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

