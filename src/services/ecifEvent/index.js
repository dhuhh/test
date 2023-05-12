import request from '../../utils/request';
import config from '../../utils/config';

const { ftq , api } = config;

const { ecifEvent: { queryEcifEventDetailCusList, queryEventCustomerInfoList , queryRelEventList , queryEventTreatmentRecordList , saveEventTreatment , queryTaskManageList , queryAuditingManageList , queryTreatmentPeopleList , taskDistribution , queryEventInfo ,
  queryAuditingRecordCustInfo , queryAuditingRecordList , queryIsZb , batchAuditing , uploadFile , queryEventDetail , queryCustomerEventDatas , 
} } = ftq;


const { newProduct: { queryEventInfoCus , queryEventCustomerList ,
} } = api;

// ECIF事件列表
export async function QueryEcifEventDetailCusList(payload) {
  const option = {
    url: queryEcifEventDetailCusList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// ECIF事件列表客户信息
export async function QueryEventCustomerInfoList(payload) {
  const option = {
    url: queryEventCustomerInfoList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// ECIF事件--待处理事件--关联事件
export async function QueryRelEventList(payload) {
  const option = {
    url: queryRelEventList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// ECIF事件--处理记录
export async function QueryEventTreatmentRecordList(payload) {
  const option = {
    url: queryEventTreatmentRecordList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// ECIF事件--保存事件
export async function SaveEventTreatment(payload) {
  const option = {
    url: saveEventTreatment ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 检核任务管理
export async function QueryTaskManageList(payload) {
  const option = {
    url: queryTaskManageList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 审核任务管理
export async function QueryAuditingManageList(payload) {
  const option = {
    url: queryAuditingManageList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 执行人列表
export async function QueryTreatmentPeopleList(payload) {
  const option = {
    url: queryTreatmentPeopleList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 任务分配
export async function TaskDistribution(payload) {
  const option = {
    url: taskDistribution ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 审核任务管理页头--未办数/客户数
export async function QueryEventInfo(payload) {
  const option = {
    url: queryEventInfo ,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 客户审核详情
export async function QueryRecordInfo(payload) {
  const option = {
    url: queryAuditingRecordCustInfo ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户审核详情
export async function QueryRecordList(payload) {
  const option = {
    url: queryAuditingRecordList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户审核详情
export async function QueryIsZb(payload) {
  const option = {
    url: queryIsZb ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 批量审核
export async function BatchAuditing(payload) {
  const option = {
    url: batchAuditing ,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 附件上传
export async function UploadOssFile(payload) {
  const option = {
    url: uploadFile ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页日历--事件--事件表头
export async function QueryEventDetail(payload) {
  const option = {
    url: queryEventDetail ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页日历--事件--事件列表
export async function QueryCustomerEventDatas(payload) {
  const option = {
    url: queryCustomerEventDatas ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 系统管理--事件管理--事件表头
export async function QueryEventInfoCus(payload) {
  const option = {
    url: queryEventInfoCus ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 系统管理--事件管理--事件列表
export async function QueryEventCustomerList(payload) {
  const option = {
    url: queryEventCustomerList ,
    method: 'post',
    data: payload,
  };
  return request(option);
}