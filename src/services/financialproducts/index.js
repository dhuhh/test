import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { financialproducts: { queryProductTips, } } = api;

// 系统首页  金融产品模糊搜索提示
export async function FetchQueryProductTips(payload) {
  const option = {
    url: queryProductTips,
    method: 'post',
    data: payload,
  };
  return request(option);
}