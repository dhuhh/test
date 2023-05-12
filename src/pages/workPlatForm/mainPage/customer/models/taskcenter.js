// import { FetchTaskConfigurableSuperviseGrade } from '../../../../../services/taskcenter';
import { fetchObject } from '../../../../../services/sysCommon';

export default {

  namespace: 'taskcenter',

  state: {
    taskConfigurableSuperviseGrade: [], // 任务创建可督办层级
    commonSelecType: [], // 查询对象表
  },

  subscriptions: {
    setup({ dispatch, history }) { // eslint-disable-line
      history.listen(({ pathname }) => { // eslint-disable-line
        if (pathname.indexOf('/taskCenter') !== -1 || pathname.indexOf('/taskcenter') !== -1 || pathname.indexOf('/myCustomer/cusGroupManage') !== -1) {
          dispatch({ type: 'fetchTaskType', payload: {} });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    // // 查询可督办层级
    // *fetchTaskConfigurableSuperviseGrade({ payload }, { call, put }) {
    //   const data = yield call(FetchTaskConfigurableSuperviseGrade, { ...payload });
    //   const { code = 0, records = [] } = data || {};
    //   if (code > 0 && Array.isArray(records)) {
    //     // const { orgtpid = '' } = records[0] || {};
    //     // const finalResult = orgtpid.split(';');
    //     // yield put({ type: 'save', payload: { taskConfigurableSuperviseGrade: finalResult || [] } });
    //     const finalResult = [];
    //     records.forEach((items) => {
    //       finalResult.push(items.orgtpid);
    //     });
    //     yield put({ type: 'save', payload: { taskConfigurableSuperviseGrade: finalResult || [] } });
    //   }
    // },
    *fetchTaskType(_, { select, call, put, all }) {
      const states = yield select(state => state.taskcenter);
      const { commonSelecType = [] } = states;
      if (commonSelecType.length === 0) {
        const datas = yield all([
          // 任务类型
          call(fetchObject, 'TTC_TP'),
          // 任务分类
          call(fetchObject, 'TTC_CL'),
          // 查询督办人
          call(fetchObject, 'lbRole'),
        ]);
        // 解析数据,将records存起来
        const objectsMap = {};
        datas.forEach((item) => {
          const { name = 'yyb', records = [] } = item || {};
          objectsMap[name] = records;
        });
        yield put({ type: 'save', payload: { commonSelecType: objectsMap } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
