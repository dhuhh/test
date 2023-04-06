import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { mockEvaluation: {
  prodEvaluationDetailsQuery, prodEvaluationResultCommit,
} } = api;

// 产品评价明细查询
export async function FetchProdEvaluationDetailsQuery(payload) {
  const option = {
    url: prodEvaluationDetailsQuery,
    method: 'POST',
    data: payload,
  };
  return request(option);
}
// 产品评价结果提交
export async function FetchProdEvaluationResultCommit(payload) {
  const option = {
    url: prodEvaluationResultCommit,
    method: 'POST',
    data: payload,
  };
  return request(option);
}
