import { FetchMyCommonSearch } from '../../../../../../services/customerbase/customerListHandle';

export default {

  namespace: 'myTags',
  state: {
    faList: [], // 方案列表
  },
  effects: {
    // 查询客户列表方案列表
    *fetchMyCommonSearch({ payload }, { call, put }) {
      const response = yield call(FetchMyCommonSearch, { ...payload });
      const { code = 0, records = [] } = response || {};
      if (code > 0) {
        yield put({
          type: 'save',
          payload: {
            faList: records,
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};

