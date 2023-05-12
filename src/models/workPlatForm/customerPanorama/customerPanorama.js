
export default {

  namespace: 'customerPanorama',

  state: {
    customerCode: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { query = {} } = location;
        const { customerCode = '' } = query;
        dispatch({ type: 'reload', payload: { customerCode } });
      });
    },
  },

  effects: {
    *reload({ payload }, { call, put, select }) {
      const { customerCode: newCustomerCode = '' } = payload;
      const customerCode = yield select(state => state.customerPanorama.customerCode);
      if (customerCode && newCustomerCode && customerCode !== newCustomerCode) {
        yield put({ type: 'save', payload: { customerCode: newCustomerCode } });
        window.location.reload();
      } else {
        yield put({ type: 'save', payload: { customerCode: newCustomerCode } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
