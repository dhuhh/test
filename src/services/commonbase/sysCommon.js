import request from '../../utils/request';
import config from '../../utils/config';
import { getObjKey } from '../../utils/dictUtils';

const { api } = config;
// const { commonbase: { getSysObject } } = api;
const { sysCommon: { direct } } = api;

// 查询LiveBOS对象的数据接口
export async function FetchSysCommonTable(payload) {
  const option = {
    // url: getSysObject,
    url: `/product${direct}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function fetchObject(name, opt = {}) {
  const dxmc = getObjKey(name);
  const response = await FetchSysCommonTable({ dxmc, ...opt });
  return {
    name: dxmc,
    ...response,
  };
}
