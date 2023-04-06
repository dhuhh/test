/* eslint-disable no-debugger */
/* eslint-disable no-empty-pattern */
/* eslint-disable require-yield */
import lodash from 'lodash';
import { AccountUser, AccountLogout, UserBasicInfo } from '../services/login';
import { FetchMenu, FetchAuths } from '../services/amslb/user';
import { fetchSysParam } from '../services/commonbase/sysParam';
import { fetchSysDictionary } from '../services/commonbase/sysDictionary';
import { prefix, preLivebosUrl } from '../utils/config';

export default {

  namespace: 'global',

  state: {
    theme: window.localStorage.getItem('userTheme') || window.localStorage.getItem(`${prefix}_userTheme`) || 'blue-distant-theme', // 优先获取C5系统主题，其次为项目主题
    hasAuthed: false, // 表示是否向服务器发送过认证请求
    menuTree: [], // 菜单
    menuTreeLoaded: false,
    userBasicInfo: { loading: true }, // 获取用户基本信息
    authorities: { loading: true }, // 获取用户功能权限点
    authoritiesFlag: false, // 获取用户功能权限点接口是否调用过
    dictionary: { loading: true }, // 用来存放字典信息
    objects: { loading: true }, // 用来存放对象信息
    authUserInfo: { loading: true },
    sysParam: [], // 平台url
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(({ pathname }) => {
        const blackList = [`${prefix}/`, `${prefix}/login`, `${prefix}/logout`, `${prefix}/ssoLogin`];
        if (!blackList.includes(pathname)) {
          console.log(pathname);
          dispatch({ type: 'checkAuth' }).then((res) => {
            // 判断是否有菜单权限
            dispatch({ type: 'checkMenuRouterAuth', payload: { history } });
          }); // 每次访问新路由的时候,检查一下会话
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    checkAuth: [
      function*(payload, { call, put, all}) {  // eslint-disable-line
        const data = yield call(AccountUser); // 此处不捕获异常,将异常抛到dva最外层的onError事件捕捉,如果过期就跳转到登录页面
        if (data.success) {
          yield put({
            type: 'onAuthDataChange',
            payload: {
              hasAuthed: true,
              authUserInfo: data.user || {},
            },
          });
          sessionStorage.setItem('user', JSON.stringify(data.user || {}));
          window.sessionStorage.setItem('loginStatus', '1'); // 登录状态: 0|未登录;1|已登录;-1|过期;inStatus', '1'); // 登录状态: 0|未登录;1|已登录;-1|过期;
          yield all([
            put({ type: 'fetchUserBasicInfo' }), // 每次登陆的时候获取系统授权业务角色
            put({ type: 'fetchUserAuthorities' }), // 每次登陆的时候获取权限点信息
            put({ type: 'fetchParam' }), // 获取相关系统 url
            put({ type: 'fetchDictionary' }), // 每次访问的时候检查一下字典是否查询了,如果没有查询,那么就查一下
            put({ type: 'fetchObjects' }), // 获取系统liveBos对象
          ]);
        }
      },
      { type: 'takeLatest' },
    ],
    // 获取登录用户的所有菜单项
    *fetchMenu({ payload }, { call, put }) {
      const response = yield call(FetchMenu, { project: 'SYSTEM', ...payload });
      const { data = {} } = response;
      sessionStorage.setItem('menuTree', JSON.stringify(data?.menuTree?.menu.item));
      yield put({
        type: 'save',
        payload: {
          menuTree: (data.menuTree && data.menuTree.menu && data.menuTree.menu.item ? data.menuTree.menu.item : []),
          menuTreeLoaded: true,
        },
      });
    },

    // 注销操作
    *logout(_, { call, put }) {
      // 改变登录的状态
      yield call(AccountLogout);
      window.sessionStorage.setItem('loginStatus', '0'); // 登录状态为未登录
      localStorage.setItem('firstUserID', ''); // 清除 firstUserID
      // 重新加载页面,刷新页面会去掉各个model里面的数据
      window.location.reload();
      yield put({
        type: 'onAuthDataChange',
        payload: { hasAuthed: false },
      });
    },

    // 获取用户基本信息
    *fetchUserBasicInfo(_, { select, call, put }) {
      const userBasicInfo = yield select(state => state.global.userBasicInfo);
      if (userBasicInfo.loading) {
        yield put({
          type: 'saveUserBasicInfo',
          payload: { userBusinessRole: '', userBasicInfo: { loading: false } },
        });
        try {
          const data = yield call(UserBasicInfo);
          const { code = 0, records = [] } = data || {};
          if (code > 0) {
            let userBusinessRole = '';
            const userBasicInfoTemp = { loading: false };
            if (records && records.length === 1) {
              const record = records[0];
              const finalRecord = {};
              const keys = Object.keys(record);
              keys.forEach((item) => {
                if (record[item] instanceof Object) {
                  const chiKeys = Object.keys(record[item]);
                  chiKeys.forEach((chiItem) => {
                    finalRecord[chiItem] = record[item][chiItem] || '';
                  });
                } else {
                  finalRecord[item] = record[item];
                }
              });
              const { xtjs = '' } = finalRecord;
              userBusinessRole = xtjs;
              Object.assign(userBasicInfoTemp, finalRecord);
            }
            yield put({
              type: 'saveUserBasicInfo',
              payload: { userBusinessRole, userBasicInfo: userBasicInfoTemp },
            });
          }
        } catch (error) {
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveUserBasicInfo',
            payload: { userBusinessRole: '', userBasicInfo: { loading: true } },
          });
        }
      }
    },

    *fetchDictionary(_, { select, call, put }) {
      const dictionaryInstate = yield select(state => state.global.dictionary);
      if (!dictionaryInstate || dictionaryInstate.loading || Object.keys(dictionaryInstate).length === 1) {
        yield put({
          type: 'saveDictionary',
          payload: { loading: false },
        });
        try {
          const data = yield call(fetchSysDictionary, { fldm: '' });
          const { code = 0, records = [] } = data || {};
          const dictionary = { loading: false };
          if (code > 0) {
            records.forEach((item) => {
              const { fldm = '' } = item;
              if (fldm !== '' && dictionary[fldm]) {
                dictionary[fldm].push(item);
              } else if (fldm !== '' && !dictionary[fldm]) {
                dictionary[fldm] = [];
                dictionary[fldm].push(item);
              }
            });
          }
          yield put({
            type: 'saveDictionary',
            payload: dictionary,
          });
        } catch (error) {
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveDictionary',
            payload: { loading: true },
          });
        }
      }
    },

    *fetchUserAuthorities(_, { select, call, put }) {
      const authorities = yield select(state => state.global.authorities);
      if (authorities.loading) {
        yield put({
          type: 'saveUserAuthorities',
          payload: { loading: false },
        });
        try {
          const data = yield call(FetchAuths, { loadOption: 0, muduleName: '' });
          const { records = [] } = data || {};
          // 如果有权限信息,那么就转化成对象的格式
          if (records && records.length > 0) {
            const authoritiesData = { loading: false };
            records.forEach((item) => {
              const { objectName = '', commands = [] } = item || {};
              if (objectName !== '') {
                authoritiesData[objectName] = commands;
              }
            });
            yield put({
              type: 'saveUserAuthorities',
              payload: authoritiesData,
            });
          }
        } catch (error) {
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveUserAuthorities',
            payload: { loading: true },
          });
        }
        yield put({
          type: 'saveUserAuthoritiesFlag',
          payload: true,
        });
      }
    },

    *fetchParam(_, { select, call, put }) {
      const sysParam = yield select(state => state.global.sysParam);
      if (sysParam && sysParam.length === 0) {
        const data = yield call(fetchSysParam, {});
        const { code = 0, records = [] } = data || {};
        if (code > 0) {
          let isSwitchUser = '';
          let livebosPrefix = '';
          let menuExpansion = ''; // 菜单是否默认展开
          let applicationName = ''; // 应用名称
          let usrPwdStrengthLevel = ''; // 密码强制安全等级
          let usrPwdMinLength = ''; // 密码最小长度
          records.forEach((item) => {
            const { csmc = '', csz = '' } = item || {};
            switch (csmc) {
              case ('UserSwitchEnable'): isSwitchUser = csz;
                break;
              case ('system.glpt.url'): livebosPrefix = csz;
                break;
              case ('system.menu.isexpansion'): menuExpansion = csz;
                break;
              case ('application-name'): applicationName = csz;
                break;
              case ('password.strength.level'): usrPwdStrengthLevel = csz;
                break;
              case ('password.strength.length.min'): usrPwdMinLength = csz;
                break;
              default: break;
            }
          });
          // 优先获取配置文件中的 livebos 地址
          livebosPrefix = preLivebosUrl || livebosPrefix;
          localStorage.setItem('livebos', livebosPrefix);
          localStorage.setItem('menuExpansion', menuExpansion);
          localStorage.setItem('isSwitchUser', isSwitchUser);
          localStorage.setItem('applicationName', applicationName);
          localStorage.setItem('usrPwdStrengthLevel', usrPwdStrengthLevel);
          localStorage.setItem('usrPwdMinLength', usrPwdMinLength);
          yield put({ type: 'save', payload: { sysParam: records } });
        }
      }
    },
    *resetAll(_, { put }) {
      yield put({ type: 'resetData' });
    },
    *showMenu(_, { put }) {
      yield put({ type: 'save',
        payload: {
          isHideMeun: false,
        },
      });
    },
    // 判断路由菜单权限
    *checkMenuRouterAuth({ payload }, {}) { // eslint-disable-line
      // menu数组
      const menuArr = [];
      const getMenuArr = (menus) => {
        menus.forEach((m) => {
          const { url: curl = '' } = m;
          const cmenus = lodash.get(m, 'menu.item', []);
          const cname = lodash.get(m, 'title[0].text', '');
          if (curl) {
            menuArr.push({ name: cname, url: curl });
          }
          if (cmenus.length > 0) {
            getMenuArr(cmenus);
          }
        });
      };
      const menuStr = sessionStorage.getItem('menuTree');
      if (lodash.isEmpty(JSON.parse(menuStr))) {
        const menuTree = JSON.parse(menuStr);
        // 获取menu数组
        getMenuArr(menuTree);
        const { history: { location: { pathname = '', search = '' } } } = payload;
        const path = `${pathname}${search}`;
        // 如果没有菜单权限，跳转403
        const menuUrls = menuArr.map(m => m.url);
        if (path !== '/403' && path !== '/' && !menuUrls.includes(path)) {
          window.location.href = '/#/403';
        }
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeTheme(state, { payload }) {
      const { theme } = payload;
      window.localStorage.setItem('userTheme', theme);// eslint-disable-line
      return {
        ...state,
        theme,
      };
    },
    // 字典
    saveDictionary(state, { payload }) {
      return {
        ...state,
        dictionary: payload,
      };
    },
    onAuthDataChange(state, { payload }) {
      const { hasAuthed, authUserInfo } = payload;
      return {
        ...state,
        hasAuthed, // 表示是否向服务器发送过认证请求
        authUserInfo,
      };
    },
    saveUserBasicInfo(state, { payload }) {
      const { userBusinessRole, userBasicInfo } = payload;
      return {
        ...state,
        userBusinessRole,
        userBasicInfo,
      };
    },
    saveUserAuthorities(state, { payload }) {
      return {
        ...state,
        authorities: payload,
      };
    },
    saveUserAuthoritiesFlag(state, { payload }) {
      return {
        ...state,
        authoritiesFlag: payload,
      };
    },
  },
  resetData(state) {
    return {
      ...state,
      hasAuthed: false, // 表示是否向服务器发送过认证请求
      userBasicInfo: { loading: true }, // 获取用户基本信息
      authorities: { loading: true }, // 获取用户功能权限点
      authoritiesFlag: false, // 获取用户功能权限点接口是否调用过
      dictionary: { loading: true }, // 用来存放字典信息
      authUserInfo: { loading: true },
    };
  },
};
