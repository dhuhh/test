import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusGroupCusList, importGroupCus, importGroupCusInfo } } = api;

// 客户群组件, 根据客户群类型获取客户群信息, 然后触发回调函数
export async function getCusGroupCusList(payload) {
  const option = {
    url: cusGroupCusList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户群  查询待导入客户群客户信息
export async function getImportGroupCusInfo(payload) {
  const option = {
    url: importGroupCusInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户群  导入客户群客户信息
export async function getImportGroupCus(payload) {
  const option = {
    url: importGroupCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
