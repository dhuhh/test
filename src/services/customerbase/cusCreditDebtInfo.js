import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusCreditDebtInfo } } = api;

// 客户全景-持仓交易  获取客户信用负债信息
export async function getCusCreditDebtInfo(payload) {
  const option = {
    url: cusCreditDebtInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
