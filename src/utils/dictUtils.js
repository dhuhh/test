// 字典别名的map(别名: 对应字典名称)
const dictionaryMap = {
  isAlready: 'D_IS', // 是否
  executionStatus: 'PIF_ZXZT', // 执行状态
  important: 'D_IMPORTANT_LEVEL', // 重要程度
  type: 'D_RANKING_TYPE', // 类型
  granularity: 'D_TIME_GRANULARITY', // 粒度
  announcementType: 'PIF_GGLX', // 公告类型
  productType: 'PIF_CPXL_CPZX', // 产品分类
  cooperationAccess: 'PIF_GLRHZZR', // 合作准入
  cooperationLevel: 'PIF_GLRHZDJ', // 合作等级
  productTerm: 'SCC_CPQX', //  产品期限
  riskLevel: 'SCC_FXDJ', // 风险等级
  fundCategory: 'PIF_JJLB_CPZX', // 基金类别
  issue: 'SCC_FXFS', // 发行方式
  investment: 'SCC_TZLX', // 投资类型
  taskType: 'PIF_RWLX', // 任务类型
  taskStauts: 'PIF_RWZT', // 任务状态
  productSegmentation: 'PIF_RWCPXF', // 产品细分
  productCls: 'PIF_CPXL_CPZX', // 产品分类
};


// livebos对象别名的map(别名: 对应对象名称)
const objectMap = {
  regProvince: 'TJG_DQDM', // 注册省份
  industry: 'TJG_HYFL', // 行业
};


export function getDictKey(name) {
  return dictionaryMap[name] || name;
}

export function getObjKey(name) {
  return objectMap[name] || name;
}
