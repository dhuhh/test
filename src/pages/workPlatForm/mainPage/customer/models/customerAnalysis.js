import { getCusLabelClassification } from '../../../../../services/customerbase/cusLabelClassification';

export default {

  namespace: 'customerAnalysis',

  state: {
    loading: true,
    bqData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/customerAnalysis' || pathname.indexOf('/customerAnalysis/') === 0 || pathname === '/dgt/rule/analysis' || pathname.indexOf('/dgt/customerGroup360/analysis') === 0) {
          dispatch({ type: 'fetchCusLabelClassification', payload: {} }); // 获取操作客户标签
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *fetchCusLabelClassification(_, { call, put, select }) { // 获取操作客户标签
      const loading = yield select(state => state.customerAnalysis.loading);
      if (loading) {
        const response = yield call(getCusLabelClassification, { fxlx: '', bqlx: '' });
        const { records = [] } = response || {};
        if (records && records.length > 0) {
          const bqData = {};
          // 将标签信息按照分析类型分组
          records.forEach((item) => {
            if (!bqData[item.fxlx]) {
              bqData[item.fxlx] = {};
            }
            if (!bqData[item.fxlx][item.bqlx]) {
              bqData[item.fxlx][item.bqlx] = {
                fxlx: item.fxlx,
                fxlxmc: item.fxlxmc,
                bqlx: item.bqlx,
                bqmc: item.bqmc,
                bqzData: [],
                bqzmcData: [],
              };
            }
            bqData[item.fxlx][item.bqlx].bqzData.push(item.bqz);
            bqData[item.fxlx][item.bqlx].bqzmcData.push(item.bqzmc);
          });
          yield put({ type: 'saveCusLabelClassification', payload: bqData });
        }
        yield put({ type: 'changeLoading', payload: false });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    saveCusLabelClassification(state, { payload }) {
      return {
        ...state,
        bqData: payload,
      };
    },
  },

};

