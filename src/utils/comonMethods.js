import { message } from 'antd';
import { FetchSysCommonTable } from '@services/commonbase/sysCommon';

/**
 * 获取内部对象
 * @author dingcong
 * @param {Object}  (dxmc,keyWord,grade,fid)这四个参数为接口入参  state为要赋值的参数  component是组件对象
 * @param {Function} callback 不是必填项  如果需要对返回接口进行进一步操作可传该参数
 */
export function getSysObject({ dxmc = '', keyWord = '', grade = 0, fid = null, state, compontet }, callback) {
  FetchSysCommonTable({
    dxmc,
    fid,
    grade,
    keyWord,
  }).then((response) => {
    const { records = {} } = response || {};
    if (typeof callback === 'function') {
      callback(records); // 默认会传入接口返回值
    } else {
      compontet.setState({
        [state]: records,
      });
    }
  }).catch((error) => {
    message.error(!error.success ? error.message : error.note);
  });
}
/**
 * 获取操作图标的权限
 * @author dingcong
 * @param {String} oper 接口列表的oper字段
 * @param {String} directive oper字段的每一项
 * @returns {Boolean} 操作按钮的权限
 */
export function getOperStatus(oper, directive) {
  return oper.split(';').some((item) => {
    const [dir, value] = item.split(',');
    return dir === directive && value === '1';
  });
}

