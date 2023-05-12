import { FetchProductDisplayColumn } from '../../../../../services/newProduct';

export default {
  namespace: 'newFinancialProducts',

  state: {
    allProductDisplayColumns: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => { // eslint-disable-line
        if (pathname === '/merge/market/financialProduct') {
          dispatch({ type: 'fetchProductDisplayColumn' });
        }
      });
    },
  },

  effects: {
    // 产品列表所有展示列
    *fetchProductDisplayColumn(_, { call, put }) {
      const data = yield call(FetchProductDisplayColumn);
      const { code = 0, records = [] } = data || {};
      if (code > 0) {
        yield put({ type: 'save', payload: { allProductDisplayColumns: records } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};

