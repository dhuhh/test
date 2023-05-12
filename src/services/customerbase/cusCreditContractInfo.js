import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusCreditContractInfo } } = api;

// 客户全景-持仓交易  获取客户信用合同信息
export async function getCusCreditContractInfo(payload) {
  const option = {
    url: cusCreditContractInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
