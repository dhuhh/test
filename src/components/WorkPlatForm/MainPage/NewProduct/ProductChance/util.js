
import sensors from 'sa-sdk-javascript';


// 金额数据颜色格式化
export function formatColor(val) {
  val = val + '';
  let num = val.replace(/[^0-9.-]/ig, '');
  if (isNaN(num)) return '#1A2243';
  if (Number(num) > 0) {
    return '#E84646';
  } else if (Number(num) < 0) {
    return '#099A08';
  } else if (Number(num) === 0) {
    return '#61698C';
  }
}

// 点击事件埋点
// 点击事件埋点
export function newClickSensors({
  ax_page_name = "",
  ax_button_name = "",
}) {
  sensors.track("page_click", {
    first_module: "员工端PC",
    second_module: "营销",
    third_module: '产品机会',
    fourth_module: '',
    ax_page_name: ax_page_name,
    ax_button_name: ax_button_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    card_id: "",
    card_name: "",
  });
}

// 浏览事件埋点
export function newViewSensors({
  ax_page_name = "",
}) {
  sensors.track("page_view", {
    first_module: "员工端PC",
    second_module: "营销",
    third_module: "产品机会",
    fourth_module: '',
    ax_page_name: ax_page_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: "",
    card_id: "",
    card_name: "",
  });
}

export function filterFunction(data, name) {
  let arr = [...data];
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i][name] === arr[j][name]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
};

