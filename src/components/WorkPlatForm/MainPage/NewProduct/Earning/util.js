import { message } from 'antd';
import XLSX from 'xlsx';
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

// 前端表格数据导出Excel
// 生成sheet
const toSheet = (columns, dataSource, activeKey = 1) => {
  if (columns.length > 26) message.error('暂不支持超过26列的表格导出');
  let table = [];
  let tableHeader = {};
  let arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  columns.forEach((item, index) => {
    tableHeader[arr[index]] = typeof item.title === 'string' ? item.title : item.key;
  });
  table.push(tableHeader);
  dataSource.forEach((item1, index1) => {
    let row = {};
    columns.forEach((item2, index2) => {
      if (item2.dataIndex === 'code') {
        if (activeKey === 3) {
          row[arr[index2]] = `${item1.dayType}/${item1.secuIntl}`;
        } else {
          row[arr[index2]] = `${item1.name}/${item1.code}`;
        }
      } else {
        row[arr[index2]] = item1[item2.dataIndex];
      }
    });
    table.push(row);
  });
  // json转sheet
  let ws = XLSX.utils.json_to_sheet(table, { header: arr.slice(0, columns.length), skipHeader: true });
  return ws;
};

// fileName:string(不含后缀.xlsx)
// rest: [{sheet:sheet, sheetName:string }, ...]
const toExcel = (fileName, ...rest) => {
  // 创建book
  let wb = XLSX.utils.book_new();
  // sheet写入book
  rest.forEach((item, index) => {
    XLSX.utils.book_append_sheet(wb, item.sheet, item.sheetName);
  });
  // 输出
  XLSX.writeFile(wb,`${fileName}.xlsx`);
};

// 前端表格数据导出Excel
export const exportExcel = { toSheet, toExcel };

// 点击事件埋点
export function clickSensors(ax_button_name) {
  sensors.track('page_click', {
    first_module: '员工端PC',
    second_module: '首页',
    third_module: '客户360',
    ax_page_name: '收益',
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
    second_module: '客户360',
    third_module: '收益',
    ax_page_name,
    ax_page_url: location.href,
    staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
    source_from: '',
    card_id: '',
    card_name: '',
  });
}
