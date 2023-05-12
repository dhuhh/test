import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusCreditTradePosition } } = api;

// 客户全景-持仓交易  获取客户信用账户持仓
export async function getCusCreditTradePosition(payload) {
  const option = {
    url: cusCreditTradePosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
