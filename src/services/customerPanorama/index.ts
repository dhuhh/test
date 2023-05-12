import request from '../../utils/request.js';
import config from '../../utils/config.js';

const { api, ftq } = config;

const { customerPanorama: {
  querySocialRelationsInformation, queryRecommendCustomerFund, queryBusinessOpportunityList, queryLifeCycleList, queryNormalAccountInformation,
  queryCapitalAccountInformation, queryMasterBankInformation, queryNormalAndContractInformation, queryGuAccountInformation, queryFinaceTaInformation,
  queryDeptAccountInformation, queryElectronicInformation, queryOpenConformation, querySingleInformation, querySignProformation, queryCustAllInfo,
  updatePhoneInfo, updateCharacteristicInfo, updaterelationshipInfo, queryAccountInformation, queryCustPointsDetails, queryServiceDynamicsList
  , queryProfitNormalAcount, queryProfitfinanAcount, queryProfitOptionAcount, queryCapitalFlowAccount, saveAddCustomLabel, saveAddCustomerLabel, queryDockingCommissionRateInfo, queryHistoricalRateInformation, queryCommissionRateList, queryAssetPieChartInformation, queryProgramIndicatorInformation, saveProgramIndicatorInformation, queryIndicatorSchemeDefinition, queryAssetPlanTrendList, queryAssetPlanMonthList, queryCustomerContributionTrendList, queryCustomerContributionList, queryAccountAnalysisListInfo, queryAccountAnalysisSum, queryAssetPlanMonthListExport, queryCustomerContributionListExport, queryAccountAnalysisListInfoExport
  ,
  queryProfitAllAcount, queryProfitAllAcountTable, queryCustomerLabelList, getProfitDate, queryFundInvestmentAccount, queryCustAllInfoBase,queryCustAllInfoMore
} } = api;
const {
  customerPanoramaFtq: {
    queryYuyueWater,
    getCustomerAccessControl,
    joinQuant,
    getRecommendCapital,
    queryOriNetCommissions,
    queryStockRate,
    querySaHaStockRate,
    queryCustomerComRate
  }
} = ftq;


// 社会关系列表信息
export async function QuerySocialRelationsInformation(payload: any) {
  const option = {
    url: querySocialRelationsInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户推荐精选池基金
export async function QueryRecommendCustomerFund(payload: any) {
  const option = {
    url: queryRecommendCustomerFund,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户全景业务机会
export async function QueryBusinessOpportunityList(payload: any) {
  const option = {
    url: queryBusinessOpportunityList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户生命周期
export async function QueryLifeCycleList(payload: any) {
  const option = {
    url: queryLifeCycleList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询普通账户基本信息
export async function QueryNormalAccountInformation(payload: any) {
  const option = {
    url: queryNormalAccountInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询资金账户列表
export async function QueryCapitalAccountInformation(payload: any) {
  const option = {
    url: queryCapitalAccountInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询主，辅存管银行
export async function QueryMasterBankInformation(payload: any) {
  const option = {
    url: queryMasterBankInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询合同和基本信息
export async function QueryNormalAndContractInformation(payload: any) {
  const option = {
    url: queryNormalAndContractInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询信用股东账号
export async function QueryGuAccountInformation(payload: any) {
  const option = {
    url: queryGuAccountInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 点击理财账户-开通的基金公司TA账户
export async function QueryFinaceTaInformation(payload: any) {
  const option = {
    url: queryFinaceTaInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 点击理财账户-开通的银行理财账户
export async function QueryDeptAccountInformation(payload: any) {
  const option = {
    url: queryDeptAccountInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 点击理财账户-资管产品电子合同签署情况
export async function QueryElectronicInformation(payload: any) {
  const option = {
    url: queryElectronicInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 点击期权账户-查询基本信息
export async function QueryOpenConformation(payload: any) {
  const option = {
    url: queryOpenConformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 点击期权账户-开通合约列表
export async function QuerySingleInformation(payload: any) {
  const option = {
    url: querySingleInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 点击基金投顾-签约产品列表
export async function QuerySignProformation(payload: any) {
  const option = {
    url: querySignProformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取客户基本信息
export async function QueryCustAllInfo(payload: any) {
  const option = {
    url: queryCustAllInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户联系方式更新
export async function UpdatePhoneInfo(payload: any) {
  const option = {
    url: updatePhoneInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 修改客户个性化信息
export async function UpdateCharacteristicInfo(payload: any) {
  const option = {
    url: updateCharacteristicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 增加或则修改客户关系
export async function UpdaterelationshipInfo(payload: any) {
  const option = {
    url: updaterelationshipInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 账户概况
export async function QueryAccountInformation(payload: any) {
  const option = {
    url: queryAccountInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户积分明细查询
export async function QueryCustPointsDetails(payload: any) {
  const option = {
    url: queryCustPointsDetails,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 服务动态
export async function QueryServiceDynamicsList(payload: any) {
  const option = {
    url: queryServiceDynamicsList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询客户标签列表信息
export async function QueryCustomerLabelList(payload: any) {
  const option = {
    url: queryCustomerLabelList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 新建自定义标签
export async function SaveAddCustomLabel(payload: any) {
  const option = {
    url: saveAddCustomLabel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 新建客户打标签
export async function SaveAddCustomerLabel(payload: any) {
  const option = {
    url: saveAddCustomerLabel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 费率查询
export async function QueryDockingCommissionRateInfo(payload: any) {
  const option = {
    url: queryDockingCommissionRateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取历史费率信息查询
export async function QueryHistoricalRateInformation(payload: any) {
  const option = {
    url: queryHistoricalRateInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询佣金费率信息列表
export async function QueryCommissionRateList(payload: any) {
  const option = {
    url: queryCommissionRateList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 资产与贡献饼图信息查询
export async function QueryAssetPieChartInformation(payload: any) {
  const option = {
    url: queryAssetPieChartInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 资产与贡献趋势图信息查询
export async function QueryAssetPlanTrendList(payload: any) {
  const option = {
    url: queryAssetPlanTrendList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 贡献方案趋势图信息查询
export async function QueryCustomerContributionTrendList(payload: any) {
  const option = {
    url: queryCustomerContributionTrendList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 资产列表信息查询
export async function QueryAssetPlanMonthList(payload: any) {
  const option = {
    url: queryAssetPlanMonthList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//贡献列表信息查询
export async function QueryCustomerContributionList(payload: any) {
  const option = {
    url: queryCustomerContributionList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//账户分析信息查询
export async function QueryAccountAnalysisListInfo(payload: any) {
  const option = {
    url: queryAccountAnalysisListInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//账户分析信息汇总
export async function QueryAccountAnalysisSum(payload: any) {
  const option = {
    url: queryAccountAnalysisSum,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//资产方案导出
export async function QueryAssetPlanMonthListExport(payload: any) {
  const option = {
    url: queryAssetPlanMonthListExport,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//贡献方案导出
export async function QueryCustomerContributionListExport(payload: any) {
  const option = {
    url: queryCustomerContributionListExport,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//账户分析导出
export async function QueryAccountAnalysisListInfoExport(payload: any) {
  const option = {
    url: queryAccountAnalysisListInfoExport,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//方案指标明细信息查询
export async function QueryProgramIndicatorInformation(payload: any) {
  const option = {
    url: queryProgramIndicatorInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//方案指标明细信息保存
export async function SaveProgramIndicatorInformation(payload: any) {
  const option = {
    url: saveProgramIndicatorInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//方案指标定义查询
export async function QueryIndicatorSchemeDefinition(payload: any) {
  const option = {
    url: queryIndicatorSchemeDefinition,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 交易全部账户列表
export async function QueryQueryProfitAllAcount(payload: any) {
  const option = {
    url: queryProfitAllAcount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询成交流水全部账户图标
export async function QueryProfitAllAcountTable(payload: any) {
  const option = {
    url: queryProfitAllAcountTable,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询成交流水普通、信用账户列表
export async function QueryProfitNormalAcount(payload: any) {
  const option = {
    url: queryProfitNormalAcount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询成交理财账户列表
export async function QueryProfitfinanAcount(payload: any) {
  const option = {
    url: queryProfitfinanAcount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询成交流水期权账户列表
export async function QueryProfitOptionAcount(payload: any) {
  const option = {
    url: queryProfitOptionAcount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//  查询资金流水
export async function QueryCapitalFlowAccount(payload: any) {
  const option = {
    url: queryCapitalFlowAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}


export async function QueryYuyueWater(payload: any) {
  const option = {
    url: queryYuyueWater,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取上一个交易日时间
export async function GetProfitDate(payload: any) {
  const option = {
    url: getProfitDate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取上一个交易日时间
export async function QueryFundInvestmentAccount(payload: any) {
  const option = {
    url: queryFundInvestmentAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户概况基本信息接口
export async function QueryCustAllInfoBase(payload: any) {
  const option = {
    url: queryCustAllInfoBase,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取更多客户基本信息
export async function QueryCustAllInfoMore(payload: any) {
  const option = {
    url: queryCustAllInfoMore,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询客户是否拥有对应的客户号权限
export async function QueryCustomerAccessControl(payload: any) {
  const option = {
    url: getCustomerAccessControl,
    method: 'post',
    data: payload,
  };
  return request(option);
}
export async function JoinQuant(payload: any) {
  const option = {
    url: joinQuant,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function GetRecommendCapital(payload: any) {
  const option = {
    url: getRecommendCapital,
    method: 'post',
    data: payload,
  };
  return request(option);
}


//客户概况基本信息接口--期权账号费率
export async function QueryOriNetCommissions(payload: any) {
  const option = {
    url:queryOriNetCommissions,
    method: 'get',
    data: payload,
  };
  return request(option);
}

export async function QueryStockRate(payload: any) {
  const option = {
    url:queryStockRate,
    method: 'get',
    data: payload,
  };
  return request(option);
}
export async function QuerySaHaStockRate(payload: any) {
  const option = {
    url: querySaHaStockRate,
    method: "get",
    data: payload
  };
  return request(option);
}
export async function QueryCustomerComRate(payload: any) {
  const option = {
    url: queryCustomerComRate,
    method: "get",
    data: payload
  };
  return request(option);
}



