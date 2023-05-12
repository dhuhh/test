import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import sensors from 'sa-sdk-javascript';

export const getPdf = (title, querySelector, ref = document.body) => {
  let el = document.querySelector(querySelector);
  let contentWidth = el.clientWidth;
  let contentHeight = el.clientHeight;
  let canvas = document.createElement('canvas');
  // let scale = 2; // 解决清晰度问题，先放大2倍
  // canvas.width = contentWidth * scale;
  // canvas.height = contentHeight * scale;
  // canvas.getContext('2d').scale(scale, scale);

  let opts = {
    // scale: scale,
    // canvas: canvas,
    width: contentWidth,
    height: contentHeight,
    useCORS: true,
    allowTaint: true,
    // x: 0,
    // y: 0,
    scrollX: 0,
    scrollY: 0,
  };

  html2Canvas(el, opts).then(canvas => {
    let pageData = canvas.toDataURL('image/jpeg', 1.0);
    let PDF;
    let limit = 14400; // jspdf 单页面最大宽高限制为14400
    if (contentHeight <= limit) {
      PDF = new JsPDF('l', 'px', [contentWidth, contentHeight]);
      PDF.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight);
    } else {
      let pageHeight = contentWidth / 552.28 * 841.89;
      let leftHeight = contentHeight;
      let position = 0;
      let imgWidth = 555.28;
      let imgHeight = imgWidth / contentWidth * contentHeight;
      PDF = new JsPDF('', 'px', 'a4');
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
    }
    PDF.save(title + '.pdf');
  });
};

// 点击事件埋点
export function clickSensors(ax_button_name) {
  sensors.track('page_click', {
    first_module: '员工端PC',
    second_module: '首页',
    third_module: '客户360',
    ax_page_name: '资产贡献',
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
    third_module: '资产贡献',
    ax_page_name: '',
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: '',
    card_id: '',
    card_name: '',
  });
}
// 万化处理
export function formatDw(value, base = 100000) {
  let prefix = '';
  if (Number(value) < 0) {
    prefix = '-';
  }
  value = Math.abs(Number(value));
  if (Number(value) >= base) {
    return prefix + formatThousands((Number(value) / 10000)) + '万';
  } else {
    return prefix + formatThousands(value);
  }
}
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
// 金额数据千分位格式化
export function formatThousands(val, digits = 2) {
  if (!val) return '0.00';
  let str = val + '';
  let num = str.replace(/[^0-9.]/ig, '');
  if (!(num.indexOf('.') > -1 && num.indexOf('.') === num.length - 3)) {
    num = Number(num).toFixed(digits);
  }
  let dw = str.replace(/[0-9.]/ig, '');
  if (dw.indexOf('-') !== -1) {
    return dw.substr(0, 1) + num.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + dw.slice(1);
  }
  return num.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + dw;
}

// 去掉千分位
export function formatNum(val) {
  if (!val) return '0';
  let str = val + '';
  let dw = str.replace(/[0-9.-]/ig, '');
  return str.replace(',', '') + dw;
}