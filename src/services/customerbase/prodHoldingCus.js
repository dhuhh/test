import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { prodHoldingCus } } = api;

// 产品全景--持仓交易--持仓客户
export async function fetchProdHoldingCus(payload) {
  const option = {
    url: prodHoldingCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
