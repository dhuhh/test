import request from "../../utils/request";
import config from "../../utils/config";

const { api, ftq } = config;

const {
  newProduct: {
    queryInvestPlanList,
    queryAIPDeductionDetails,
    queryFinancailCusList,
    salesBoard,
    productDisplayColumn,
    myLastSearchScheme,
    productCusList,
    queryStatisticsCycleConfig,
    queryProductList,
    productCommonSearch,
    chooseMyProduct,
    exportDataFinancailCusList,
    cusProductList,
    queryOtherListDisplayColumn,
    queryUserPermission,
    querySingleProductDetail,
    productCountAggs,
    saleAndIncomeList,
    queryStatisticalCycle,
    confirmUploadComplete,
    queryUploadList,
    inAndReAuditImport,
    inAndReAuditDelete,
    queryIncomeAndRewardList,
    queryBackLogList,
    queryCalContent,
    queryUserTaskCust,
    quertTaskServiceLog,
    saveOverLookUserTaskCust,
    queryEventDetailCusList,
    queryEventDetail,
    queryRelationEventList,
    queryWorkSetting,
    queryUserTaskListInformation,
    queryUserTaskListInformationDetails,
    saveWorkSetting,
    saveTakeNotesProcessInfo,
    ignoreEvent,
    saveUserTaskStrikeOut,
    findHqDeal4hisStock,
    queryCusInfo,
    queryCusLabel,
    queryAnaCalendar,
    queryAnaDetail,
    queryAnaScore,
    queryOpeCalendar,
    queryOpeSpecial,
    queryCusSuitInfo,
    queryStockTrendChart,
    queryStockKLine,
    getChannelInfoModel,
    channelManagementModel,
    optionalStaffList,
    getOperateRecord,
    getGroupInfoModel,
    groupManagement,
    getChannelInfoExport,
    getAchievementAnalysis,
    getChannelCustList,
    getMyQRCode,
    saveOperateRecord,
    queryUserRoleInfo,
    queryStaffPracticeInfo,
    getCommissionAgreementInfo,
    queryStaffTips,
    queryChannelAuthorityDepartment,
    getachievements,
    getChannelRecords,
    getSalarys,
    getAllAccountDate,
    getChnnlAccnBreakCust,
    getTracksCustInfoList,
    getAllAccountDateExport,
    getSalarysExport,
    getachievementsExport,
    getChannelRecordsExport,
    saveChnnlAccnBreakCust,
    channelServiceRecord,
    getAllAccountDatePop,
    getAllAccountDatePopExport,
    queryLevelBenefit,
    queryBenefitUserList,
    queryLockBenefit,
    queryCustMessage,
    queryBenefitName,
    queryCustBenefit,
    queryPcxJjtgYjbb,
    queryZhdm,
    queryCustBasicInfo,
    queryNewCustchanges,
    queryCustGradeDis,
    queryCustServiceDis,
    queryCustAssetOverview,
    queryProportionOfAsset,
    queryZcRankInfo,
    queryAssetTrendAnalysis,
    queryIncomeGeneInfo,
    queryWorksInfo,
    queryServiceChange,
    queryServieBackLogList,
    invstmentAdviserSaver,
    queryStrategyDetail,
    queryIndex,
    queryDepartIndexValue,
    queryStaffIndexValue,
    queryEmpInfo,
    queryStaffEfficiency,//员工主页绩效查询
    queryAssIndicators,
    queryIndexCustDetails,//查询员工指标明细客户，
    queryScoreDetails, //员工得分明细,
    queryAssessmentScore,//查询考核得分计算公式
    /* -----客户指标部分----- */
    addCustIndex,//新增客户指标
    deleteCustCode,//删除客户指标
    queryCustCodeObscure,//客户指标模糊查询
    queryCustMetricsTree,//查询客户指标树
    queryCustIndiDetails,//查询客户指标详情
    updateCustIndexDetails,//编辑客户指标
    getUpdateStatus,//指标校验
    updateIndexUpAndDown,//指标上下架
    addTask,//创建任务
    queryBusinessDetails,//创建任务业务明细查询
    appRetrofitV1Upload,//创建任务上传附件
    queryCueTaskDetails,//素材列表
    queryMarketMaterials,//查询展业素材列表
    queryUserTaskCustNew,//代办线索流任务表格查询
    getAIGridStockPool,//获取股票池数据
    queryCustomerStockPool,//个人持仓查询
    saveCompleteUserTaskCust,//潜客处理
  },
} = api;
const {
  getMyQrCodeWithLogo: {
    getMyQrCodeWithLogo,
    getBankCodeList,
    writerEventContext,
    recorderEventContext,
    earnEventLink,
    earnMessageStaff,
    sendMessage,
    queryServiceRecorder,
  },
  newProduct: {
    queryOwnershipDetail,
    queryProductAppointment,
    queryProductType,
    queryInvalidCustomer,
    queryTianlibao,
    marginFinance,
    stockOptions,
    HongkongStock,
    queryThreeBoard,
    querySTARMarket,
    queryGEMarket,
    queryBSE,
    queryFundInvestmentAdvisor,
    queryTag,
    queryCustomerGroup,
    queryScenes,
    queryMarketMaterial,
    queryQualificationInfo,
    getEventFinishStatResponse,
    getWorkStatResponse,
    getEventListResponse,
    getDepartmentStatDetailResponse,
    getWorkStatDetailResponse,
    getStaffStatDetailResponse,
    getEventPushStatResponse,
    getMotTypeResponse,
    getServiceDetailResponse,
    getHeadOfficeResponse,
    getStaffDetailResponse,
    queryRolePowerList,
    queryCreditInfo,
    queryStrategyToolInfo,
    queryStrategyToolPositionInfo,
    queryStrategyToolStockInfo,
    custProductDetail,
    getBankGroupInfo,
  },
} = ftq;

// 产品销售一体化-定投查询列表
export async function FetchQueryInvestPlanList(payload) {
  const option = {
    url: queryInvestPlanList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品销售一体化-定投查询-扣款明细
export async function FetchQueryAIPDeductionDetailst(payload) {
  const option = {
    url: queryAIPDeductionDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品销售一体化-理财客户列表
export async function FetchQueryFinancailCusList(payload) {
  const option = {
    url: queryFinancailCusList,
    method: "post",
    data: payload,
  };
  return request(option);
}

//金融产品列表-销售看板
export async function FetchSalesDisplayBoard(payload) {
  const option = {
    url: salesBoard,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品列表查询可显示列
export async function FetchProductDisplayColumn(payload) {
  const option = {
    url: productDisplayColumn,
    method: "post",
    data: payload,
  };
  return request(option);
}

//产品销售一体化产品详情-客户列表
export async function FetchProductCusList(payload) {
  const option = {
    url: productCusList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品列表 查询用户最近一次查询方案
export async function FetchMyLastSearchScheme(payload) {
  const option = {
    url: myLastSearchScheme,
    method: "post",
    data: payload,
  };
  return request(option);
}

//查询统计周期
export async function FetchQueryStaticsCycleConfig(payload) {
  const option = {
    url: queryStatisticsCycleConfig,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 安信金融产品--产品列表
export async function FetchQueryProductList(payload) {
  const option = {
    url: queryProductList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品列表-获取产品常用搜索
export async function FetchProductCommonSearch(payload) {
  const option = {
    url: productCommonSearch,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品列表 自选产品
export async function FetchChooseMyProduct(payload) {
  const option = {
    url: chooseMyProduct,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 产品销售一体化-理财客户列表-列表导出
export async function FetchExportDataFinancailCusList(payload) {
  const option = {
    url: exportDataFinancailCusList,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 产品销售一体化-理财客户列表-客户持有产品列表
export async function FetchCusProductList(payload) {
  const option = {
    url: cusProductList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品销售一体化-理财客户列表-查询其他列表展示指标
export async function QueryOtherListDisplayColumn(payload) {
  const option = {
    url: queryOtherListDisplayColumn,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品销售一体化-查询人员权限
export async function QueryUserPermission(payload) {
  const option = {
    url: queryUserPermission,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品销售一体化-产品全景-单产品查询
export async function FetchQuerySingleProductDetail(payload) {
  const option = {
    url: querySingleProductDetail,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 字典项对应的统计值
export async function FetchProductCountAggs(payload) {
  const option = {
    url: productCountAggs,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 收入与奖励列表
export async function FetchQueryIncomeAndRewardList(payload) {
  const option = {
    url: queryIncomeAndRewardList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 收入与奖励列表--保有明细
export async function FetchQueryOwnershipDetail(payload) {
  const option = {
    url: queryOwnershipDetail,
    method: "post",
    data: payload,
  };
  return request(option);
}

export async function FetchQueryProductType(payload) {
  const option = {
    url: queryProductType,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 产品预约查询
export async function FetchQueryProductAppointment(payload) {
  const option = {
    url: queryProductAppointment,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 销量与创收-表格查询
export async function FetchSaleAndIncomeList(payload) {
  const option = {
    url: saleAndIncomeList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 查询统计周期
export async function QueryStatisticalCycle(payload) {
  const option = {
    url: queryStatisticalCycle,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 确认上传完成
export async function ConfirmUploadComplete(payload) {
  const option = {
    url: confirmUploadComplete,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 查询上传记录列表
export async function QueryUploadList(payload) {
  const option = {
    url: queryUploadList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 收入与奖励附件上传确认
export async function HandleInAndReAuditImport(payload) {
  // this.xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
  // this.xhr.open('post', url, true); // post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
  // this.xhr.send(formData); // 开始上传，发送form数据

  const { month, uuid, fileMd5, file } = payload;
  const option = {
    url: `${inAndReAuditImport}?month=${month}&uuid=${uuid}&fileMd5=${fileMd5}`,
    method: "post",
    data: file,
  };
  return request(option);
}

// 收入与奖励附件确认删除
export async function HandleInAndReAuditDelete(payload) {
  const { uuid, month } = payload;
  const option = {
    url: `${inAndReAuditDelete}?uuid=${uuid}&month=${month}`,
    method: "post",
  };
  return request(option);
}

// 工作-待办列表信息查询
export async function QueryBackLogList(payload) {
  const option = {
    url: queryBackLogList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 工作-日历内容查询
export async function QueryCalContent(payload) {
  const option = {
    url: queryCalContent,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 工作-服务客户列表查询
export async function QueryUserTaskCust(payload) {
  const option = {
    url: queryUserTaskCust,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 工作-查看已服务跟进日志
export async function QuertTaskServiceLog(payload) {
  const option = {
    url: quertTaskServiceLog,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 工作-任务详情忽略任务编辑保存
export async function SaveOverLookUserTaskCust(payload) {
  const option = {
    url: saveOverLookUserTaskCust,
    method: "post",
    data: payload,
  };
  return request(option);
}

// MOT事件详情客户列表
export async function QueryEventDetailCusList(payload) {
  const option = {
    url: queryEventDetailCusList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// MOT事件详情
export async function QueryEventDetail(payload) {
  const option = {
    url: queryEventDetail,
    method: "post",
    data: payload,
  };
  return request(option);
}

// MOT事件关联事件列表
export async function QueryRelationEventList(payload) {
  const option = {
    url: queryRelationEventList,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 工作设置列表
export async function QueryWorkSetting(payload) {
  const option = {
    url: queryWorkSetting,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 任务-我的任务列表信息查询
export async function QueryUserTaskListInformation(payload) {
  const option = {
    url: queryUserTaskListInformation,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 任务-我的任务列表信息详情查询
export async function QueryUserTaskListInformationDetails(payload) {
  const option = {
    url: queryUserTaskListInformationDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 工作设置保存操作
export async function SaveWorkSetting(payload) {
  const option = {
    url: saveWorkSetting,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 查询客户基本信息档案
export async function QueryCusInfo(payload) {
  const option = {
    url: queryCusInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 待办-记录查看流程详情保存
export async function SaveTakeNotesProcessInfo(payload) {
  const option = {
    url: saveTakeNotesProcessInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 查询客户30S认知
export async function QueryCusLabel(payload) {
  const option = {
    url: queryCusLabel,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 查询账户分析日历
export async function QueryAnaCalendar(payload) {
  const option = {
    url: queryAnaCalendar,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 查询各项能力得分详情
export async function QueryAnaDetail(payload) {
  const option = {
    url: queryAnaDetail,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 查询各项能力得分
export async function QueryAnaScore(payload) {
  const option = {
    url: queryAnaScore,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 操作诊断日历
export async function QueryOpeCalendar(payload) {
  const option = {
    url: queryOpeCalendar,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 操作诊断日历查询用户操作诊断报告
export async function QueryOpeSpecial(payload) {
  const option = {
    url: queryOpeSpecial,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 查询客户适当性数据
export async function QueryCusSuitInfo(payload) {
  const option = {
    url: queryCusSuitInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 忽略事件操作
export async function IgnoreEvent(payload) {
  const option = {
    url: ignoreEvent,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 我的任务列表任务删除
export async function SaveUserTaskStrikeOut(payload) {
  const option = {
    url: saveUserTaskStrikeOut,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 分时走势图
export async function QueryStockTrendChart(payload) {
  const option = {
    url: queryStockTrendChart,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 查询K线
export async function QueryStockKLine(payload) {
  const option = {
    url: queryStockKLine,
    method: "post",
    data: payload,
  };
  return request(option);
}

// 获取渠道信息
export async function GetChannelInfoModel(payload) {
  const option = {
    url: getChannelInfoModel,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 管理渠道，包括新增、修改、启用、禁用
export async function ChannelManagementModel(payload) {
  const option = {
    url: channelManagementModel,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取可选人员列表
export async function OptionalStaffList(payload) {
  const option = {
    url: optionalStaffList,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取操作日志
export async function GetOperateRecord(payload) {
  const option = {
    url: getOperateRecord,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取小组信息
export async function GetGroupInfoModel(payload) {
  const option = {
    url: getGroupInfoModel,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 管理渠道小组
export async function GroupManagement(payload) {
  const option = {
    url: groupManagement,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取业绩分析
export async function GetAchievementAnalysis(payload) {
  const option = {
    url: getAchievementAnalysis,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取渠道客户列表
export async function GetChannelCustList(payload) {
  const option = {
    url: getChannelCustList,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 渠道信息报表导出
export async function GetChannelInfoExport(payload) {
  const option = {
    url: getChannelInfoExport,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取我的二维码
export async function GetMyQRCode(payload) {
  const option = {
    url: getMyQRCode,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取我的二维码
export async function SaveOperateRecord(payload) {
  const option = {
    url: saveOperateRecord,
    method: "post",
    data: payload,
  };
  return request(option);
}
// 获取我的二维码带logo
export async function GetMyQrCodeWithLogo(payload) {
  const option = {
    url: getMyQrCodeWithLogo,
    method: "get",
    data: payload,
  };
  return request(option);
}
//获取管理员(模糊搜索)
export async function QueryStaffTips(payload) {
  const option = {
    url: queryStaffTips,
    method: "post",
    data: payload,
  };
  return request(option);
}
//佣金协议
export async function GetCommissionAgreementInfo(payload) {
  const option = {
    url: getCommissionAgreementInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//获取营业部有执业资格人员信息
export async function QueryStaffPracticeInfo(payload) {
  const option = {
    url: queryStaffPracticeInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//获取存管银行
export async function GetBankCodeList(payload) {
  const option = {
    url: getBankCodeList,
    method: "get",
    data: payload,
  };
  return request(option);
}
//获取渠道管理营业部信息
export async function QueryChannelAuthorityDepartment(payload) {
  const option = {
    url: queryChannelAuthorityDepartment,
    method: "post",
    data: payload,
  };
  return request(option);
}
//获取渠道角色信息
export async function QueryUserRoleInfo(payload) {
  const option = {
    url: queryUserRoleInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询每月业绩
export async function Getachievements(payload) {
  const option = {
    url: getachievements,
    method: "post",
    data: payload,
  };
  return request(option);
}
//渠道小组趋势数据分析
export async function GetChannelRecords(payload) {
  const option = {
    url: getChannelRecords,
    method: "post",
    data: payload,
  };
  return request(option);
}
//薪酬统计
export async function GetSalarys(payload) {
  const option = {
    url: getSalarys,
    method: "post",
    data: payload,
  };
  return request(option);
}
//全部数据分析
export async function GetAllAccountDate(payload) {
  const option = {
    url: getAllAccountDate,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询渠道开户中断客户信息
export async function GetChnnlAccnBreakCust(payload) {
  const option = {
    url: getChnnlAccnBreakCust,
    method: "post",
    data: payload,
  };
  return request(option);
}
//开户跟踪客户列表
export async function GetTracksCustInfoList(payload) {
  const option = {
    url: getTracksCustInfoList,
    method: "post",
    data: payload,
  };
  return request(option);
}
//小组绩效导出
export async function GetachievementsExport(payload) {
  const option = {
    url: getachievementsExport,
    method: "post",
    data: payload,
  };
  return request(option);
}
//全部开户数据导出
export async function GetAllAccountDateExport(payload) {
  const option = {
    url: getAllAccountDateExport,
    method: "post",
    data: payload,
  };
  return request(option);
}
//薪资统计导出
export async function GetSalarysExport(payload) {
  const option = {
    url: getSalarysExport,
    method: "post",
    data: payload,
  };
  return request(option);
}
//等级趋势导出
export async function GetChannelRecordsExport(payload) {
  const option = {
    url: getChannelRecordsExport,
    method: "post",
    data: payload,
  };
  return request(option);
}
//中断客户追踪操作
export async function SaveChnnlAccnBreakCust(payload) {
  const option = {
    url: saveChnnlAccnBreakCust,
    method: "post",
    data: payload,
  };
  return request(option);
}
//填写服务记录
export async function ChannelServiceRecord(payload) {
  const option = {
    url: channelServiceRecord,
    method: "post",
    data: payload,
  };
  return request(option);
}
//获取全部开户数据弹窗
export async function GetAllAccountDatePop(payload) {
  const option = {
    url: getAllAccountDatePop,
    method: "post",
    data: payload,
  };
  return request(option);
}
//获取全部开户数据弹窗导出
export async function GetAllAccountDatePopExport(payload) {
  const option = {
    url: getAllAccountDatePopExport,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询股票收盘价走势
export async function FindHqDeal4hisStock(payload) {
  const option = {
    url: findHqDeal4hisStock,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询等级与权益详细数据
export async function QueryLevelBenefit(payload) {
  const option = {
    url: queryLevelBenefit,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询对应等级客户列表
export async function QueryBenefitUserList(payload) {
  const option = {
    url: queryBenefitUserList,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询当前等级未解锁权益
export async function QueryLockBenefit(payload) {
  const option = {
    url: queryLockBenefit,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询客户等级与权益页面客户号和客户名称
export async function QueryCustMessage(payload) {
  const option = {
    url: queryCustMessage,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询对应等级的权益名称
export async function QueryBenefitName(payload) {
  const option = {
    url: queryBenefitName,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询用户权益列表
export async function QueryCustBenefit(payload) {
  const option = {
    url: queryCustBenefit,
    method: "post",
    data: payload,
  };
  return request(option);
}
//基金投顾销售业绩
export async function QueryPcxJjtgYjbb(payload) {
  const option = {
    url: queryPcxJjtgYjbb,
    method: "post",
    data: payload,
  };
  return request(option);
}
//基金投顾策略代码
export async function QueryZhdm(payload) {
  const option = {
    url: queryZhdm,
    method: "post",
    data: payload,
  };
  return request(option);
}
//员工首页基本信息
export async function QueryCustBasicInfo(payload) {
  const option = {
    url: queryCustBasicInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询新增客户变化
export async function QueryNewCustchanges(payload) {
  const option = {
    url: queryNewCustchanges,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户等级分布
export async function QueryCustGradeDis(payload) {
  const option = {
    url: queryCustGradeDis,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户业务分布
export async function QueryCustServiceDis(payload) {
  const option = {
    url: queryCustServiceDis,
    method: "post",
    data: payload,
  };
  return request(option);
}
//资产概况
export async function QueryCustAssetOverview(payload) {
  const option = {
    url: queryCustAssetOverview,
    method: "post",
    data: payload,
  };
  return request(option);
}
//资产占比
export async function QueryProportionOfAsset(payload) {
  const option = {
    url: queryProportionOfAsset,
    method: "post",
    data: payload,
  };
  return request(option);
}
//资产排名
export async function QueryZcRankInfo(payload) {
  const option = {
    url: queryZcRankInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//资产趋势
export async function QueryAssetTrendAnalysis(payload) {
  const option = {
    url: queryAssetTrendAnalysis,
    method: "post",
    data: payload,
  };
  return request(option);
}
//业绩创收
export async function QueryIncomeGeneInfo(payload) {
  const option = {
    url: queryIncomeGeneInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作模块
export async function QueryWorksInfo(payload) {
  const option = {
    url: queryWorksInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//业务机会字典
export async function QueryServiceChange(payload) {
  const option = {
    url: queryServiceChange,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-事件列表信息查询
export async function QueryServieBackLogList(payload) {
  const option = {
    url: queryServieBackLogList,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-事件表单问题查询
export async function WriterEventContext(payload) {
  const option = {
    url: writerEventContext,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-事件表单提交
export async function RecorderEventContext(payload) {
  const option = {
    url: recorderEventContext,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-获取短信链接
export async function EarnEventLink(payload) {
  const option = {
    url: earnEventLink,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-发送短信
export async function SendMessage(payload) {
  const option = {
    url: sendMessage,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-发送短信客户列表
export async function EarnMessageStaff(payload) {
  const option = {
    url: earnMessageStaff,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-填写服务记录
export async function QueryServiceRecorder(payload) {
  const option = {
    url: queryServiceRecorder,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作-分享信息同步c端
export async function InvstmentAdviserSaver(payload) {
  const option = {
    url: invstmentAdviserSaver,
    method: "post",
    data: payload,
  };
  return request(option);
}

//客户-查询无效户标签客户
export async function QueryInvalidCustomer(payload) {
  const option = {
    url: queryInvalidCustomer,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询天利宝相关客户
export async function QueryTianlibao(payload) {
  const option = {
    url: queryTianlibao,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询融资融券相关客户
export async function MarginFinance(payload) {
  const option = {
    url: marginFinance,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询股票期权相关客户
export async function StockOptions(payload) {
  const option = {
    url: stockOptions,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询港股通相关客户
export async function hongkongStock(payload) {
  const option = {
    url: HongkongStock,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询新三板相关客户
export async function QueryThreeBoard(payload) {
  const option = {
    url: queryThreeBoard,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询科创板相关客户
export async function QuerySTARMarket(payload) {
  const option = {
    url: querySTARMarket,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询创业板相关客户
export async function QueryGEMarket(payload) {
  const option = {
    url: queryGEMarket,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询北交所相关客户
export async function QueryBSE(payload) {
  const option = {
    url: queryBSE,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询基金投顾相关客户
export async function QueryFundInvestmentAdvisor(payload) {
  const option = {
    url: queryFundInvestmentAdvisor,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询标签列表
export async function QueryTag(payload) {
  const option = {
    url: queryTag,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询客户群列表
export async function QueryCustomerGroup(payload) {
  const option = {
    url: queryCustomerGroup,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询场景列表
export async function QueryScenes(payload) {
  const option = {
    url: queryScenes,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户-查询展业素材
export async function QueryMarketMaterial(payload) {
  const option = {
    url: queryMarketMaterial,
    method: "post",
    data: payload,
  };
  return request(option);
}
//员工主页新增
export async function QueryQualificationInfo(payload) {
  const option = {
    url: queryQualificationInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//事件完成情况
export async function GetEventFinishStatResponse(payload) {
  const option = {
    url: getEventFinishStatResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//工作统计
export async function GetWorkStatResponse(payload) {
  const option = {
    url: getWorkStatResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//员工维度事件列表查询
export async function GetEventListResponse(payload) {
  const option = {
    url: getEventListResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//按分支机构统计
export async function GetDepartmentStatDetailResponse(payload) {
  const option = {
    url: getDepartmentStatDetailResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//按工作类型统计
export async function GetWorkStatDetailResponse(payload) {
  const option = {
    url: getWorkStatDetailResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//按员工统计
export async function GetStaffStatDetailResponse(payload) {
  const option = {
    url: getStaffStatDetailResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//事件推送
export async function GetEventPushStatResponse(payload) {
  const option = {
    url: getEventPushStatResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//获取所有mot类型
export async function GetMotTypeResponse(payload) {
  const option = {
    url: getMotTypeResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询服务详情
export async function GetServiceDetailResponse(payload) {
  const option = {
    url: getServiceDetailResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询是否总部人员
export async function GetHeadOfficeResponse(payload) {
  const option = {
    url: getHeadOfficeResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询员工明细
export async function GetStaffDetailResponse(payload) {
  const option = {
    url: getStaffDetailResponse,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询策略配置明细
export async function QueryStrategyDetail(payload) {
  const option = {
    url: queryStrategyDetail,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询人员可选指标
export async function QueryIndex(payload) {
  const option = {
    url: queryIndex,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询辖属营业部排行列表
export async function QueryDepartIndexValue(payload) {
  const option = {
    url: queryDepartIndexValue,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询员工排行列表
export async function QueryStaffIndexValue(payload) {
  const option = {
    url: queryStaffIndexValue,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询员工列表
export async function QueryEmpInfo(payload) {
  const option = {
    url: queryEmpInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//主页绩效查询
export async function QueryStaffEfficiency2(payload) {
  const option = {
    url: queryStaffEfficiency,
    method: "post",
    data: payload,
  };
  return request(option);
}
//员工主页绩效查询
export async function QueryStaffEfficiency(payload) {
  const option = {
    url: queryAssIndicators,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询员工指标明细客户
export async function QueryIndexCustDetails(payload) {
  const option = {
    url: queryIndexCustDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询员工指标明细客户
export async function QueryScoreDetails(payload) {
  const option = {
    url: queryScoreDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}
//权限列表接口
export async function QueryRolePowerList(payload) {
  const option = {
    url: queryRolePowerList,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询考核得分计算公式
export async function QueryAssessmentScore(payload) {
  const option = {
    url: queryAssessmentScore,
    method: "post",
    data: payload,
  };
  return request(option);
}
/* -----客户指标部分----- */
//新增客户指标
export async function AddCustIndex(payload) {
  const option = {
    url: addCustIndex,
    method: "post",
    data: payload,
  };
  return request(option);
}
//编辑客户指标
export async function UpdateCustIndexDetails(payload) {
  const option = {
    url: updateCustIndexDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}
//删除客户指标
export async function DeleteCustCode(payload) {
  const option = {
    url: deleteCustCode,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户指标模糊查询
export async function QueryCustCodeObscure(payload) {
  const option = {
    url: queryCustCodeObscure,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询客户指标树
export async function QueryCustMetricsTree(payload) {
  const option = {
    url: queryCustMetricsTree,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询客户指标详情
export async function QueryCustIndiDetails(payload) {
  const option = {
    url: queryCustIndiDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}
//指标校验
export async function GetUpdateStatus(payload) {
  const option = {
    url: getUpdateStatus,
    method: "post",
    data: payload,
  };
  return request(option);
}
//指标上下架
export async function UpdateIndexUpAndDown(payload) {
  const option = {
    url: updateIndexUpAndDown,
    method: "post",
    data: payload,
  };
  return request(option);
}
export async function QueryCreditInfo(payload) {
  const option = {
    url: queryCreditInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}
//新c5创建任务newProduct/myTask
export async function AddTask(payload) {
  const option = {
    url: addTask,
    method: "post",
    data: payload,
  };
  return request(option);
}
//新c5创建任务业务明细查询newProduct/myTask
export async function QueryBusinessDetails(payload) {
  const option = {
    url: queryBusinessDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}

export async function AppRetrofitV1Upload(payload) {
  console.log(payload,'payload');
  const option = {
    url: appRetrofitV1Upload,
    method: "post",
    data: payload,
  };
  return request(option);
}
//新c5-创建任务-线索流素材和营销类型查询
export async function QueryCueTaskDetails(payload) {
  const option = {
    url: queryCueTaskDetails,
    method: "post",
    data: payload,
  };
  return request(option);
}
//查询展业素材列表
export async function QueryMarketMaterials(payload) {
  const option = {
    url: queryMarketMaterials,
    method: "post",
    data: payload,
  };
  return request(option);
}
//代办线索流任务表格查询
export async function QueryUserTaskCustNew(payload) {
  const option = {
    url: queryUserTaskCustNew,
    method: "post",
    data: payload,
  };
  return request(option);
}
//产品机会股票池
export async function GetAIGridStockPool(payload) {
  const option = {
    url: getAIGridStockPool,
    method: "post",
    data: payload,
  };
  return request(option);
}
//策略工具列表
export async function QueryToolInfo(payload) {
  const option = {
    url: queryStrategyToolInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}

//策略工具列表--客户持仓
export async function QueryPositionInfo(payload) {
  const option = {
    url: queryStrategyToolPositionInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}


//个人持仓查询
export async function QueryCustomerStockPool(payload) {
  const option = {
    url: queryCustomerStockPool,
    method: "post",
    data: payload,
  };
  return request(option);
}

//策略工具列表--客户持仓
export async function QueryStockInfo(payload) {
  const option = {
    url: queryStrategyToolStockInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}

//潜客处理
export async function SaveCompleteUserTaskCust(payload) {
  const option = {
    url: saveCompleteUserTaskCust,
    method: "post",
    data: payload,
  };
  return request(option);
}
//客户持仓查询
export async function CustProductDetail(payload) {
  const option = {
    url: custProductDetail,
    method: "post",
    data: payload,
  };
  return request(option);
}

//新增二维码名称--获取专属银行名称
export async function BankGroupInfo(payload) {
  const option = {
    url: getBankGroupInfo,
    method: "post",
    data: payload,
  };
  return request(option);
}

