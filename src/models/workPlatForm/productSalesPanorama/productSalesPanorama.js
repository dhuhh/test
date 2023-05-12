import { DecryptBase64 } from '../../../components/Common/Encrypt';
// import { ptlx } from '../../../utils/config';

const menuData = [
  {
    code: '6666',
    key: 'indexPage',
    name: '产品概况',
    icon: 'icon-caid',
    path: '/productSalesPanorama/index',
  },
  {
    code: '6667',
    key: 'customerListPage',
    name: '客户列表',
    icon: 'icon-cdcx',
    path: '/productSalesPanorama/customerList',
  },

];

export default {

  namespace: 'productSalesPanorama',

  state: {
    cpid: '',
    menuData,
    // cusBasicInfo: {},
    cusMoreInfo: {},
    // cusBusinessRightsInfo: [], // 查询客户权限开通情况
    // noCusAuth: 'loading',
    // collapsed: false,
    // type: '0', // 场景 1|客户 2|财富客户
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        menuData.every((item) => {
          const { path: url } = item;
          if (pathname.startsWith(url)) {
            // cpid,并传入model中
            let cpid = '';
            if (url.startsWith('/productSalesPanorama')) {
              const oldUrl = pathname.substring(pathname.lastIndexOf('/') + 1);
              const queryParamsJson = DecryptBase64(decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1)));
              let odlqueryParams = queryParamsJson.substring(queryParamsJson.lastIndexOf('=') + 1);
              odlqueryParams = odlqueryParams.replace(/\s+/g, '+');
              const queryParams = JSON.parse(odlqueryParams);
              //cpid = pathname.substring(url.length + 1);
              //const { location: { state = {} } } = history;
              //const { customerType = '', queryType = '', productName = '' } = state;
              dispatch({
                type: 'save',
                payload: { cusMoreInfo: { queryParams, oldUrl } },
              });
            }
            //   const cpid = DecryptBase64(pathname.substring(url.length + 1));
            //   const { location: { state = {} } } = history;
            //   const { customerType = '', queryType = '', productName = '' } = state;
            //   // const params = this.props.location.state;
            //   // let { match: { params: { customerType = '',queryType = '' } } } = this.props;
            //   dispatch({
            //     type: 'setCpid',
            //     payload: { cpid, customerType, queryType, productName },
            //   });
            //   return false;
          }
          return true;
        });
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *setCpid({ payload }, { call, put, select }) {  // eslint-disable-line
      // const hasAuthed = yield select(state => state.global.hasAuthed);
      const oldCpid = yield select(state => state.productSalesPanorama.cpid);
      const { cpid, queryType, customerType, productName } = payload;
      if (cpid && oldCpid !== cpid) {
        yield put({ type: 'save', payload: { cusMoreInfo: { cpid, queryType, customerType, productName } } });
        // yield put({ type: 'saveCusInfo', payload: { cpid, payload, customerType, productName } });
      }
      // if (cpid && oldCpid !== cpid) {
      //   yield put({ type: 'fetchProdViewConfigure', payload: { cpid } });
      //   yield put({ type: 'saveCpid', payload: { cpid } });
      //   // if (hasAuthed) {
      //   yield put({ type: 'fetchProdMoreInfo', payload: { cpid } });
      //   // }
      //   // 记录产品全景访问日志,用于查看历史浏览的产品信息
      //   yield put({ type: 'recordVisitHistory', payload: { cpid } });
      // }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveKhid(state, { payload }) {
      const { khid } = payload;
      return { ...state, khid };
    },
    saveType(state, { payload }) {
      const { type } = payload;
      return { ...state, type };
    },
    saveCusInfo(state, { payload }) {
      const cusMoreInfo = { ...payload };
      console.log('cusMoreInfo', cusMoreInfo);
      return { ...state, ...cusMoreInfo };
    },
    // changeCollapsed (state, action) {
    //   return { ...state, collapsed: !state.collapsed }
    // },
  },
};
