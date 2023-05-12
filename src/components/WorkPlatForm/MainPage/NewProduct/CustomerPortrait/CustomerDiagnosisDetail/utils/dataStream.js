/* eslint-disable */
/*******************************************************************************
 * Copyright (c)2016, 杭州中焯信息技术股份有限公司
 * All rights reserved.
 *
 * 文件名称：dataStream.js
 * 文件标识：
 * 摘    要：处理base64数据，解析二进制数据流
 *
 * 当前版本：
 * 作    者：九指神丐
 * 完成日期：2016.9.20
 *
 * 备    注：
 *
 * 修改记录：
 *
 *******************************************************************************/

var keyStr = 'ABCDEFGHIJKLMNOP' +
             'QRSTUVWXYZabcdef' +
             'ghijklmnopqrstuv' +
             'wxyz0123456789+/' +
             '=';
// 编码为base64
function encode64 (input) {
  input = escape(input);
  var output = '';
  var chr1, chr2, chr3 = '';
  var enc1, enc2, enc3, enc4 = '';
  var i = 0;

  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output = output +
         keyStr.charAt(enc1) +
         keyStr.charAt(enc2) +
         keyStr.charAt(enc3) +
         keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  return output;
}
// 解密base64
function decode64 (input) {
  var output = '';
  var chr1, chr2, chr3 = '';
  var enc1, enc2, enc3, enc4 = '';
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    alert('There were invalid base64 characters in the input text.\n' +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" +
            'Expect errors in decoding.');
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  return unescape(output);
}
/*
  字符串转Bytes数组
*/
function stringToBytess (str) {
  var ch, st, re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xFF); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    }
    while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

function stringToBytes (str) {
  var ch, st, re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    if (ch > 255) {
      re.push(ch >> 8);
    }
    re.push(ch & 0xFF);
  }
  // return an array of bytes
  return re;
}

// Byter转字符串
function bin2String (array) {
  return String.fromCharCode.apply(String, array);
}
/*
  把byter转成数字
*/
function readint (array) {
  var val = 0;
  for (var i = 0; i < array.length; i++) {
    val += (i == 0 ? array[i] : array[i] * Math.pow(256, i));
  }
  if (array[i - 1] >= 128) {
    val = val << 0;
  }
  return val;
}
// 浮点数计算方式
var getFloat = function (arr) {
  var a = arr[0],
    b = arr[1],
    c = arr[2],
    d = arr[3];
  var temp = 0;
  var temp2 = d >> 7;
  // MS为无符号byte,java是有符号byte需加下面转换
  a = a < 0 ? a + 256 : a;
  b = b < 0 ? b + 256 : b;
  c = c < 0 ? c + 256 : c;
  d = d <= 0 ? d + 256 : d;

  if (temp2 < 0) { d = d ^ 128; }

  var size = (d << 1) + (c >> 7) - 127;
  c = c | 128;
  if (size <= 7) {
    temp = c >> (7 - size);
  } else if ((size > 7) && (size <= 15)) {
    temp = (b >> (15 - size)) + (c << (size - 7));
  } else if ((size > 15) && (size <= 23)) {
    temp = (a >> (23 - size)) + (b << (size - 15)) + (c << (size - 7));
  } else if (size > 23) {
    var e = c << (size - 7);
    if (e < 0) {
      e = c * Math.pow(2, (size - 7));
    }
    temp = (a << (size - 23)) + (b << (size - 15)) + (e);
  }

  temp = temp2 < 0 ? temp * temp2 : temp;
  return temp;
};

var htmer = function (s) {
  var str = s.toString(16);// 将十六进制数值转换为字符串形式

  var res = parseInt(str, 16).toString(2);// 将十进制数值转换为二进制
  var fh = '';
  if (res.length === 32) {
    fh = (res.substr(1, 1) == 1 ? '-' : '');
    res = res.substring(1);
  }

  var sub1 = res.substr(0, 8);// 拆分第二位到第九位的八位二进制数为指数位
  // alert(sub1);
  var num2 = parseInt(sub1, 2);// 将二进制指数转换为十进制
  num2 = num2 - 127;// 求出指数用转换的十进制数减去127就可以得到

  // 整数
  var numz = res.substr(8, num2);

  numz = '1' + numz;
  // 小数
  var numpro = res.substring(num2 + 8);

  var tt = parseInt(numz, 2) + change(numpro);
  document.write('<br />' + fh + tt);
};
// 定义方法来进行浮点数二进制转换为十进制（str为传入的二进制字符串，sn为字符串的位置）
var change = function turn (str) {
  var r = 0.00;
  var ln = str.length;
  for (var i = 0; i < ln; i++) {
    r = r + parseFloat(str.substr(i, 1)) * Math.pow(2, '-' + (i + 1));
  }
  return r;
};

export default {
  encode64: encode64,
  decode64: decode64,
  stringToBytes: stringToBytes,
  bin2String: bin2String,
  readint: readint,
  getFloat: getFloat,
  htmer: htmer
};
