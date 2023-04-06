import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { organManagement: { queryProductInfoFuzzy, queryProductProcessStep, queryProductNode, queryProductFlowOfNode, track,
  queryProductProgressTracking } } = api;


// 产品信息模糊查询（仅指有审批记录的产品）
export async function FetchQueryProductInfoFuzzy(payload) {
  const option = {
    url: queryProductInfoFuzzy,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品流程步骤查询
export async function FetchQueryProductProcessStep(payload) {
  const option = {
    url: queryProductProcessStep,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品进度跟踪查询
export async function FetchQueryProductProgressTracking(payload) {
  const option = {
    url: queryProductProgressTracking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品信息精准查询（仅指有审批记录的产品）
export async function FetchQueryProductNode(payload) {
  const option = {
    url: queryProductNode,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品流程节点查询（仅指有审批记录的产品）
export async function FetchQueryProductFlowOfNode(payload) {
  const option = {
    url: queryProductFlowOfNode,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 模糊查询产品代码或名称
export async function FetchQueryProductCodeOrName(payload) {
  const option = {
    url: track,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 流程导航
export async function FetchBusinessWizard(payload) {
  const data = {
    records: [
      { id: 1, name: '管理人准入', url1: '/UIProcessor?Table=nvPIF_GMYWXD', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
      { id: 2, name: '首次材料收集', url1: '/UIProcessor?Table=NAV_SMYWDH', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
      { id: 3, name: '小组讨论', url1: '/UIProcessor?Table=TPIF_GMJJWH', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
      { id: 4, name: '尽职调查', url1: '/UIProcessor?Table=vPIF_JRCPK', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
      { id: 5, name: '工作组会议', url1: '/UIProcessor?Table=vPIF_JRCPK', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
      { id: 6, name: '风控合格审查流程', url1: '/UIProcessor?Table=vPIF_JRCPK', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
      { id: 7, name: '金融配置委员会', url1: '/UIProcessor?Table=vPIF_JRCPK', steps: '4', url: '/UIProcessor?Table=vPIF_JRCPK', url2: '' },
    ],
    code: 1,
    total: 7,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
  // const option = {
  //   url: oppist,
  //   method: 'post',
  //   data: payload,
  // };
  // return request(option);
}
