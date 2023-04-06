export default {

  namespace: 'test3',

  state: {
    text: '333',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // history.listen(({ pathname }) => {
      // });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *changeTextAction({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeText', payload });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeText(state, { payload }) {
      const { text } = payload;
      return { ...state, text };
    },
  },

};
