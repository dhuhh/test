import sensors from 'sa-sdk-javascript';

// 浏览事件埋点
export function viewSensors(second_module, third_module, ax_page_name) {
  sensors.track('page_view', {
    first_module: '员工端PC',
    second_module,
    third_module,
    ax_page_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: '',
    card_id: '',
    card_name: '',
  });
}