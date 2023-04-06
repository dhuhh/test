export default [
  {
    code: '508101', key: 'cusServiceRecord', url: '/basicservices/v1/cusServiceRecord', dis: '服务记录  获取客户服务记录（当日/历史）',
  },
  {
    code: '508102', key: 'fillInServiceRecord', url: '/basicservices/v1/fillInServiceRecord', dis: '服务记录  填写服务记录',
  },
  {
    code: '508103', key: 'personalServiceRecord', url: '/basicservices/v1/personalServiceRecord', dis: '服务记录  获取某个人员服务记录',
  },
  {
    code: '508104', key: 'serviceCoverageRatio', url: '/basicservices/v1/serviceCoverageRatio', dis: '服务记录  获取员工近三月服务覆盖率',
  },
  {
    code: '508201', key: 'recentRequirementType', url: '/basicservices/v1/recentRequirementType', dis: '客户需求  获取用户最近使用需求分类名称',
  },
  {
    code: '508202', key: 'requirementTypeList', url: '/basicservices/v1/requirementTypeList', dis: '客户需求  获取需求分类名称（一级/二级/三级）',
  },
  {
    code: '508203', key: 'fillInRequirement', url: '/basicservices/v1/fillInRequirement', dis: '客户需求  登记需求',
  },
  {
    code: '508301', key: 'messageSendStrategy', url: '/basicservices/v1/messageSendStrategy', dis: '消息中心  获取发送策略列表',
  },
  {
    code: '508302', key: 'messageModList', url: '/basicservices/v1/messageModList', dis: '消息中心  获取消息模板列表',
  },
  {
    code: '508303', key: 'staffMessageQuota', url: '/basicservices/v1/staffMessageQuota', dis: '消息中心  获取员工短信配额度',
  },
  {
    code: '508304', key: 'messageSendChannel', url: '/basicservices/v1/messageSendChannel', dis: '消息中心  获取发送渠道列表',
  },
  {
    code: '508306', key: 'messageBatchRvw', url: '/basicservices/v1/messageBatchRvw', dis: '消息中心  消息批次审核操作',
  },
  {
    code: '508307', key: 'messageBatchList', url: '/basicservices/v1/messageBatchList', dis: '消息中心  获取发送批次列表(发件箱/已发送/草稿箱)',
  },
  {
    code: '508308', key: 'messageBatchAdtBoxList', url: '/basicservices/v1/messageBatchAdtBoxList', dis: '消息中心  获取发送批次列表(审核箱)',
  },
  {
    code: '508309', key: 'messageBatchDtl', url: '/basicservices/v1/messageBatchDtl', dis: '消息中心  获取发送批次详细信息',
  },
  {
    code: '508310', key: 'cusMessageSendList', url: '/basicservices/v1/cusMessageSendList', dis: '消息中心  获取客户消息记录(当前/历史)',
  },
  {
    code: '508311', key: 'messageSendDSC', url: '/basicservices/v1/messageSendDSC', dis: '消息中心  消息发送明细保存DSC',
  },
  {
    code: '508312', key: 'messageBatchListDSC', url: '/basicservices/v1/messageBatchListDSC', dis: '消息中心  获取DSC消息明细',
  },
  {
    code: '508313', key: 'messageBatchNum', url: '/basicservices/v1/messageBatchNum', dis: '消息中心  获取消息批次数(发件箱/已发送/草稿箱)',
  },
  {
    code: '508314', key: 'messageBatchAdtboxNum', url: '/basicservices/v1/messageBatchAdtboxNum', dis: '消息中心  获取消息批次数(审核箱)',
  },
  {
    code: '508315', key: 'messageSndDtl', url: '/basicservices/v1/messageSndDtl', dis: '消息中心  获取消息发送明细',
  },
  {
    code: '508316', key: 'messageSndDtlDSC', url: '/basicservices/v1/messageSndDtlDSC', dis: '消息中心  获取消息发送明细-DSC',
  },
  {
    code: '508319', key: 'messageSndStaffChnlNum', url: '/basicservices/v1/messageSndStaffChnlNum', dis: '发消息  获取人员各渠道发送数量',
  },
  {
    code: '508401', key: 'cusServicePlan', url: '/basicservices/v1/cusServicePlan', dis: '服务计划  客户通用-客户服务计划查询',
  },
  {
    code: '508402', key: 'cusServicePlanOperate', url: '/basicservices/v1/cusServicePlanOperate', dis: '服务计划  客户列表-服务计划操作',
  },
  {
    code: '508104', key: 'serviceCoverageRatio', url: '/basicservices/v1/serviceCoverageRatio', dis: '系统首页  获取员工近三月服务覆盖率',
  },
  {
    code: 'fillInServiceRecordSelectAll', key: 'fillInServiceRecordSelectAll', url: '/basicservices/v1/fillInServiceRecordSelectAll', dis: '服务记录  获取某个人员服务记录',
  },
  {
    code: 'fillInCusServicePlan', key: 'fillInCusServicePlan', url: '/basicservices/v1/fillInCusServicePlan', dis: '制定服务计划  填写服务计划',
  },
  {
    code: 'statisticalSendMessageChannel', key: 'statisticalSendMessageChannel', url: '/basicservices/v1/statisticalSendMessageChannel', dis: '客户列表  发消息 统计各渠道的条数',
  },
  {
    code: 'statisticalChannelDetail', key: 'statisticalChannelDetail', url: '/basicservices/v1/statisticalChannelDetail', dis: '客户列表  发消息 统计各渠道详情',
  },
  {
    code: 'sendMessageFile', key: 'sendMessageFile', url: '/amslb/docs/upload/sendMessage', dis: '发消息 上传附件接口',
  },
  {
    code: 'deletMessageFile', key: 'deletMessageFile', url: '/amslb/docs/', dis: '发消息 删除中转附件',
  },
  {
    code: 'getMessageFile', key: 'getMessageFile', url: '/amslb/docs/downloadRedisFile/', dis: '发消息 获取中转附件',
  },
  {
    code: '508403', key: 'customerRequirement', url: '/basicservices/v1/requirementInfo', dis: '服务信息 客户需求',
  },
  {
    code: '508501', key: 'dataTime', url: '/basicservices/v1/dataTime', dis: '根据不同表名获取截至日期',
  },
  {
    code: '508326', key: 'draftSend', url: '/basicservices/v1/messageDraftSend', dis: '消息中心 草稿箱消息发送',
  },
  {
    code: '508205', key: 'operationLog', url: '/commonbase/v1/operationLog', dis: '登记操作日志',
  },
  {
    code: '', key: 'recordPageAccessLog', url: '/logManagement/v1/recordPageAccessLog', dis: '记录页面访问日志',
  },
  {
    code: '508335', key: 'messageSendTemplate', url: '/basicservices/v1/messageSendTemplate', dis: '消息中心 获取发送模板',
  },
  {
    code: 'phoneImport', key: 'phoneImport', url: '/basicservices/v1/phoneImport', dis: '消息中心 获取发送模板',
  },
  {
    code: '', key: 'staffServicePlanHaveTodoNum', url: '/basicservices/v1/staffServicePlanHaveTodoNum', dis: '首页 铃铛计划提醒数',
  },
  // HT整合 ------------------------------------------------------------------------------------------------------------------------
  {
    code: '', key: 'todoCenterList', url: '/basicservices/v1/todoCenterList', dis: '获取待办数据详细列表',
  },
  {
    code: '', key: 'todoCenterClassList', url: '/basicservices/v1/todoCenterClassList', dis: '获取待办分类数据',
  },
  {
    code: '', key: 'completedEventClass', url: '/basicservices/v1/completedEventClass', dis: '获取已办分类数据',
  },
  {
    code: '', key: 'completedEventList', url: '/basicservices/v1/completedEventList', dis: '获取已办分类数据详细列表',
  },
  {
    code: '', key: 'workflowNotificationList', url: '/basicservices/v1/workflowNotificationList', dis: '获取流程知会列表',
  },
  {
    code: '', key: 'userReadWorkflowNotification', url: '/basicservices/v1/userReadWorkflowNotification', dis: '阅读知会消息',
  },
  {
    code: '', key: 'queryServiceRecord', url: '/basicservices/v1/queryServiceRecord', dis: '服务记录查询',
  },
  {
    code: '', key: 'deleteServiceRecord', url: '/basicservices/v1/deleteServiceRecord', dis: '删除服务记录统一入口，可按照场景查询，如MOT类型，任务中心类型等',
  },
  {
    code: '', key: 'queryServiceCategoryBySceneType', url: '/basicservices/v1/queryServiceCategoryBySceneType', dis: '获取场景类型对应的服务类别',
  },
  {
    code: '', key: 'rmndEventList', url: '/basicservices/v1/rmndEventList', dis: '消息提醒-提醒事件列表',
  },
  {
    code: '', key: 'readRmndEvent', url: '/basicservices/v1/readRmndEvent', dis: '消息提醒-提醒事件标记已读',
  },
  {
    code: '', key: 'rmndEventNum', url: '/basicservices/v1/rmndEventNum', dis: '任务/计划/其他-消息数',
  },
  {
    code: '', key: 'msgSndCusBlackList', url: '/basicservices/v1/msgSndCusBlackList', dis: '消息发送黑名单客户',
  },
  {
    code: '', key: 'createTask', url: '/amslb/docs/upload/createTask', dis: '创建任务 上传附件接口',
  },
  {
    code: '', key: 'deletUploadFile', url: '/amslb/docs/', dis: '任务中心 删除上传附件',
  },
  {
    code: '', key: 'getOnlineUser', url: '/basicservices/v1/getOnlineUser', dis: '查询在线用户',
  },
  {
    code: '', key: 'onlineUserExport', url: '/basicservices/v1/onlineUserExport', dis: '查询在线用户 导出',
  },
  // HT整合 ------------------------------------------------------------------------------------------------------------------------
  {
    code: 'uploadSingleFile', key: 'uploadSingleFile', url: '/amslb/docs/upload', dis: '单附件临时上传专用接口',
  },
];
