/* eslint-disable no-debugger */
import { routerRedux } from 'dva/router';
import { AccountLogin, AccountUser } from '../services/login';
import { FetchPwd } from '../services/amslb/user';
import { AES } from '../utils/aes_utils';
import { APP_SECRET, CLIENTID, prefix } from '../utils/config';

export default {
  namespace: 'login',

  state: {
    loginCode: '',
    loginNote: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },

  effects: {
    // 登录操作
    *login({ payload }, { call, put }) {
      const { userName, password, verifyCode } = payload;
      const params = {
        mode: 'user',
        clientId: CLIENTID,
        signature: '',
        ext: {
          verifyCode,
        },
      };
      // aas-aes加密
      const JsonObj = {
        mode: params.mode,
        user: userName,
        password,
        timestamp: new Date().getTime(),
      };
      AES.setSecret(APP_SECRET);
      // params.signature = AES.encryptBase64(`mode=${params.mode}&user=${userName}&password=${password}&timestamp=${new Date().getTime()}`);
      const JsonString = JSON.stringify(JsonObj);
      params.signature = AES.encryptBase64(JsonString);
      params.ext = JSON.stringify(params.ext);
      try {
        const response = yield call(AccountLogin, params);
        const { code = 0, note = '', user = {} } = response || {};
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginCode: code,
            loginNote: note,
            user,
          },
        });
        yield put({ type: 'global/resetAll' });
        yield put({ type: 'global/checkAuth' });
        yield put({
          type: 'global/fetchUserBasicInfo',
          payload: { isFirst: true },
        });
        yield put(routerRedux.push(`${prefix}/`));
      } catch (error) {
        const { code = 0, note = '' } = error || {};
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginCode: code,
            loginNote: note,
          },
        });
      }
    },
    // 更密周期到了,修改密码
    *changePassword({ payload }, { call, select, put }) {
      const { userName, oldPwd, newPwd } = payload;
      const salt = new Date().getTime();
      const params = {
        passwordSign: '',
        clientId: CLIENTID,
        salt,
      };
      // aas-aes加密
      AES.setSecret(APP_SECRET);
      params.passwordSign = AES.encryptBase64(JSON.stringify([oldPwd, newPwd, userName, salt]));
      const response = yield call(FetchPwd, params);
      const { code = 0 } = response || {};
      if (code > 0) {
        // 修改成功后关闭修改密码的弹框
        const loginNote = yield select(state => state.login.loginNote);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginCode: -1,
            loginNote,
          },
        });
      }
    },
    // 获取用户信息
    *user(_, { call, put }) {
      const response = yield call(AccountUser, { cookie: 123 });
      if (response.success === false) {
        // 重新加载页面,刷新页面会去掉各个model里面的数据(有待确定)
        yield put(routerRedux.push(`${prefix}/login`));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { loginCode, loginNote, user } = payload;
      if (loginCode > 0) {
        sessionStorage.setItem('user', JSON.stringify(user)); // 保存用户基本信息
      }
      return {
        loginCode,
        loginNote,
      };
    },
  },
};
