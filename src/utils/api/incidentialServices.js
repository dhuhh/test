export default [
  { code: '', key: 'fuzzyQryCusInfo', url: '/customerpotential/v1/fuzzyQryCusInfo', dis: '客户信息模糊查询' },
  { code: '', key: 'intrptCustLst', url: '/customerpotential/v1/intrptCustLst', dis: '中断客户列表' },
  { code: '', key: 'intrptCustLstExport', url: '/customerpotential/v1/intrptCustLstExport', dis: '中断客户列表导出' },
    
  { code: '', key: 'intrptCustBasicInfo', url: '/customerpotential/v1/intrptCustBasicInfo', dis: '中断客户基础信息' },
  { code: '', key: 'intrptCustRmkHis', url: '/customerpotential/v1/intrptCustRmkHis', dis: '中断客户历史备注' },
  { code: '', key: 'intrptCustOpenAcInfo', url: '/customerpotential/v1/intrptCustOpenAcInfo', dis: '中断客户开户信息' },
  { code: '', key: 'intrptStepInfo', url: '/customerpotential/v1/intrptStepInfo', dis: '中断步骤信息' },
  { code: '', key: 'intrptCustOpenAcInfoHis', url: '/customerpotential/v1/intrptCustOpenAcInfoHis', dis: '中断客户历史开户信息' },
  { code: '', key: 'intrptCustRgstInfo', url: '/customerpotential/v1/intrptCustRgstInfo', dis: '中断客户注册信息' },
  { code: '', key: 'rgstCustLgnInfo', url: '/customerpotential/v1/rgstCustLgnInfo', dis: '注册客户登录信息' },
  { code: '', key: 'intrptCustActvInfo', url: '/customerpotential/v1/intrptCustActvInfo', dis: '中断客户活动信息' },
  { code: '', key: 'intrptCustSrvcInfo', url: '/customerpotential/v1/intrptCustSrvcInfo', dis: '中断客户服务信息' },
  { code: '', key: 'remarkIntrptCust', url: '/customerpotential/v1/remarkIntrptCust', dis: '备注中断客户' },

  { code: '', key: 'assignIntrptCust', url: '/customerpotential/v1/assignIntrptCust', dis: '分配/转办/撤回 中断客户' },

  { code: '', key: 'depPerfermReport', url: '/customerpotential/v1/depPerfermReport', dis: '绩效分析-部门业绩报表查询' },
  { code: '', key: 'depPerfermReportExport', url: '/customerpotential/v1/depPerfermReportExport', dis: '绩效分析-部门业绩报表导出' },
  { code: '', key: 'staffPerfermReport', url: '/customerpotential/v1/staffPerfermReport', dis: '绩效分析-人员业绩报表查询' },
  { code: '', key: 'staffPerfermReportExport', url: '/customerpotential/v1/staffPerfermReportExport', dis: '绩效分析-人员业绩报表导出' },
  { code: '', key: 'intrptCustAnalysis', url: '/customerpotential/v1/intrptCustAnalysis', dis: '绩效分析-中断客户分析' },
  { code: '', key: 'intrptCustAnalysisExport', url: '/customerpotential/v1/intrptCustAnalysisExport', dis: '绩效分析-中断客户分析导出' },


  { code: '', key: 'axFullinServerRecord', url: '/axaccompany/v1/axFullinServerRecord', dis: '填写服务记录' },
  { code: '', key: 'axMessageSend', url: '/axaccompany/v1/axMessageSend', dis: '发送短信' },
  { code: '', key: 'staffMessageQuotal', url: '/customerpotential/v1/staffMessageQuotal', dis: '获取员工短信配额度' },
  { code: '', key: 'getRecordVio', url: '/axaccompany/v1/getRecordVio', dis: '获取呼叫中心音频' },

  { code: '', key: 'searchProviceCity', url: '/axaccompany/v1/searchProviceCity', dis: '查询省份城市' },

  { code: '', key: 'qryExecutionStrategy', url: '/customerpotential/v1/qryExecutionStrategy', dis: '查询执行策略' },

  // 外呼
  { code: '', key: 'saveCusPhone', url: '/customerpotential/v1/saveCusPhone', dis: '保存电话号码' },
  { code: '', key: 'qrySavedPhone', url: '/customerpotential/v1/qrySavedPhone', dis: '查询历史记录' },

  { code: '', key: 'queryOpenAccountMsg', url: '/customerpotential/v1/queryOpenAccountMsg', dis: '下发' },

  { code: '', key: 'depPerfermReportBegin', url: '/customerpotential/v1/depPerfermReportBegin', dis: '绩效分析-部门业绩报表查询-点击执行客户数' },
  { code: '', key: 'depPerfermReportBeginExport', url: '/customerpotential/v1/depPerfermReportBeginExport', dis: '绩效分析-部门业绩报表查询-点击执行客户数-导出' },

  // 新外呼
  { code: '', key: 'virtualMakeCall', url: '/diagnose/v1/virtualMakeCall', dis: '发起虚拟外呼' },
  { code: '', key: 'callResultCallbackLocal', url: '/CallCenter/v1/callResultCallbackLocal', dis: '外呼记录' },

  //伴随式二期
  { code: '', key: 'intrptCustV2BasicInfo', url: '/customerpotential/v1/intrptCustV2BasicInfo', dis: '中断客户基本信息' },
  { code: '', key: 'intrptCustV2Detail', url: '/customerpotential/v1/intrptCustV2Detail', dis: '中断客户本次中断详情' },
  { code: '', key: 'intrptCustV2DetailHis', url: '/customerpotential/v1/intrptCustV2DetailHis', dis: '中断客户历史中断详情' },
  { code: '', key: 'getPaperCC', url: '/diagnose/v1/getPaperHSCC', dis: '获取问卷' },
  { code: '', key: 'savePaper', url: '/customerpotential/v1/savePaper', dis: '保存问卷' },
  { code: '', key: 'queryCallList', url: '/customerpotential/v1/getCall', dis: '呼叫记录' },
  { code: '', key: 'queryPaperList', url: '/customerpotential/v1/getService', dis: '服务记录' },
  { code: '', key: 'getMsg', url: '/customerpotential/v1/getMsg', dis: '获取短信模板' },
  { code: '', key: 'virtualMakeCallHSCC', url: '/diagnose/v1/virtualMakeCallHSCC', dis: '虚拟外呼' },
  { code: '', key: 'intrptCustEr', url: '/customerpotential/v1/intrptCustEr', dis: '中断原因接口' },
  { code: '', key: 'queryFundReferee', url: '/customerpotential/v1/queryFundReferee', dis: '基金投顾推荐人' },
  { code: '', key: 'queryStrategyCombine', url: '/customerpotential/v1/queryStrategyCombine', dis: '策略组合类型' },
];
  