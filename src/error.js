import { routerRedux } from 'dva/router';
import { preUrl } from './utils/config';

const error = (e, dispatch) => {
  if (e.name === 401 || e.name === 403) {
    dispatch(routerRedux.push(`${preUrl}/exception/403`));
    return;
  }
  if (e.name <= 504 && e.name >= 500) {
    dispatch(routerRedux.push(`${preUrl}/exception/500`));
    return;
  }
  if (e.name >= 404 && e.name < 422) {
    dispatch(routerRedux.push(`${preUrl}/exception/404`));
  }
};

export default error;
