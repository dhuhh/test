/* eslint-disable */
import aes from './aes';
/**
 *   对Date的扩展，将 Date 转化为指定格式的String
 *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *   例子：
 *   (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *   (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
const fmtDate = function (date, fmt) { // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  }
  return fmt;
};
const fmtunit = function (num, digit, isunit, isFormat) {
  if (isunit !== 0) {
    isunit = 1;
  }
  var dig = digit || 0;
  if (num == '' || typeof num == 'undefined') {
    return '';
  }
  if (isNaN(num)) {
    return num;
  }
  num = num.toString();
  var arrNum = num.split('.');
  var arrln = arrNum[0].length;
  if (arrln >= 6 && arrln < 9) {
    return (format(num / 10000, dig) + (isunit == 0 ? '' : '万'));
  } else if (arrln >= 9) {
    return (format(num / 100000000, dig) + (isunit == 0 ? '' : '亿'));
  } else {
    if (isFormat) {
      return num;
    } else {
      return (format(num, dig));
    }
  }
};
const format = function (num, dig) {
  // 数字转换成小数两位
  // return Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
  var f = parseFloat(num);
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0 && dig > 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + Number(dig)) {
    s += '0';
  }
  if (rs >= 1 && (f.toString().length - rs > dig)) {
    if (Number(dig) > 0) {
      var l = (num.toString().indexOf('.')) + 1;
      s = num.toString().slice(0, l + Number(dig));
    } else {
      // s = Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
      var wz = num.toString().indexOf('.');
      if (wz > 0) {
        s = num.toString().substr(0, wz);
      } else {
        s = num;
      }
    }
  }
  return s;
};
const getMonthBefor = function (n, newdate) { // 获取前后几个月的日期，n=3,返回20141215
  var resultDate, yy, mm, dd;
  var currDate = new Date();
  yy = currDate.getFullYear();
  mm = currDate.getMonth() + 1;
  dd = currDate.getDate();
  if (newdate && newdate.length == 8) {
    newdate = newdate.toString();
    yy = parseInt(newdate.slice(0, 4));
    mm = parseInt(newdate.slice(4, 6));
    dd = parseInt(newdate.slice(6, 8));
  }
  var dt = new Date(yy, mm, dd);
  dt.setMonth(dt.getMonth() + n);
  if ((dt.getFullYear() * 12 + dt.getMonth()) > (yy * 12 + mm + n)) {
    dt = new Date(dt.getYear(), dt.getMonth(), 0);
  }
  var year = dt.getFullYear();
  var month = (dt.getMonth() < 10) ? ('0' + dt.getMonth()) : dt.getMonth();
  var days = (dt.getDate() < 10) ? ('0' + dt.getDate()) : dt.getDate();
  resultDate = year + String(month) + days;
  return resultDate;
};

const manyDays = function (n, newDate) {
  n = parseInt(n);
  let d;
  if (newDate) {
    newDate = ('' + newDate).replace(/-/g, '/');
    d = new Date(newDate);
  } else {
    d = new Date();
  }
  let dd = d.setDate(d.getDate() + n);
  return strTodate(dd);
};
const getYTDS = function (n) { // 20140915转换2014-09-15
  var year = n.substr(0, 4),
    months = n.substr(4, 2),
    days = n.substr(6);
  return year + '-' + months + '-' + days;
};
const strTodate = function (str) { //
  var startyear = 1970;
  var startmonth = 1;
  var startday = 1;
  var d, s, st;
  var sep = ':';
  d = new Date();
  d.setFullYear(startyear, startmonth, startday);
  d.setTime(0);
  d.setMilliseconds(str);
  s = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  st = s.replace(/-$/, '').replace(/\b(\w)\b/g, '0$1').replace(/-/g, '');
  return st;
};
// 强制保留pos位小数
const toDecimal2 = function (x, pos) {
  pos = pos || 0;
  var f = parseFloat(x);
  if (isNaN(f)) {
    return x;
  }
  var f = Math.round(x * Math.pow(10, pos)) / Math.pow(10, pos);
  var s = f.toString();
  var rs = s.indexOf('.');

  if (pos) {
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
  }
  while (s.length <= rs + pos) {
    s += '0';
  }

  if (rs > -1 && s.split('.')[1].length > pos) {
    s = Number(s).toFixed(pos);
  }
  return s;
};
const numTosize = function (num, pos) {
  if (!num) {
    return num;
  }
  pos = pos || 2;
  var floatNum = Number.parseFloat(num);
  var f = 1;
  if (isNaN(floatNum)) {
    return num;
  }
  if (floatNum < 0) {
    f = -1;
    floatNum = Math.abs(floatNum);
  }
  if (floatNum > 10000 && floatNum < 100000000) {
    return toDecimal2(floatNum / 10000 * f, pos) + '万';
  }

  if (floatNum > 100000000) {
    return toDecimal2(floatNum / 100000000 * f, pos) + '亿';
  }
  return floatNum * f;
};

const formatTimeLable = function (datetime, StockIndex) {
  StockIndex = '' + StockIndex;
  datetime = '' + datetime;
  switch (StockIndex) {
  case '1':// 03021435
  case '2':// 03021435
  case '3':
  case '4':// 02291345
  case '9':// 02241100
  {
    if (datetime.length == 7) {
      datetime = '0' + datetime;
    }
    var month = datetime.substring(0, 2);
    var date = datetime.substring(2, 4);
    var hour = datetime.substring(4, 6);
    var minute = datetime.substring(6, 8);

    return month + '/' + date + ' ' + hour + ':' + minute;
  }
  default:
  {
    if (datetime.length == 8) {
      var year = datetime.substring(0, 4);
      var month = datetime.substring(4, 6);
      var date = datetime.substring(6, 8);
      return year + '/' + month + '/' + date;
    }
    break;
  }
  }
  return datetime;
};
const setCookie = function (a) {
  var b = new Date();
  b.setTime(+b + 15552e6);
  document.cookie = 'acitve_phone_cookie=' + escape(a) + ';expires=' + b.toGMTString();
};
const getCookie = function (name) {
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  arr = document.cookie.match(reg);
  if (arr) { return unescape(arr[2]); } else { return null; }
};
const setLocalStorage = function (obj) {
  for (var n in obj) {
    // window.localStorage[n] = obj[n];
    var val = obj[n];
    if (typeof val == 'object') {
      val = JSON.stringify(val);
    }
    setLStorageInfo(n, val);
  }
};
function setLStorageInfo (key, val) {
  val = val != null ? val : '';
  var obj = {
    value: val,
    time: 0
  };
  try {
    obj = JSON.stringify(obj);
    var e = aes.enc.Utf8.parse('iloveyou'),
      f = aes.enc.Utf8.parse(obj),
      g = aes.enc.Utf8.parse('iloveyou'),
      h = aes.AES.encrypt(f, e, {
        iv: g,
        mode: aes.mode.CBC
      });
    obj = h.toString();
  } catch (i) {}
  try {
    window.localStorage.setItem(key, obj);
  } catch (i) {
    console.log('您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！');
  }
}
const getLocalStorage = function (array) {
  var obj = {};
  if (array.indexOf('selfstocklist') > -1) {
    array.push('tztZXlist');
  }
  array.forEach((item, index) => {
    obj[item] = getLStorageInfo(item);
  });
  if ('tztZXlist' in obj) {
    obj.selfstocklist = obj.tztZXlist;
  }
  return obj;
};
function getLStorageInfo (key) {
  var val = null;
  try {
    val = window.localStorage.getItem(key);
  } catch (d) {
    return console.log('您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！');
  }
  if (val === null || val === 'null' || val === '') return val;
  try {
    var c;
    var e = aes.enc.Utf8.parse('iloveyou'),
      f = aes.enc.Utf8.parse('iloveyou'),
      g = aes.enc.Base64.parse(val),
      h = aes.AES.decrypt({
        ciphertext: g
      }, e, {
        iv: f,
        mode: aes.mode.CBC
      });
    val = h.toString(aes.enc.Utf8) === '' && c !== '' ? JSON.stringify({
      time: 0,
      value: window.localStorage.getItem(key)
    }) : h.toString(aes.enc.Utf8);
  } catch (d) {
    val = JSON.stringify({
      time: 0,
      value: window.localStorage.getItem(key)
    });
  }
  var i = null;
  try {
    val = JSON.parse(val);
    i = val.hasOwnProperty('time') && val.hasOwnProperty('value') ? val.value : val;
  } catch (d) {
    d.message.indexOf('Unexpected token') === 0 && (i = val);
  }
  return i;
}
const setSessionStorage = function (obj) {
  for (var n in obj) {
    var val = obj[n];
    if (typeof val == 'object') {
      val = JSON.stringify(val);
    }
    // window.sessionStorage[n] = val;
    setSStorageInfo(n, val);
  }
};
function setSStorageInfo (key, val) {
  val = val != null ? val : '';
  var obj = {
    value: val,
    time: 0
  };
  try {
    obj = JSON.stringify(obj);
    var f = aes.enc.Utf8.parse('iloveyou'),
      g = aes.enc.Utf8.parse(obj),
      h = aes.enc.Utf8.parse('iloveyou'),
      i = aes.AES.encrypt(g, f, {
        iv: h,
        mode: aes.mode.CBC
      });
    obj = i.toString();
  } catch (j) {}
  try {
    window.sessionStorage.setItem(key, obj);
  } catch (j) {
    console.log('您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！');
  }
}
const getSessionStorage = function (array) {
  var obj = {};
  array.forEach((item, index) => {
    obj[item] = getSStorageInfo(item);
  });
  return obj;
};
function getSStorageInfo (key) {
  var val = null;
  try {
    val = window.sessionStorage.getItem(key);// 读取session的指
  } catch (d) {
    return console.log('您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！');
  }
  if (val === null || val === 'null' || val === '') return val;
  try {
    var c;
    var e = aes.enc.Utf8.parse('iloveyou'),
      f = aes.enc.Utf8.parse('iloveyou'),
      g = aes.enc.Base64.parse(val),
      h = aes.AES.decrypt({
        ciphertext: g
      }, e, {
        iv: f,
        mode: aes.mode.CBC
      });
    val = h.toString(aes.enc.Utf8) === '' && c !== '' ? JSON.stringify({
      time: 0,
      value: window.sessionStorage.getItem(key)
    }) : h.toString(aes.enc.Utf8);
  } catch (d) {
    val = JSON.stringify({
      time: 0,
      value: window.sessionStorage.getItem(key)
    });
  }
  var i = null;
  try {
    val = JSON.parse(val);
    i = val.hasOwnProperty('time') && val.hasOwnProperty('value') ? val.value : val;
  } catch (d) {
    d.message.indexOf('Unexpected token') === 0 && (i = val);
  }
  return i;
}
const removeSessionStorage = function (array) {
  array.forEach((item, index) => {
    window.sessionStorage.removeItem(item);
  });
};
const dateForm = function (str, index, dateform) {
  var arrIndex = dateform.split(','), arrNum = [], arrSuo = [];
  for (var i = 0; i < arrIndex.length; i++) {
    arrNum[i] = arrIndex[i].split('|')[0];
    arrSuo[i] = arrIndex[i].split('|')[1];
  }
  var suoindex = arrNum.indexOf(index);
  if (suoindex >= 0) {
    if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('yyyy') == '0') {
      var s = arrSuo[suoindex].replace(/yyyy/g, '$1').replace(/mm/g, '$2').replace(/dd/g, '$3');
      return str.replace(/\-/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/i, s);
    } else if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('hh') == '0') {
      if (str.length == 5 || str.length == 7) {
        str = '0' + str;
      }
      var s = arrSuo[suoindex].replace(/hh/g, '$1').replace(/mm/g, '$2').replace(/ss/g, '$3');
      return str.replace(/\:/g, '').substr(0, 6).replace(/^(\d{2})(\d{2})(\d{2})$/i, s);
    } else {
      return str;
    }
  } else {
    return str;
  }
};
const getUrlParameter = function (parameterName, str) {
  // 获取url参数值
  var reg = new RegExp('(^|&|\\?)' + parameterName + '=([^&]*)(&|$)', 'i'), arr, arr1;
  if (str) {
    arr = str.match(reg);
    arr1 = str.match(reg);
  } else {
    arr = location.search.substr(1).match(reg);
    arr1 = location.hash.substr(2).match(reg);
  }
  if (arr) {
    return arr[2];
  } else if (arr1) {
    return arr1[2];
  } else return null;
};

export default {
  format: format,
  fmtunit: fmtunit,
  fmtDate: fmtDate,
  getMonthBefor: getMonthBefor,
  toDecimal2: toDecimal2,
  numTosize: numTosize,
  manyDays: manyDays,
  getYTDS: getYTDS,
  dateForm: dateForm,
  getUrlParameter: getUrlParameter,
  formatTimeLable: formatTimeLable,
  setCookie: setCookie,
  getCookie: getCookie,
  setLocalStorage: setLocalStorage,
  getLocalStorage: getLocalStorage,
  setSessionStorage: setSessionStorage,
  getSessionStorage: getSessionStorage,
  removeSessionStorage: removeSessionStorage
};
