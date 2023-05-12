/* eslint-disable */
// 强制保留pos位小数
import symbolBuy9 from '$assets/newProduct/customerPortrait/symbolBuy9.png';
import symbolSale9 from '$assets/newProduct/customerPortrait/symbolSale9.png';
import symbolCom from '$assets/newProduct/customerPortrait/symbolCom.png';
import symbolBuy from '$assets/newProduct/customerPortrait/buy_down_line.png';
import symbolSale from '$assets/newProduct/customerPortrait/sale_down_line.png';

const toDecimal2 = (x, poss) => {
  const pos = poss || 0;
  const fs = parseFloat(+x);
  if (Number.isNaN(fs)) {
    return x;
  }
  const f = Math.round(x * (10 ** pos)) / (10 ** pos);
  let s = f.toString();
  let rs = s.indexOf('.');

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
    s = Number(s).toFixed(2);
  }
  return s;
};

// 数据格式化
export default {
  // K线转换强制保留pos位小数
  kLineFn(kLineHead, kLineData) {
    const unit = kLineHead.Units || 0;
    const units = 10 ** unit;
    const totalSize = kLineHead.total_size;
    const listData = [];

    for (let i = 0; i < kLineData.length; i++) {
      const klineArr = [];
      klineArr.push(kLineData[i].Time);
      klineArr.push(toDecimal2(kLineData[i].OpenPrice / units, totalSize));
      klineArr.push(toDecimal2(kLineData[i].ClosePrice / units, totalSize));
      klineArr.push(toDecimal2(kLineData[i].LowPrice / units, totalSize));
      klineArr.push(toDecimal2(kLineData[i].HighPrice / units, totalSize));

      listData.push(klineArr);
    }

    return listData;
  },

  /**
   * X轴数据
   * @param {*} listKline
   * @returns {Array}
   */
  XAxisData(listKline) {
    // X轴数据
    const xData = [];
    // 循环
    for (let i = 0; i < listKline.length; i++) {
      // 日k时间
      const KlineTime = `${listKline[i][0]}`;
      // 日K拼接
      const KlineTimeSplicing = `${KlineTime.substring(0, 4)}/${KlineTime.substring(4, 6)}/${KlineTime.substring(6, 8)}`;
      // 添加数组
      xData.push(KlineTimeSplicing);
    }
    return xData;
  },
  /**
   *
   * @param {*} klineArrData
   * 标记信号点
   */
  calcNine(klineArrData, bsType, busiDate, checkAdvert) {
    const kLineDataList = klineArrData;
    // 格式化日K时间
    for (let i = 0; i < klineArrData.length; i++) {
      // 日k时间
      const KlineTime = `${klineArrData[i][0]}`;
      // 日K拼接
      kLineDataList[i][0] = `${KlineTime.substring(0, 4)}/${KlineTime.substring(4, 6)}/${KlineTime.substring(6, 8)}`;
    }
    const symbolSize = [26, 26];
    const fontSize = 10;
    const fontWeight = 'normal';
    const valueXPosition = 10;
    const valueYPosition = 8;

    let riseCount = 0;
    let fallCount = 0;
    let result = [];
    let signalListUp = [];
    const signalListDown = [];
    const buyOrSaleList = [];

    let middleDate = '';
    let buyOrSalePoint = {};
    let buyOrSaleUrl = '';
    let symbol9Url = '';
    if (busiDate) {
      middleDate = busiDate.replace(/-/g, '/');
    }
    // 买入情况
    if (bsType && (bsType === 1 || bsType === '1')) {
      buyOrSaleUrl = symbolBuy;
      symbol9Url = symbolBuy9;
    } else {
      buyOrSaleUrl = symbolSale;
      symbol9Url = symbolSale9;
    }
    for (let k = 0; k < klineArrData.length; k++) {
      if (middleDate === klineArrData[k][0]) {
        buyOrSalePoint = {
          symbol: `image://${buyOrSaleUrl}`,
          symbolSize: [30, 30],
          symbolKeepAspect: true,
          symbolOffset: [0, '50%'],
          // name: '',
          value: '',
          coord: [`${klineArrData[k][0]}`, `${klineArrData[k][3]}`],
          label: {
            show: false,
          },
        };
        buyOrSaleList.push(buyOrSalePoint);
      }
    }
    for (let i = 4; i < klineArrData.length; i++) {
      const currentKlineItem = klineArrData[i];
      const beforeKlineItem = klineArrData[i - 4];
      // 收盘价
      if ((currentKlineItem[2] - beforeKlineItem[2]) > 0) {
        riseCount += 1;
        fallCount = 0;
      } else if ((currentKlineItem[2] - beforeKlineItem[2]) < 0) {
        riseCount = 0;
        fallCount += 1;
      } else {
        riseCount = 0;
        fallCount = 0;
      }
      if (riseCount === 9) {
        riseCount = 0;

        // 上涨 8或9的最高价是要大于6或7的最高价
        if ((currentKlineItem[4] - klineArrData[i - 3][4] > 0 || currentKlineItem[4] - klineArrData[i - 2][4]) > 0
          || (klineArrData[i - 1][4] - klineArrData[i - 3][4] > 0 || klineArrData[i - 1][4] - klineArrData[i - 2][4] > 0)) {
          let signalConfigUp = {};
          for (let j = 0; j < i && j < 9; j++) {
            signalConfigUp = {
              symbol: `image://${symbolCom}`,
              symbolSize,
              symbolKeepAspect: true,
              symbolOffset: [0, -20],
              name: '',
              coord: [`${klineArrData[i - j][0]}`, `${klineArrData[i - j][4]}`],
              value: 9 - j,
              label: {
                position: [valueXPosition, valueYPosition],
                fontSize,
                color: '#A77600',
                verticalAlign: 'middle',
                fontWeight,
                fontFamily: 'PingFangSC-Semibold',
              },
            };
            if (j === 0) {
              signalConfigUp.symbol = `image://${symbol9Url}`;
              signalConfigUp.coord = [`${currentKlineItem[0]}`, `${currentKlineItem[4]}`];
              signalConfigUp.symbolOffset = [0, -12];
              signalConfigUp.symbolKeepAspect = true;
              signalConfigUp.symbolSize = [24, 25];
              signalConfigUp.value = '';
              signalConfigUp.label.show = false;
            }
            signalListUp.push(signalConfigUp);
          }
        } else {
          riseCount = 8;
        }
      }
      if (fallCount === 9) {
        fallCount = 0;
        // 下跌
        if ((currentKlineItem[3] - klineArrData[i - 3][3] < 0 || currentKlineItem[3] - klineArrData[i - 2][3] < 0)
          || (klineArrData[i - 1][3] - klineArrData[i - 3][3] < 0 || klineArrData[i - 1][3] - klineArrData[i - 2][3] < 0)) {
          let signalConfigDown = {};
          for (let j = 0; j < 9; j++) {
            signalConfigDown = {
              symbol: `image://${symbolCom}`,
              symbolSize,
              symbolKeepAspect: true,
              symbolOffset: [-1, -12],
              coord: [`${klineArrData[i - j][0]}`, `${klineArrData[i - j][4]}`],
              value: 9 - j,
              label: {
                position: [valueXPosition, valueYPosition],
                fontSize,
                color: '#A77600',
                verticalAlign: 'middle',
                fontWeight,
                fontFamily: 'PingFangSC-Semibold',
              },
            };
            if (j === 0) {
              signalConfigDown.symbol = `image://${symbol9Url}`;
              signalConfigDown.coord = [`${currentKlineItem[0]}`, `${currentKlineItem[4]}`];
              signalConfigDown.symbolOffset = [0, -12];
              signalConfigDown.symbolKeepAspect = true;
              signalConfigDown.symbolSize = [24, 25];
              signalConfigDown.value = '';
              signalConfigDown.label.show = false;
            }
            signalListDown.push(signalConfigDown);
          }
        } else {
          fallCount = 8;
        }
      }
    }
    let signalData = [];
    // 匹配非神奇九转广告位
    if (!checkAdvert) {
      signalData = (bsType === 1 || bsType === '1') ? [...buyOrSaleList] : [...buyOrSaleList];
    } else {
      signalData = (bsType === 1 || bsType === '1') ? [...signalListDown, ...buyOrSaleList] : [...signalListUp, ...buyOrSaleList];
    }
    result = signalData.filter((item) => item);
    return result;
  },
};
