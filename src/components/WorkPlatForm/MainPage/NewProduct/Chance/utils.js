import sensors from 'sa-sdk-javascript';

// 浏览事件埋点
export function viewSensors() {
  sensors.track('page_view', {
    first_module: '员工端PC',
    second_module: '营销',
    third_module: '业务机会',
    ax_page_name: '业务机会',
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: '',
    card_id: '',
    card_name: '',
  });
}