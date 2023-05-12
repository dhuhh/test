export default {

  namespace: 'mainPage',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {   // eslint-disable-line
      history.listen(({ pathname }) => { // eslint-disable-line
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveMessageDrop(state, { payload }) {
      const { messageDrop } = state;
      return {
        ...state,
        messageDrop: {
          ...messageDrop,
          ...payload,
        },
      };
    },
  },

};

