import { useEffect, useRef } from 'react';
import moment from 'moment';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 格式化时间
export function formatTimer(timer) {
  // const timer = '2019-08-19 16:19:23';
  if (timer.indexOf(':') === -1) timer = moment(timer).startOf().format('YYYY-MM-DD HH:mm:ss');
  const Now = moment().format('YYYY-MM-DD HH:mm:ss'); // 当前时间
  const EOTs = moment(Now).diff(timer, 'seconds', true); // 时差--秒
  const EOTm = moment(Now).diff(timer, 'minutes', true); // 时差--分钟
  // const EOTd = moment(Now).diff(timer, 'days', true); // 时差--天
  // const EOTy = moment(Now).diff(timer, 'years', true); // 时差--年
  // const kd = moment().diff(moment(timer).format('YYYYMMDD'), 'day');
  let timeDiff = '--';
  if (timer) {
    if (parseInt(Now.substr(0, 4), 10) > parseInt(timer.substr(0, 4), 10)) {
      timeDiff = `${moment(timer).format('YYYY-MM-DD')}`;
    } else if (EOTs < 60) {
      timeDiff = '刚刚';
    } else if (EOTm >= 1 && EOTm < 60) {
      timeDiff = `${Math.round(EOTm)}分钟前`;
    } else if (EOTm >= 60 && moment(timer) > moment().startOf('day') && moment(timer) < moment().endOf('day')) {
      timeDiff = `${Math.round(EOTm / 60)}小时前`;
    } else if (moment(timer) > moment().subtract(1, 'd').startOf('day') && moment(timer) < moment().subtract(1, 'd').endOf('day')) {
      timeDiff = `昨天${moment(timer).format('HH:mm')}`;
    } else {
      timeDiff = `${moment(timer).format('MM月DD日')}`;
    }
  }
  return timeDiff;
}
