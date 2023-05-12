import sensors from "sa-sdk-javascript";

// 点击事件埋点
export function newClickSensors({
  third_module = "",
  fourth_module = "",
  ax_page_name = "",
  ax_button_name = "",
}) {
  sensors.track("page_click", {
    first_module: "员工端PC",
    second_module: "客户360",
    third_module: third_module,
    fourth_module: fourth_module,
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
  third_module = "",
  fourth_module = "",
  ax_page_name = "",
}) {
  sensors.track("page_view", {
    first_module: "员工端PC",
    second_module: "客户360",
    third_module: third_module,
    fourth_module: fourth_module,
    ax_page_name: ax_page_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: "",
    card_id: "",
    card_name: "",
  });
}
