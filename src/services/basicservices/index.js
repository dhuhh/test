/* eslint-disable no-undef */
import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  basicservices: {
    cusServiceRecord,
    fillInServiceRecord,
    requirementTypeList,
    recentRequirementType,
    cusMessageSendList,
    messageModList,
    personalServiceRecord,
    serviceCoverageRatio,
    fillInServiceRecordSelectAll,
    statisticalSendMessageChannel,
    cusServicePlanOperate,
    statisticalChannelDetail,
    messageSndStaffChnlNum,
    customerRequirement,
    dataTime,
    operationLog,
    recordPageAccessLog,
    messageSendTemplate,
    phoneImport,
    staffServicePlanHaveTodoNum,
    rmndEventNum,
    todoCenterList, // 待办
    todoCenterClassList,
    completedEventClass,
    completedEventList, // 已办
    workflowNotificationList, // 知会
    userReadWorkflowNotification, // 知会未阅读
    queryServiceRecord,
    readRmndEvent,
    deleteServiceRecord,
    rmndEventList,
    msgSndCusBlackList,
    queryServiceCategoryBySceneType,
    getOnlineUser,
    onlineUserExport,
  },
  // customerbase: {
  //   exportData,
  // },
} = api;

// 获取客户服务记录(当日/历史)
export async function FetchRmndEventNum(payload) {
  const option = {
    url: rmndEventNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户服务记录(当日/历史)
export async function getCusServiceRecord(payload) {
  const option = {
    url: cusServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 填写服务记录
export async function funcFillInServiceRecord(payload) {
  const option = {
    url: fillInServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 填写服务记录 ES
export async function funcFillInServiceRecordES(payload) {
  const option = {
    url: fillInServiceRecordSelectAll,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户消息发送记录(当前/历史)'
export async function getCusMessageSendList(payload) {
  const option = {
    url: cusMessageSendList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取需求分类名称（一级/二级/三级）
export async function getRequirementTypeList(payload) {
  const option = {
    url: requirementTypeList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取最近使用需求分类名称
export async function getRecentRequirementType(payload) {
  const option = {
    url: recentRequirementType,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 服务计划操作
export async function fetchCusServicePlanOperate(payload) {
  const option = {
    url: cusServicePlanOperate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 发消息 获取消息模板列表
export async function fetchMessageModList(payload) {
  const option = {
    url: messageModList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员全景 获取客户需求
export async function getCustomerRequirement(payload) {
  const option = {
    url: customerRequirement,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员全景 获取员工服务记录
export async function FetchPersonalServiceRecord(payload) {
  const option = {
    url: personalServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员全景 获取员工近三月服务覆盖率
export async function FetchServiceCoverageRatio(payload) {
  const option = {
    url: serviceCoverageRatio,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户列表 导出
export async function FetchCustomerExportData(payload) {
  const option = {
    url: exportData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户列表-发消息--统计各个渠道的条数

export async function fetchStatisticalSendMessageChannel(payload) {
  const option = {
    url: statisticalSendMessageChannel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户列表-发消息--统计各渠道详情

export async function fetchStatisticalChannelDetail(payload) {
  const option = {
    url: statisticalChannelDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 员工列表-发消息--统计各个渠道的条数
export async function fetchMessageSndStaffChnlNum(payload) {
  const option = {
    url: messageSndStaffChnlNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 根据表名获取截至日期
export async function fetchDataTime(payload) {
  const option = {
    url: dataTime,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 登记操作日志
export async function fetchOperationLog(payload) {
  const option = {
    url: operationLog,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 页面访问日志
export async function fetchRecordPageAccessLog(payload) {
  const option = {
    url: recordPageAccessLog,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心 获取发送模板
export async function fetchMessageSendTemplate(payload) {
  const option = {
    url: messageSendTemplate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心 获取发送模板
export async function phoneImportFunc(payload) {
  const option = {
    url: phoneImport,
    method: 'post',
    data: payload,
  };
  return request(option, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 首页 -- 获取铃铛计划提醒数
export async function FetchStaffServicePlanHaveTodoNum(payload) {
  const option = {
    url: staffServicePlanHaveTodoNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// HT整合 ------------------------------------------------------------------------------------------------
// 获取人员待办详细数据列表
export async function fetchTodoCenterList(payload) {
  const option = {
    url: todoCenterList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取人员待办分类数据
export async function fetchTodoCenterClassList(payload) {
  const option = {
    url: todoCenterClassList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取人员已办分类数据
export async function fetchCompletedEventClass(payload) {
  const option = {
    url: completedEventClass,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 已办数据列表
export async function fetchCompletedEventList(payload) {
  const option = {
    url: completedEventList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 知会数据列表
export async function fetchNotifyProcessList(payload) {
  const option = {
    url: workflowNotificationList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 阅读知会消息
export async function fetchNotifyProcessReading(payload) {
  const option = {
    url: userReadWorkflowNotification,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 服务记录查询
export async function fetchQueryServiceRecord(payload) {
  const option = {
    url: queryServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 删除服务记录统一入口，可按照场景查询，如MOT类型，任务中心类型等
export async function fetchDeleteServiceRecord(payload) {
  const option = {
    url: deleteServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息提醒-提醒列表
export async function fetchRmndEventList(payload) {
  const option = {
    url: rmndEventList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息提醒-提醒标记已读
export async function fetchReadRmndEvent(payload) {
  const option = {
    url: readRmndEvent,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取消息发送黑名单客户列表
export async function fetchMsgSndCusBlackList(payload) {
  const option = {
    url: msgSndCusBlackList,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 获取场景类型对应的服务类别
export async function fetchQueryServiceCategoryBySceneType(payload) {
  const option = {
    url: queryServiceCategoryBySceneType,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// HT整合 ------------------------------------------------------------------------------------------------

// 在线用户查询 2019.6.11
export async function DogetOnlineUser(payload) {
  const option = {
    url: getOnlineUser,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 在线用户查询 导出按钮 2019.6.11
export async function DoOnlineUserExport(payload) {
  const option = {
    url: onlineUserExport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

