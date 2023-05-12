import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusTradePosition } } = api;

// 客户全景-持仓交易  获取客户合并账户持仓
export async function getCusTradePosition(payload) {
  const option = {
    url: cusTradePosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
