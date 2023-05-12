import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { cusLabelClassification, customerPortraitLabel } } = api;

// 客户分析  标签分类
export async function getCusLabelClassification(payload) {
  const option = {
    url: cusLabelClassification,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户全景 画像  系统标签
export async function getCustomerPortraitLabel(payload) {
  const option = {
    url: customerPortraitLabel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
