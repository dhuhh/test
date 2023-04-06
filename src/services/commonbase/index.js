import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  commonbase: {
    userTodoWorkflowNum,
    userMenuProject,
    userProjectUpdate,
    dynamicReminder,
    queryInnerObject,
    downloadFile,
    queryProcessNavigation,
    queryOtherUsers,
    downloadAttachmentOfDocumentByZip,
    uploadProto,
  },
} = api;

// 首页 -- 未读消息提醒数
export async function FetchUserTodoWorkflowNum(payload) {
  const option = {
    url: userTodoWorkflowNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页 -- 获取菜单
export async function FetchUserMenuProject(payload) {
  const option = {
    url: userMenuProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页 -- 记录用户选择的菜单
export async function FetchUserProjectUpdate(payload) {
  const option = {
    url: userProjectUpdate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页 -- 动态提醒
export async function FetchUserNoticeList(payload) {
  const option = {
    url: dynamicReminder,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取内部对象
export async function FetchQueryInnerObject(payload) {
  const option = {
    url: `/product${queryInnerObject}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// livebos附件下载
export async function FetchDownloadFile(payload) {
  const option = {
    url: downloadFile,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 流程导航查询
export async function FetchQueryProcessNavigation(payload) {
  const option = {
    url: queryProcessNavigation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取人员其他用户
export async function FetchQueryOtherUsers(payload) {
  const option = {
    url: queryOtherUsers,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品文档打包下载
export async function FetchDownloadAttachmentOfDocumentByZip(payload) {
  const option = {
    url: downloadAttachmentOfDocumentByZip,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员头像图片上传入口
export async function FetchUploadProto(payload) {
  const option = {
    url: uploadProto,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取流程类型
export async function FetchSysCommonTable(payload) {
  const data = {
    records: [
      { ID: '1', TpNm: '0-5%(含)' },
      { ID: '2', TpNm: '5-8%(含)' },
      { ID: '3', TpNm: '8%以上' },
    ],
    code: 1,
    total: 5,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

// 获取首页权限数据
export async function FetchTimeType(payload) {
  const data = {
    records: [
      { id: 1, name: '日' },
      { id: 2, name: '周' },
      { id: 3, name: '月' },
    ],
    code: 1,
    total: 1,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

// 获取首页权限数据
export async function FetchTags(payload) {
  const data = {
    records: [
      { id: 1, name: '系统标签' },
      { id: 2, name: '手工标签' },
    ],
    code: 1,
    total: 2,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}
