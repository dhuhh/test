import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { incidentialServices: { fuzzyQryCusInfo, intrptCustLst, intrptCustBasicInfo, intrptCustRmkHis, intrptCustOpenAcInfo, intrptStepInfo, intrptCustOpenAcInfoHis, intrptCustRgstInfo, rgstCustLgnInfo, intrptCustActvInfo,
  intrptCustSrvcInfo, remarkIntrptCust, assignIntrptCust, depPerfermReport, staffPerfermReport, intrptCustAnalysis, staffMessageQuotal,
  axFullinServerRecord, axMessageSend, searchProviceCity, qryExecutionStrategy, saveCusPhone, qrySavedPhone, queryOpenAccountMsg, depPerfermReportBegin,
  virtualMakeCall, callResultCallbackLocal ,intrptCustV2BasicInfo ,intrptCustV2Detail,intrptCustV2DetailHis ,getPaperCC,savePaper,queryCallList,queryPaperList ,getMsg ,virtualMakeCallHSCC ,intrptCustEr ,queryStrategyCombine,queryFundReferee }, 
commonbase: { optionalUserList, excStaffList ,excStaffListCus } } = api;

// 客户信息模糊查询
export async function FetchFuzzyQryCusInfo(payload) {
  const option = {
    url: fuzzyQryCusInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 综合通用  获取可选人员列表
export async function FetchOptionalUserList(payload) {
  const option = {
    url: optionalUserList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取可选人员列表 伴随式服务执行人员需求修改专用
export async function FetchExcStaffList(payload) {
  const option = {
    url: excStaffList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取可选人员列表 客户标签需求修改专用
export async function FetchExcStaffListCus(payload) {
  const option = {
    url: excStaffListCus,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户列表
export async function FetchIntrptCustLst(payload) {
  const option = {
    url: intrptCustLst,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户基础信息
export async function FetchIntrptCustBasicInfo(payload) {
  const option = {
    url: intrptCustBasicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户历史备注
export async function FetchIntrptCustRmkHis(payload) {
  const option = {
    url: intrptCustRmkHis,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户开户信息
export async function FetchIntrptCustOpenAcInfo(payload) {
  const option = {
    url: intrptCustOpenAcInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断步骤信息
export async function FetchIntrptStepInfo(payload) {
  const option = {
    url: intrptStepInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户历史开户信息，通过手机号关联
export async function FetchIntrptCustOpenAcInfoHis(payload) {
  const option = {
    url: intrptCustOpenAcInfoHis,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户注册信息
export async function FetchIntrptCustRgstInfo(payload) {
  const option = {
    url: intrptCustRgstInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询注册客户登录信息
export async function FetchRgstCustLgnInfo(payload) {
  const option = {
    url: rgstCustLgnInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户参与的活动信息
export async function FetchIntrptCustActvInfo(payload) {
  const option = {
    url: intrptCustActvInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中断客户被服务的信息
export async function FetchIntrptCustSrvcInfo(payload) {
  const option = {
    url: intrptCustSrvcInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 备注中断客户
export async function OperateRemarkIntrptCust(payload) {
  const option = {
    url: remarkIntrptCust,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 分配/转办/撤回 中断客户
export async function OperateAssignIntrptCust(payload) {
  const option = {
    url: assignIntrptCust,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 绩效分析-部门业绩报表查询
export async function FetchDepPerfermReport(payload) {
  const option = {
    url: depPerfermReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 绩效分析-人员业绩报表查询
export async function FetchStaffPerfermReport(payload) {
  const option = {
    url: staffPerfermReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 绩效分析-中断客户分析
export async function FetchIntrptCustAnalysis(payload) {
  const option = {
    url: intrptCustAnalysis,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 填写服务记录
export async function OperateAxFullinServerRecord(payload) {
  const option = {
    url: axFullinServerRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 发送短信
export async function OperateAxMessageSend(payload) {
  const option = {
    url: axMessageSend,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询城市
export async function FetchSearchProviceCity(payload) {
  const option = {
    url: searchProviceCity,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心 获取员工短信配额度
export async function FetchStaffMessageQuotal(payload) {
  const option = {
    url: staffMessageQuotal,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询执行策略
export async function FetchQryExecutionStrategy(payload) {
  const option = {
    url: qryExecutionStrategy,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 保存电话号码
export async function SaveCusPhone(payload) {
  const option = {
    url: saveCusPhone,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询历史记录
export async function QrySavedPhone(payload) {
  const option = {
    url: qrySavedPhone,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 下发
export async function QueryOpenAccountMsg(payload) {
  const option = {
    url: queryOpenAccountMsg,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 绩效分析-部门业绩报表查询-点击执行客户数
export async function DepPerfermReportBegin(payload) {
  const option = {
    url: depPerfermReportBegin,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 发起虚拟外呼
export async function VirtualMakeCall(payload) {
  const option = {
    url: virtualMakeCall,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 外呼记录
export async function CallResultCallbackLocal(payload) {
  const option = {
    url: callResultCallbackLocal,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 中断客户基本信息
export async function IntrptCustV2BasicInfo(payload) {
  const option = {
    url: intrptCustV2BasicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 中断客户本次中断详情
export async function IntrptCustV2Detail(payload) {
  const option = {
    url: intrptCustV2Detail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 中断客户历史中断详情
export async function IntrptCustV2DetailHis(payload) {
  const option = {
    url: intrptCustV2DetailHis,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取问卷
export async function GetPaperCC(payload) {
  const option = {
    url: getPaperCC,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 保存问卷
export async function SavePaper(payload) {
  const option = {
    url: savePaper,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 呼叫记录
export async function QueryCallList(payload) {
  const option = {
    url: queryCallList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 服务记录
export async function QueryPaperList(payload) {
  const option = {
    url: queryPaperList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取短信模板
export async function GetMsg(payload) {
  const option = {
    url: getMsg,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取虚拟外呼
export async function VirtualMakeCallHSCC(payload) {
  const option = {
    url: virtualMakeCallHSCC,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取中断原因
export async function IntrptCustEr(payload) {
  const option = {
    url: intrptCustEr,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 基金投顾推荐人
export async function QueryFundReferee(payload) {
  const option = {
    url: queryFundReferee,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 策略组合类型
export async function QueryStrategyCombine(payload) {
  const option = {
    url: queryStrategyCombine,
    method: 'post',
    data: payload,
  };
  return request(option);
}
