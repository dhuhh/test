import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusGeneralTradePosition } } = api;

// 客户全景-持仓交易  获取客户普通账户持仓
export async function getCusGeneralTradePosition(payload) {
  const option = {
    url: cusGeneralTradePosition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
