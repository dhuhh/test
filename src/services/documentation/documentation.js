/* eslint-disable no-unused-vars */
import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { documentation: { getProductDocClass, queryUploadDownCollDoc, queryMyCollectionRules, updateMyCollectionRules, queryProdDocComposite,
} } = api;

// 文档类型
export async function FetchGetProductDocClass(payload) {
  const option = {
    url: getProductDocClass,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 文档管理-最新上传、下载、收藏文档查询
export async function FetchQueryUploadDownCollDoc(payload) {
  const option = {
    url: queryUploadDownCollDoc,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 文档管理-我的收藏规则查询
export async function FetchQueryMyCollectionRules(payload) {
  const option = {
    url: queryMyCollectionRules,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 文档管理-我的收藏规则查询
export async function FetchUpdateMyCollectionRules(payload) {
  const option = {
    url: updateMyCollectionRules,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 文档管理-产品文档综合查询
export async function FetchQueryProdDocComposite(payload) {
  const option = {
    url: queryProdDocComposite,
    method: 'post',
    data: payload,
  };
  return request(option);
}
