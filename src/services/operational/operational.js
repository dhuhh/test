/* eslint-disable no-unused-vars */
import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  operational: {
    prodOperateCalendar,
  },
} = api;


// 运营日历查询
export async function FetchProdOperateCalendar(payload) {
  const option = {
    url: `/product${prodOperateCalendar}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

