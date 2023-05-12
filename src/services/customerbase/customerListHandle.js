import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { myCusLable, myCommonSearch, cusListDisplayColumn, saveMySearchInfo, orderServer } } = api;

// 获取当前用户的可选标签
export async function FetchMyCusLable(payload) {
  const option = {
    url: myCusLable,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取常用搜索
export async function FetchMyCommonSearch(payload) {
  const option = {
    url: myCommonSearch,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取客户列表可显示列
export async function FetchCusListDisplayColumn(payload) {
  const option = {
    url: cusListDisplayColumn,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户列表-保存用户查询信息
export async function FetchSaveMySearchInfo(payload) {
  const option = {
    url: saveMySearchInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 客户列表-保存定制的产品
export async function saveOrderedService(payload) {
  const option = {
    url: orderServer,
    method: 'post',
    data: payload,
  };
  return request(option);
}

