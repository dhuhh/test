/* eslint-disable */
// 解析BINDATA结构体数据 k线
/**
 *@pTNewPriceData 二进制数据流
 *@NEWMARKETNO 新市场号
 *  */
import tztTechObjBase from './tztTechObjBase.js';
import dataStream from './dataStream.js';
import tztStockType from './tztStockType.js';
import util from './util.js';
const setTNewPriceData = function (pTNewPriceData, NEWMARKETNO, structure, num) {
  // 分割报价数据
  var priceData = pTNewPriceData.split('|'),
    struct = {},
    isZs = tztStockType.MakeIndexMarket(NEWMARKETNO) || tztStockType.MakeBlockIndex(NEWMARKETNO),
    structure = structure || 'TNewPriceData',
    abase64 = tztTechObjBase.clearBase64[structure] || [],
    tztTech = tztTechObjBase[structure];

  for (var i = 0; i < priceData.length; i++) {
    var data = priceData[i],
      stream = null,
      TNewPriceData = tztTech[i],
      end = 0;

    if (!data || !TNewPriceData) {
      continue;
    }
    var lns = 0;
    // 进行解base64
    if (abase64.indexOf(i.toString()) < 0) {
      stream = dataStream.stringToBytes(window.atob(data));
      if (num && num > 0) {
        lns = num;
        struct = [];
      } else {
        lns = TNewPriceData.length;
      }
    } else {
      // 转成Bytes数组
      stream = data;
      lns = TNewPriceData.length;
    }

    // 循环定义好的结构体
    for (var t = 0; t < lns; t++) {
      var listPriceData = num ? TNewPriceData[0] : TNewPriceData[t];
      var isType = 0; // 0数字 1字符串 2是浮点数
      var addBkzs = 0;
      var addBkStart = 0;

      if ('type' in listPriceData) {
        isType = listPriceData.type;
        // delete listPriceData.type;
      }
      for (var x in listPriceData) {
        var start = end;
        if (x === 'type') {
          continue;
        }
        /* if(x === 'indexData' && !isZs){
                continue;
              }
              if(x === 'StockData' && isZs && ('indexData' in listPriceData)){
                continue;
              } */
        if (x === 'StockData' || x === 'indexData') {
          addBkzs++;
          if (addBkzs == 1) {
            addBkStart = start;
          }
          if (addBkzs == 2) {
            end = addBkStart;
          }
          if (num) {
            struct[t] = {};
          } else {
            struct[x] = {};
          }
          for (var j = 0; j < listPriceData[x].length; j++) {
            var netlistPriceData = listPriceData[x][j];
            for (var k in netlistPriceData) {
              if ((t == 0 && k == 'isone') || (t > 0 && ('isone' in netlistPriceData))) {
                continue;
              }
              var start = end;
              end = start + parseInt(netlistPriceData[k]);
              if (num && num > 0) {
                struct[t][k] = dataStream.readint(stream.slice(start, end));
              } else {
                struct[x][k] = dataStream.readint(stream.slice(start, end));
              }
            }
          }
          continue;
        } else {
          end = start + parseInt(listPriceData[x]);
          if (isType === 0) {
            if (listPriceData[x] === 1) {
              struct[x] = stream[start];
              continue;
            }
            struct[x] = dataStream.readint(stream.slice(start, end));
          } else if (isType === 2) {
            struct[x] = dataStream.getFloat(stream.slice(start, end));
          } else {
            if (abase64.indexOf(i.toString()) > -1) {
              struct[x] = stream;
            } else {
              struct[x] = dataStream.bin2String(stream.slice(start, end));
            }
          }
        }
      }
    }
  }
  // console.log(struct,1);
  return struct;
};
const TkLineHead = function (pTNewPriceData, NEWMARKETNO) {
  var struct = setTNewPriceData(pTNewPriceData, NEWMARKETNO, 'TkLineHead');
  var unit = Math.pow(10, (struct.Units || 0));
  var pot = struct.total_size || 0;
  var obj = {
    StockName: struct.StockName, // 股票名称
    HighPrice: struct.HighPrice, // 最高util.toDecimal2(struct.HighPrice/unit,pot)
    LowPrice: struct.LowPrice, // 最低util.toDecimal2(struct.LowPrice/unit,pot)
    WeekUp: util.toDecimal2(struct.WeekUp / 100, pot) + '%', // 周涨幅
    MonthUp: util.toDecimal2(struct.MonthUp / 100, pot) + '%', // 月涨幅
    Units: struct.Units, // 单位
    WFSY: struct.WFSY, // 万份收益，单位元
    QRNH: util.toDecimal2(struct.QRNH / 100000, pot) + '%', // 七日年华收益率
    m: struct.m, // 流通盘
    total_size: struct.total_size // 小数点位数
  };
  return obj;
};
// 解析分时头部数据
const TNewBinData = function (pTNewPriceData, NEWMARKETNO) {
  var struct = setTNewPriceData(pTNewPriceData, NEWMARKETNO, 'TNewBinData');
  var unit = Math.pow(10, (struct.Units || 0));
  var pot = struct.total_size || 0;
  var obj = {
    StockName: struct.StockName, // 股票名称
    Units: struct.Units, // 单位
    total_size: struct.total_size, // 小数点位数
    close_p: struct.close_p,
    m: struct.m, // 流通盘
    Open_p: struct.Open_p,//开盘价
    Consult: struct.Consult, //取最小值
    is_rest: struct.is_rest, //是否重置分时图，第二天开盘需重置
    Last_h: struct.Last_h,
    max_p: struct.max_p//现手
  };
  return obj;
};
// 解析分时数据
/*
 * @pTNewPriceData 二进制数据流    Y
 * @NEWMARKETNO    新市场号        Y
 * @num            共有多少条数据   Y
 * @units          单位            N
 * @size           保留小数位       N
 * */
const TkLineData = function (pTNewPriceData, NEWMARKETNO, num, units, size, VOLUME) {
  var struct = setTNewPriceData(pTNewPriceData, NEWMARKETNO, 'TkLineData', num);
  var i = 0, ln = struct.length;
  if (!VOLUME || VOLUME == 0 || VOLUME == '') {
    VOLUME = 1;
  }
  var total = [];
  for (i; i < ln; i++) {
    var ClosePrice = struct[i].ClosePrice;
    var HighPrice = struct[i].HighPrice;
    var LowPrice = struct[i].LowPrice;
    var OpenPrice = struct[i].OpenPrice;

    /* if(units){
      var unit   = Math.pow(10,(units));
      ClosePrice = ClosePrice/unit;
      HighPrice  = HighPrice/unit;
      LowPrice   = LowPrice/unit;
      OpenPrice  = OpenPrice/unit;
    }
    if(size){
      ClosePrice = util.toDecimal2(ClosePrice,size);
      HighPrice  = util.toDecimal2(HighPrice,size);
      LowPrice   = util.toDecimal2(LowPrice,size);
      OpenPrice  = util.toDecimal2(OpenPrice,size);
    } */
    struct[i]['ClosePrice'] = ClosePrice;
    struct[i]['HighPrice'] = HighPrice;
    struct[i]['LowPrice'] = LowPrice;
    struct[i]['OpenPrice'] = OpenPrice;
    struct[i]['Total_h'] *= VOLUME;
    total.push(struct[i]['Total_h']);
  }
  var max = Math.max.apply({}, total);
  return { struct: struct, total: total, total_max: max };
  // return struct;
};
//解析分时图数据
const TNewMinData = function (pTNewPriceData, NEWMARKETNO, num, units, size, VOLUME) {
  var struct = setTNewPriceData(pTNewPriceData, NEWMARKETNO, 'TNewMinData', num);
  var i = 0, ln = struct.length;
  if (!VOLUME || VOLUME == 0 || VOLUME == '') {
    VOLUME = 1;
  }
  var total = [];
  for (i; i < ln; i++) {
    var Last_p = struct[i].Last_p;
    var averprice = struct[i].averprice;
    struct[i]['Last_p'] = Last_p;
    struct[i]['averprice'] = averprice;
    total.push(struct[i]['Total_h']);
  }
  var max = Math.max.apply({}, total);
  return { struct: struct, total: total, total_max: max };
};
export default {
  setTNewPriceData: setTNewPriceData,
  // getDivByDecimal: getDivByDecimal,
  // WTHead: WTHead,
  // BINHead: BINHead,
  // TIMEHead: TIMEHead,
  TNewMinData: TNewMinData,
  TNewBinData: TNewBinData,
  TkLineHead: TkLineHead,
  TkLineData: TkLineData
  // TkLineData: TkLineData,
  // DetailedData: DetailedData,
  // thePriceData: thePriceData,
  // dayQuoteAdd: dayQuoteAdd
};
