/*
 * @Author: your name
 * @Date: 2021-07-16 11:15:47
 * @LastEditTime: 2021-07-16 11:37:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \product-react-web\src\services\home\home.js
 */
import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { home: { prodHomepageCalendar, calendarDetails, prodSummary, prodSummaryDetail, msgProfile,
  msgCenterQry, prodNotice, msgUpdate, configureBlocksUpdate, displayBlocks, configureBlocks, prodIncomeTrendStat,
  prodSalesDistributeStat, prodSalesTrendStat, prodNoticePage,
} } = api;

// 产品首页日历查询
export async function FetchProdHomepageCalendar(payload) {
  const option = {
    url: `/product${prodHomepageCalendar}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 日历明细查询
export async function FetchCalendarDetails(payload) {
  const option = {
    url: `/product${calendarDetails}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 消息中心查询
export async function FetchMyStatistics(payload) {
  const option = {
    url: `/product${msgProfile}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 消息中心维护
export async function FetchMsgUpdate(payload) {
  const option = {
    url: msgUpdate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 我的待办
export async function FetchUpcomingList(payload) {
  const option = {
    url: `/product${msgCenterQry}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 运营日历数据
export async function fetchCalendarData(payload) {
  const option = {
    url: `/product${prodHomepageCalendar}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 我的应用
export async function FetchMyApplication(payload) {
  const data = {
    records: [
      { id: 1, bt: '重点代销产', icon: 'icon-atlas', state: false },
      { id: 2, bt: '合作机构库查询', icon: 'icon-Sales', state: true },
      { id: 3, bt: '管理人准入流程', icon: 'icon-group-n', state: true },
      { id: 4, bt: '产品视图', icon: 'icon-stock', state: true },
      { id: 5, bt: '金融产品库', icon: 'icon-InflowAssets', state: true },
      { id: 6, bt: '我的运营任务', icon: 'icon-deal', state: true },
      { id: 7, bt: '产品最新净值查询', icon: 'icon-fuwuchanpin', state: true },
      { id: 8, bt: '公募基金资讯信息', icon: 'icon-file-exception', state: true },
      // { id: 9, bt: '文档库', icon: 'icon-kyc' },
      // { id: 10, bt: '负面清单信息查询', icon: 'icon-profile' },
      // { id: 11, bt: '公募基金评级', icon: 'icon-modify1' },
      // { id: 12, bt: '产品收入汇总统计', icon: 'icon-assetsLine1' },
      // { id: 13, bt: '产品销量汇总统计', icon: 'icon-survey' },
    ],
    code: 1,
    total: 8,
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
// 我的应用
export async function FetchMyApplicationChoice(payload) {
  const data = {
    records: [
      { id: 1, bt: '重点代销产', icon: 'icon-atlas', state: false },
      { id: 2, bt: '合作机构库查询', icon: 'icon-Sales', state: true },
      { id: 3, bt: '管理人准入流程', icon: 'icon-group-n', state: true },
      { id: 4, bt: '产品视图', icon: 'icon-stock', state: true },
      { id: 5, bt: '金融产品库', icon: 'icon-InflowAssets', state: true },
      { id: 6, bt: '我的运营任务', icon: 'icon-deal', state: true },
      { id: 7, bt: '产品最新净值查询', icon: 'icon-fuwuchanpin', state: false },
      { id: 8, bt: '公募基金资讯信息', icon: 'icon-file-exception', state: true },
      { id: 9, bt: '文档库', icon: 'icon-kyc', state: true },
      { id: 10, bt: '负面清单信息查询', icon: 'icon-profile', state: true },
      { id: 11, bt: '公募基金评级', icon: 'icon-modify1', state: true },
      { id: 12, bt: '产品收入汇总统计', icon: 'icon-assetsLine1', state: true },
      { id: 13, bt: '产品销量汇总统计', icon: 'icon-survey', state: true },
    ],
    code: 1,
    total: 8,
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

// 产品概况
export async function FetchProdSummary(payload) {
  const option = {
    url: prodSummary,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品概况明细
export async function FetchProdSummaryDetail(payload) {
  const option = {
    url: prodSummaryDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品公告
export async function FetchProdNotice(payload) {
  const option = {
    url: prodNotice,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 首页可配置的模块
export async function FetchConfigureBlocks(payload) {
  const data = {
    records: [
      { id: 1,
        icon: 'icon-xiaoxizhongxin',
        name: '消息概况',
        isShow: '1',
        grild: '[{"id":1,"w":12,"h":1,"x":0,"y":0,"isDraggable":true,"isResizable":true,"i":"1" }]',
      },
      { id: 2,
        icon: 'icon-deal',
        name: '我的待办',
        isShow: '1',
        grild: '[{"id":1,"w":6,"h":1,"x":0,"y":1,"isDraggable":true,"isResizable":true,"i":"2" }]',
      },
      { id: 3,
        icon: 'icon-calendarLine',
        name: '产品日历',
        isShow: '1',
        grild: '[{"id":1,"w":6,"h":1,"x":6,"y":1,"isDraggable":true,"isResizable":true,"i":"3" }]',
      },
      { id: 4,
        icon: 'icon-stock',
        name: '产品概况',
        isShow: '1',
        grild: '[{"id":1,"w":6,"h":1,"x":0,"y":2,"isDraggable":true,"isResizable":true,"i":"4" }]',
      },
      { id: 5,
        icon: 'icon-profile',
        name: '产品公告',
        grild: '[{"id":1,"w":6,"h":1,"x":6,"y":2,"isDraggable":true,"isResizable":true,"i":"5" }]',
        isShow: '1',
      },
    ],
    code: 1,
    total: 10,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

// 首页展示模块查询
export async function FetchDisplayBlocks(payload) {
  const option = {
    url: `/product${displayBlocks}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 首页可配置模块更新
export async function FetchConfigureBlocksUpdate(payload) {
  const option = {
    url: configureBlocksUpdate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页可配置模块更新
export async function FetchConfigureBlockS(payload) {
  // const data = {
  //   records: [
  //     {
  //       displayParam: '{"w":4,"h":1,"x":0,"y":0,"i":"1","moved":false,"static":false}',
  //       icon: 'icon-xiaoxizhongxin',
  //       id: '1',
  //       isShow: '1',
  //       name: '消息概况' },
  //     {
  //       displayParam: '{"w":2,"h":1,"x":0,"y":1,"i":"2","moved":false,"static":false}',
  //       icon: 'icon-deal',
  //       id: '2',
  //       isShow: '1',
  //       name: '我的待办' },
  //     {
  //       displayParam: '{"w":2,"h":1,"x":2,"y":2,"i":"3","moved":false,"static":false}',
  //       icon: 'icon-calendarLine',
  //       id: '3',
  //       isShow: '1',
  //       name: '产品日历' },
  //     {
  //       displayParam: '{"w":2,"h":1,"x":0,"y":3,"i":"4","moved":false,"static":false}',
  //       icon: 'icon-stock',
  //       id: '4',
  //       isShow: '1',
  //       name: '产品概况' },
  //     {
  //       displayParam: '{"w":2,"h":1,"x":2,"y":3,"i":"5","moved":false,"static":false}',
  //       icon: 'icon-xiaoxizhongxin',
  //       id: '5',
  //       isShow: '1',
  //       name: '产品公告' },
  //     {
  //       displayParam: '{"w":4,"h":1,"x":0,"y":4,"i":"6","moved":false,"static":false}',
  //       icon: 'icon-icon-chart',
  //       id: '6',
  //       isShow: '1',
  //       name: '销售概览' },
  //     {
  //       displayParam: '{"w":2,"h":1,"x":0,"y":5,"i":"7","moved":false,"static":false}',
  //       icon: 'icon-fuwuchanpin',
  //       id: '7',
  //       isShow: '1',
  //       name: '热销产品TOP10' },
  //     {
  //       displayParam: '{"w":2,"h":1,"x":2,"y":5,"i":"8","moved":false,"static":false}',
  //       icon: 'icon-jinrongchanpin',
  //       id: '8',
  //       isShow: '1',
  //       name: '收入贡献TOP10' },
  //   ],
  //   code: 1,
  //   total: 14,
  // };
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(data);
  //   }, 1000);
  // });
  const option = {
    url: `/product${configureBlocks}`,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品收入趋势分析
export async function FetchProdIncomeTrendStat(payload) {
  const option = {
    url: prodIncomeTrendStat,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品销量趋势分析
export async function FetchProdSalesTrendStat(payload) {
  const option = {
    url: prodSalesTrendStat,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品销量分布统计
export async function FetchProdSalesDistributeStat(payload) {
  const option = {
    url: prodSalesDistributeStat,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 产品公告首页（查询所有）
export async function FetchProdNoticePage(payload) {
  const option = {
    url: prodNoticePage,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 流程导航
export async function FetchProcessNavigation(payload) {
  const data = {
    records: [

    ],
    code: 1,
    total: 14,
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

// 流程导航
export async function FetchBusinessWizard(payload) {
  const data = {
    records: [

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

