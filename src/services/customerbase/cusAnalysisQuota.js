import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusAnalysisQuota } } = api;

// 客户通用  获取客户分析指标
export async function getCusAnalysisQuota(payload) {
  const option = {
    url: cusAnalysisQuota,
    method: 'post',
    data: payload,
  };
  return request(option);
}
