import { useEffect, useRef } from 'react';
import sensors from 'sa-sdk-javascript';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 点击事件埋点
export function clickSensors(ax_button_name) {
  sensors.track('page_click', {
    first_module: '员工端PC',
    second_module: '首页',
    third_module: '客户360',
    ax_page_name: '持仓',
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    ax_button_name,
    card_id: '',
    card_name: '',
  });
}

// 浏览事件埋点
export function viewSensors() {
  sensors.track('page_view', {
    first_module: '员工端PC',
    second_module: '客户360',
    third_module: '持仓',
    ax_page_name: '',
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: '',
    card_id: '',
    card_name: '',
  });
}

export const themeEC5 = {
  color: [
    '#73A0FA',
    '#F180D6',
    '#7585A2',
    '#F7C739',
    '#83D0EF',
    '#A285D2',
    '#FFAB67',
    '#2ec7c9',
    '#FFA8CC',
    '#95706d',
    '#7cb4cc',
  ],
};