import request from '../../utils/request';
import config from '../../utils/config';

const { ftq } = config;

const {
  activityComPage: {
    queryKhwdRanking,
    queryYybRanking,
    queryYgRanking,
    queryPotentialCustLossList,
    exportPotentialCustLossList,
    queryManufacturerPaysList,
    queryStaffCommissionList,
    queryDictionary,
    queryNewValidCustomer,
    queryMidAffluentCustomer,
    queryNewCreditCustomer,
    queryFinancialProSale,
    queryFundAdviseSign,
    queryFullCommissionSign,
    queryCustAuth,
    getMarketDay,
    queryExportAuth,
    queryAssetIntroduce,
    importData,
    queryNewValidCust,
    queryMidAffluentCust,
    queryMarginBalance,
    queryFinProSale,
    queryExportAuthQ2,
    queryCustAuthQ2,
    importDataQ2,
  }
} = ftq;

// 财富稳增长--分支机构
export async function QueryKhwdRanking(payload) {
  const option = {
    url: queryKhwdRanking ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 财富稳增长--分支机构--弹窗
export async function QueryYybRanking(payload) {
  const option = {
    url: queryYybRanking ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 财富稳增长--个人
export async function QueryYgRanking(payload) {
  const option = {
    url: queryYgRanking ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 潜在流失客户--列表
export async function QueryLossList(payload) {
  const option = {
    url: queryPotentialCustLossList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 潜在流失客户--列表--导出
export async function ExportLossList(payload) {
  const option = {
    url: exportPotentialCustLossList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 增益型算法--厂商付费列表
export async function QueryManuPaysList(payload) {
  const option = {
    url: queryManufacturerPaysList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 增益型算法--付费品种字典
export async function QueryDictionary(payload) {
  const option = {
    url: queryDictionary ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 增益型算法--员工提成列表
export async function QueryStaffList(payload) {
  const option = {
    url: queryStaffCommissionList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--新增有效户
export async function QueryNewValidCustomer(payload) {
  const option = {
    url: queryNewValidCustomer,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--新增中端富裕客户
export async function QueryMidAffluentCustomer(payload) {
  const option = {
    url: queryMidAffluentCustomer,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--融资融券
export async function QueryNewCreditCustomer(payload) {
  const option = {
    url: queryNewCreditCustomer,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--理财产品销售
export async function QueryFinancialProSale(payload) {
  const option = {
    url: queryFinancialProSale,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--基金投顾
export async function QueryFundAdviseSign(payload) {
  const option = {
    url: queryFundAdviseSign,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--全提佣签约
export async function QueryFullCommissionSign(payload) {
  const option = {
    url: queryFullCommissionSign,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 开门红特定人员客户明细导出权限点
export async function QueryCustAuth(payload) {
  const option = {
    url: queryCustAuth,
    method: "get",
    data: payload,
  };
  return request(option);
}
// 交易日  T-1 (T-N)
export async function GetMarketDay(payload) {
  const option = {
    url: getMarketDay,
    method: "get",
    data: payload,
  };
  return request(option);
}
// 开门红特定人员客户明细导出权限点
export async function QueryExportAuth(payload) {
  const option = {
    url: queryExportAuth,
    method: "get",
    data: payload,
  };
  return request(option);
}
// 营业部--资产引入
export async function QueryAssetIntroduce(payload) {
  const option = {
    url: queryAssetIntroduce,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 开门红导入
export async function ImportData(payload) {
  const option = {
    url: importData,
    method: "post",
    data: payload,
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // },
  };
  return request(option);
}
// ****************************二季度伙伴行动**************************
// 分支机构奖项--新增有效户
export async function QueryNewValidCust(payload) {
  const option = {
    url: queryNewValidCust,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 分支机构奖项--新增中端富裕客户
export async function QueryMidAffluentCust(payload) {
  const option = {
    url: queryMidAffluentCust,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分支机构奖项--融资融券
export async function QueryMarginBalance(payload) {
  const option = {
    url: queryMarginBalance,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 分支机构奖项--理财产品销售
export async function QueryFinProSale(payload) {
  const option = {
    url: queryFinProSale,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 开门红特定人员客户明细导出权限点
export async function QueryExportAuthQ2(payload) {
  const option = {
    url: queryExportAuthQ2,
    method: "get",
    data: payload,
  };
  return request(option);
}
// 开门红特定人员客户明细导出权限点
export async function QueryCustAuthQ2(payload) {
  const option = {
    url: queryCustAuthQ2,
    method: "get",
    data: payload,
  };
  return request(option);
}
// 开门红导入
export async function ImportDataQ2(payload) {
  const option = {
    url: importDataQ2,
    method: "post",
    data: payload,
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // },
  };
  return request(option);
}