import { qiankunStart } from 'umi';
import { fetchWebserviceFrontEndConfig } from '../services/commonbase';

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export default {
  namespace: 'base',

  state: {
    name: 'Qiankun',
    apps: [],
  },

  effects: {
    // *getApps(_, { call, put }) {
    //   /*
    //    子应用配置信息获取分同步、异步两种方式
    //    同步有两种配置方式，1、app.js导出qiankun对象，2、配置写在umi配置文件中，可通过import @tmp/subAppsConfig获取
    //   */
    //   const data = yield call(fetchWebserviceFrontEndConfig); // 子服务信息通过微服务动态获取
    //   const { code, records = [] } = data;
    //   if(code > 1) {
    //     yield put({
    //       type: 'getAppsSuccess',
    //       payload: {
    //         apps: records,
    //       }
    //     });
    //   }
    //   // qiankunStart;
    //   // 模拟手动控制 qiankun 启动时机的场景, 需要 defer 配置为 true
    //   qiankunStart();
    // },
  },

  reducers: {
    getAppsSuccess(state, { payload }) {
      state.apps = payload.apps;
    },
  },
};
