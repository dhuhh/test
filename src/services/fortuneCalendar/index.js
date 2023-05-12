import request from '../../utils/request';
import config from '../../utils/config';

const { ftq } = config;
const { fortuneCalendar:{getMonthlyDataResponse,getNoticeDataResponse,getAllProductResponse,getproductSearch} } = ftq;

//查询每月数据
export async function getMonth(payload) {
    const option = {
      url: getMonthlyDataResponse,
      method: 'post',
      data: payload,
    };
    return request(option);
  }

  //查询全部标签
export async function getNotice(payload) {
  const option = {
    url: getNoticeDataResponse,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//产品名称
export async function getProduct(payload) {
  const option = {
    url: getAllProductResponse,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//产品
export async function getSearch(payload) {
  const option = {
    url: getproductSearch,
    method: 'post',
    data: payload,
  };
  return request(option);
}