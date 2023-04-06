import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { sysParam } } = api;

// 获取系统参数（限制范围）
export async function fetchSysParam(payload) {
  const option = {
    url: sysParam,
    method: 'post',
    data: payload,
  };
  return request(option);
}
