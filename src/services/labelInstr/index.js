import request from "../../utils/request";
import config from "../../utils/config";
const { api } = config;
const {
  newProduct: {
    queryCustIndi,//考核指标查询
    operateCustIndi,//考核指标操作
    queryCalcFormulaParam,//计算公式参数查询
    queryViewColumns,//查询展示列
  } } = api;

//考核指标查询
export async function FetchQueryCustIndi(payload = {}) {
  const option = {
    url: queryCustIndi,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//考核指标操作
export async function _operateCustIndi(payload = {}) {
  const option = {
    url: operateCustIndi,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//计算公式参数查询
export async function FetchQueryCalcFormulaParam(payload = {}) {
  const option = {
    url: queryCalcFormulaParam,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//查询展示列
export async function FetchQueryViewColumns(payload = {}) {
  const option = {
    url: queryViewColumns,
    method: 'post',
    data: payload,
  };
  return request(option);
}