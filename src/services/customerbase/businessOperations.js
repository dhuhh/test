import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { customerbase: { userUnreadNoticeMsgNum, userTodoWorkflowNum } } = api;

// 获取未读知会消息数
export async function fetchUserUnreadNoticeMsgNum(payload) {
  const option = {
    url: userUnreadNoticeMsgNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取待办流程数
export async function fetchUserTodoWorkflowNum(payload) {
  const option = {
    url: userTodoWorkflowNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}
