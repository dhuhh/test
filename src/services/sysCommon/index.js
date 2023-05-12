import request from '../../utils/request';
import config from '../../utils/config';
import { getObjKey } from '../../utils/dictUtils';

const { api } = config;
const { sysCommon: { direct } } = api;

// 查询LiveBOS对象的数据接口
export async function FetchSysCommonTable(payload) {
  const { objectName = '', condition, queryOption = {} } = payload;
  const { orderBy = '' } = queryOption;
  const tmplName = `objquery-${objectName.toLocaleLowerCase()}`;
  const tmplPayload = {
    serviceId: tmplName,
    payload: { macro: '1', sort: orderBy, ...condition },
  };
  const option = {
    url: direct,
    method: 'post',
    data: tmplPayload,
  };
  return request(option);
}

export async function fetchObject(name, opt = {}) {
  const objectName = getObjKey(name);
  const response = await FetchSysCommonTable({ objectName, ...opt });
  return {
    name: objectName,
    ...response,
  };
}
