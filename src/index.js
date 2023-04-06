import '@babel/polyfill';
import { message } from 'antd';
import dva from 'dva';
import createLoading from 'dva-loading';
// import createHistory from 'history/createBrowserHistory';
import createHistory from 'history/createHashHistory';
import onSessionTimeout from 'livebos-frame/dist/session';
import 'moment/locale/zh-cn';
// import { ApexCountAction } from './utils/eventtracking';
import './index.less';

// 埋点注册
// ApexCountAction.config(localStorage.getItem('md') || '', 'apex.aas.app.webapi', 'apex.aas.app.webapi', '1.0.0', '来源渠道', 6000);

// message全局配置
message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});


// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(error, dispatch) { // eslint-disable-line
    error.preventDefault();
    const { statusCode } = error;
    if (statusCode === 900) {
      // c5会话过期，通过页面消息通知livebos
      onSessionTimeout('*');
    }
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

