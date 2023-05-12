import sensors from 'sa-sdk-javascript';


// 点击事件埋点
export function clickSensors(ax_page_name, ax_button_name) {
  sensors.track('page_click', {
    first_module: '员工端PC',
    second_module: '首页',
    third_module: '客户',
    ax_page_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    ax_button_name,
    card_id: '',
    card_name: '',
  });
}

// 浏览事件埋点
export function viewSensors(ax_page_name) {
  sensors.track('page_view', {
    first_module: '员工端PC',
    second_module: '客户',
    third_module: '',
    ax_page_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: '',
    card_id: '',
    card_name: '',
  });
}