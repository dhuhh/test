import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusFinancialTradePosition } } = api;

// 客户全景-持仓交易  获取客户理财账户持仓
export async function getCusFinancialTradePosition(payload) {
  const option = {
    url: cusFinancialTradePosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
