import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusStockOptionTradePosition } } = api;

// 客户全景-持仓交易  获取客户股票期权账户持仓
export async function getCusStockOptionTradePosition(payload) {
  const option = {
    url: cusStockOptionTradePosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
