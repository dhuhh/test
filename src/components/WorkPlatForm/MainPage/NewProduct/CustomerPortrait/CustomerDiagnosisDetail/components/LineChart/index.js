import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { QueryStockTrendChart, QueryStockKLine } from '$services/newProduct';
import tztTechObjBaseOperation from '../../utils/tztTechObjBaseOperation';
import FormattingData from '../../utils/FormattingData';
import KlineDiagram from '../../utils/KlineDiagram';
import buy from '$assets/newProduct/customerPortrait//buy_top.png';
import sell from '$assets/newProduct/customerPortrait/sell_top.png';
import redPoint from '$assets/newProduct/customerPortrait/red_point.png';
import redBuy from '$assets/newProduct/customerPortrait/buy.png';
import bluePoint from '$assets/newProduct/customerPortrait/blue_point.png';
import blueSell from '$assets/newProduct/customerPortrait/sell.png';
import buy9 from '$assets/newProduct/customerPortrait/buy9.png';
import sell9 from '$assets/newProduct/customerPortrait/sell9.png';
import styles from './index.less';
let echarts = require('echarts/lib/echarts');

export default class index extends Component {
  state = {
    listData: [],
    timePointStart: '',
    timePointEnd: '',
    pointIndex: 0,
    needData: [],
    drawData: [],
    hangQingData: {},
    timeAxis: [],
    timeOther: '',
  }
  $refs = {}
  componentDidMount() {
    if (this.props.type === 'avg_chg_stk') {
      const maxCount = this.getKlineDays();
      const param = {
        stockCode: this.props.chartData.other.secu_code,
        stockIndex: 0,
        // maxCount: 60,
        maxCount,
      };
      this.queryKLineData(param);
    } else if (this.props.type === 'cptl_avl') {
      this.initCptAvlChart();
    } else if (this.props.type === 'in_day') {
      const others = this.props.chartData.other;
      this.requestTimeShareData(
        others.busi_date,
        others.secu_code,
        others.market,
      );
    } else {
      this.initLineChart();
    }
  }

  // 日k线图 获取busi_date前二十天的日期距离今天多少天。作为maxCount(显示多少个日期的股票数据)
  getKlineDays() {
    const { busi_date: busiDate } = this.props.chartData.other;
    const targetMoment = moment(busiDate).subtract(20, 'day');
    const targetTime = targetMoment.valueOf();
    const targetDate = targetMoment.format('YYYY.MM.DD');
    // 当前时间距离目标时间有多少毫秒
    const gap = new Date().getTime() - targetTime;
    let gapDays = gap / (1000 * 60 * 60 * 24);
    gapDays = Math.ceil(gapDays);
    return gapDays;
  }

  genTimeShare(obj) {

    QueryStockTrendChart(obj).then((data0) => {
      const data = JSON.parse(data0.records);
      if (data.ERRORNO === 0) {
        const oData = data.oData || {};
        const TNewMinData = oData.TNewMinData || [];
        if (TNewMinData.length > 1) {
          this.setState({
            hangQingData: {
              TNewMinData: oData.TNewMinData,
              TNewBinData: oData.TNewBinData,
            },
          });
          this.initInDayChart();
        }
      }
    });
  }

  // genTimeShare
  requestTimeShareData(date, code, market) {
    const beginDate = moment(date).format('YYYYMMDD');
    const obj = {
      beginDate,
      stockCode: code,
      newMarketNo: market,
    };
    let ERRORNO = -1;
    // let oData = '';
    const data = {
      startPos: 0,
      // mobileCode: '($MobileCode)',
      // 时间戳
      reqno: +new Date().getTime(),
      // 请求服务器标示
      reqlinkType: 0,
      ...obj,
    };
    Object.assign(data, obj);
    QueryStockTrendChart(data).then((data0) => {
      const data1 = JSON.parse(data0.records);
      let oData0 = '';
      if (data1.ERRORNO >= 0) {
        ERRORNO = 0;
        oData0 = this.parseTimeShareData(data1);
      }
      const data2 = {
        ERRORNO,
        oData: oData0,
      };
      if (data2.ERRORNO === 0) {
        const oData = data2.oData || {};
        const TNewMinData = (oData).TNewMinData || [];
        if (TNewMinData.length > 1) {
          this.setState({
            hangQingData: {
              TNewMinData: (oData).TNewMinData,
              TNewBinData: (oData).TNewBinData,
            },
          });
          this.initInDayChart();
        }
      }
    });

  }

  // 绘制图表
  initInDayChart() {
    const chart = echarts.init((this.$refs.chart), undefined, { renderer: 'svg' });
    (chart).setOption({
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签
      },
      animation: false,
      xAxis: {
        type: 'category',
        splitArea: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: this.dealData.timeData,
      },
      yAxis: {
        min: this.dealData.yMin,
        max: this.dealData.yMax,
        show: true,
        interval: this.dealData.yAxisInterval,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      visualMap: [{
        show: false,
        dimension: 0,
        pieces: this.dealData.getColorRang,
        outOfRange: {
          color: '#3A7BEC',
        },
      }],
      series: [{
        name: '折线',
        type: 'line',
        showSymbol: false,
        markArea: {
          silent: true,
          data: [[{
            xAxis: '09:30',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#F8F8F8',
              }, {
                offset: 1,
                color: '#FFFFFF',
              }]),
            },
          }, {
            xAxis: '15:00',
          }]],

        },
        lineStyle: {
          normal: {
            width: 1,
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(195, 213, 255, 0.4)',
          }, {
            offset: 1,
            color: 'rgba(194, 214, 255, 0.2)',
          }]),

        },
        markPoint: {
          symbolSize: 4,
          data: this.dealData.markPoints,
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: {
            show: false,
            position: 'middle',
            fontSize: 14,
            color: '#959cba',
            lineHeight: 14,
            // padding: [0, 0, 0, 122],
            formatter: (param) => `{font|${param}}`,
            rich: {
              font: {
                padding: [0, 0, 0, 100],
              },
            },
          },
          data: [{
            yAxis: this.dealData.closeP,
            lineStyle: {
              color: '#ccc',
              type: 'dashed',
              opacity: 1,
              width: 1,
            },
          }],
        },
        data: this.dealData.seriesD,
      }],
    });
  }

  // 计算开始时间，结束时间段的分时
  getDateArray(startDate, time) {
    const startTime = moment(startDate, 'HH:mm').valueOf();
    const dateArray = [];
    for (let i = 0, len = time; i <= len; i++) {
      const spaces = i * 60 * 1000;
      const ss = moment(startTime + spaces).format('HH:mm');
      dateArray.push(ss);
    }
    return dateArray;
  }

  // 处理保留小数展示
  dealDigit(consult) {
    // eslint-disable-next-line
    if (consult === null || consult === undefined || consult === '') {
      return 2;
    }
    const n = consult.toString().split('.')[1].length;
    return n;
  }

  // 处理画图数据
  get dealData() {
    // y轴最高点和最低点
    let min = 0;
    let max = Number.MIN_VALUE;
    let yMin = 0;
    let yMax = 0;
    let isZQShow = false;
    let distance = 0;
    let pointColor = `image://${redPoint}`;
    let marketColor = `image://${redBuy}`;
    const markPoint = [];
    const timeAxisA = this.getDateArray('09:30', 120);
    const timeAxisB = this.getDateArray('13:01', 119);
    const timeData = timeAxisA.concat(timeAxisB);
    const data = this.state.hangQingData || {};
    if (isEmpty(data)) {
      return {};
    }
    const TNewBinData = (data).TNewBinData || {};
    const TNewMinData = (data).TNewMinData || [];
    const seriesD = [];
    const unit = TNewBinData.Units || 0;
    const units = 10 ** unit;
    const totalSize = TNewBinData.total_size;
    const consult = this.toDecimal(TNewBinData.Consult / units, totalSize);
    const closeP = this.toDecimal(TNewBinData.close_p / units, totalSize);
    const maxP = this.toDecimal(TNewBinData.max_p / units, totalSize);
    if (Number(maxP) > Number(closeP)) {
      if (closeP > consult) {
        const maxDistance = Number(maxP) - Number(closeP);
        const minDistance = Number(closeP) - Number(consult);
        if (maxDistance >= minDistance) {
          max = maxP;
          distance = Number(closeP) - (Number(maxP) - Number(closeP));
          min = Number(distance.toFixed(this.dealDigit(closeP)));
        } else {
          min = consult;
          distance = Number(closeP) + (Number(closeP) - Number(min));
          max = Number(distance.toFixed(this.dealDigit(closeP)));
        }
      } else {
        max = maxP;
        distance = Number(closeP) - (Number(maxP) - Number(closeP));
        min = Number(distance.toFixed(this.dealDigit(closeP)));
      }
    } else {
      min = consult;
      distance = Number(closeP) + (Number(closeP) - Number(min));
      max = Number(distance.toFixed(this.dealDigit(closeP)));
    }
    if (this.props.chartData.other.bstype === 2) {
      pointColor = `image://${bluePoint}`;
      marketColor = `image://${blueSell}`;
    }
    if (min === max) {
      yMin = Number(closeP) - 1;
      yMax = Number(closeP) + 1;
    } else {
      yMin = min;
      yMax = max;
    }
    this.state.timeOther = this.props.chartData.other.time;

    timeData.forEach((item, i) => {
      if (TNewMinData[i] && TNewMinData[i].Last_p !== undefined) {
        const LastP = this.toDecimal(TNewMinData[i].Last_p / units, totalSize);
        const price = Number(LastP) + Number(consult);
        seriesD.push(price);
        if (item === this.state.timeOther) {
          markPoint.push({
            xAxis: item, yAxis: price, symbolSize: 6, symbol: pointColor,
          });
          markPoint.push({
            xAxis: item, yAxis: price, symbolSize: 18, symbolOffset: [0, '64%'], symbol: marketColor,
          });
        } else if (this.state.timeOther === '13:00' && item === '13:01') {
          markPoint.push({
            xAxis: item, yAxis: price, symbolSize: 6, symbol: pointColor,
          });
          markPoint.push({
            xAxis: item, yAxis: price, symbolSize: 18, symbolOffset: [0, '64%'], symbol: marketColor,
          });
        } else if (this.timeComparison(this.state.timeOther) && item === '15:00') {
          markPoint.push({
            xAxis: item, yAxis: price, symbolSize: 6, symbol: pointColor,
          });
          markPoint.push({
            xAxis: item, yAxis: price, symbolSize: 18, symbolOffset: [0, '64%'], symbol: marketColor,
          });
        }
      }
    });
    const calcNineData = this.calcNine(seriesD, timeData);
    let getColorRang = [];
    if (calcNineData.getColorRang.length > 0) {
      isZQShow = true;
      this.props.changeShowNine();
      getColorRang = calcNineData.getColorRang;
    } else {
      isZQShow = false;
      getColorRang = [{
        gt: 0,
        lte: seriesD.length - 1,
        color: '#3A7BEC',
      }];
    }
    const markPoints = markPoint.concat(calcNineData.getPoint);
    // isZQShow = markPoints.length > 0;
    const yAxisInterval = (max - Number(min)) / 2;
    return {
      timeData,
      seriesD,
      min,
      max,
      yAxisInterval,
      markPoints,
      closeP,
      getColorRang,
      isZQShow,
      yMin,
      yMax,
    };
  }

  // 时间对比
  timeComparison(time) {
    const t1 = '15:00';
    const t2 = time || '';
    const time1 = t1.split(':');
    const time2 = t2.split(':');
    // eslint-disable-next-line no-mixed-operators
    const sj1 = Number(time1[0]) * 12 + time1[1];
    // eslint-disable-next-line no-mixed-operators
    const sj2 = Number(time2[0]) * 12 + time2[1];
    if (sj2 > sj1) {
      return true;
    }
    return false;
  }

  // 九转信号处理
  calcNine(seriesD, timeData) {
    let riseCount = 0;
    let fallCount = 0;
    const getColorRang = [];
    const getPoint = [];
    let pointColor = `image://${redPoint}`;
    let market9Color = `image://${buy9}`;
    let color = '#EF5A3C';
    if (this.props.type === 2) {
      market9Color = `image://${sell9}`;
      pointColor = `image://${bluePoint}`;
      color = '#029A01';
    }
    for (let i = 4; i < seriesD.length; i++) {
      const currentKlineItem = seriesD[i];
      const beforeKlineItem = seriesD[i - 4];
      // 收盘价
      if ((Number(currentKlineItem) - Number(beforeKlineItem)) > 0) {
        riseCount += 1;
        fallCount = 0;
      } else if ((Number(currentKlineItem) - Number(beforeKlineItem)) < 0) {
        riseCount = 0;
        fallCount += 1;
      } else {
        riseCount = 0;
        fallCount = 0;
      }
      if (riseCount === 9 && this.props.type === 2) {
        riseCount = 0;
        for (let j = 0; j < 9; j++) {
          if (j === 0) {
            getColorRang.push({
              gt: i - 8,
              lte: i,
              color,
            });
            getPoint.push({
              xAxis: timeData[i], yAxis: seriesD[i], symbolSize: 14, symbol: pointColor,
            });
            getPoint.push({
              xAxis: timeData[i], yAxis: seriesD[i], symbolSize: 14, symbolOffset: [0, '-70%'], symbol: market9Color,
            });
          }
        }
      }
      if (fallCount === 9 && this.props.type === 1) {
        fallCount = 0;
        for (let j = 0; j < 9; j++) {
          if (j === 0) {
            getColorRang.push({
              gt: i - 8,
              lte: i,
              color,
            });
            getPoint.push({
              xAxis: timeData[i], yAxis: seriesD[i], symbolSize: 14, symbol: pointColor,
            });
            getPoint.push({
              xAxis: timeData[i], yAxis: seriesD[i], symbolSize: 14, symbolOffset: [0, '-70%'], symbol: market9Color,
            });
          }
        }
      }
    }
    return {
      getPoint,
      getColorRang,
    };
  }

  formatterDate(date) {
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }

  // 绘制折线图
  initLineChart() {
    // console.log(this.props.chartData);
    const seriesData = this.props.chartData.other.market.map((e) => [this.formatterDate(e.busi_date), e.rate * 100]);
    const dates = seriesData.map((e) => e[0]);
    const MAX = dates[dates.length - 1];
    const MIN = dates[0];
    const pointImage = this.props.chartData.other.bstype === 1 ? buy : sell;
    const chart = echarts.init((this.$refs.chart), undefined, { renderer: 'canvas' });
    const option = {
      grid: {
        left: 0,
        right: 7,
        top: 10,
        bottom: 8,
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签
      },
      animation: false,
      xAxis: {
        type: 'category',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#ccc',
            type: 'solid',
            width: 1,
          },
        },
        axisTick: false,
        boundaryGap: false,
        data: dates,
        axisLabel: {
          interval: 0,
          show: true,
          // distance: -40,
          formatter: (param) => {
            if (param !== MAX && param !== MIN) {
              return ' ';
            }
            const val = param === MAX ? `{max|${param}}` : `{min|${param}}`;
            return val;
          },
          rich: {
            max: {
              fontSize: 12,
              color: '#959cba',
              padding: [0, 0, 0, -60],
            },
            min: {
              fontSize: 12,
              padding: [0, 0, 0, 60],
              color: '#959cba',
            },
          },
        },
      },
      yAxis: {
        show: true,
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: '#959cba',
          },
          formatter(yData) {
            let str = '';
            let value = yData;
            if (typeof yData === 'string') {
              value = Number(yData);
            }
            const absValue = Math.abs(value);
            const ope = value >= 0 ? '' : '-';
            const strs = value >= 0 ? value.toString().split('.') : value.toString().slice(1).split('.');
            const intNumber = strs[0].split('');
            if (absValue >= 1000) {
              const len = intNumber.length;
              for (let i = len - 1; i > -1; i--) {
                if (i !== 0 && (len - i) % 3 === 0) {
                  str = `,${intNumber[i]}${str}`;
                } else {
                  str = intNumber[i] + str;
                }
              }
            } else {
              // eslint-disable-next-line prefer-destructuring
              str = strs[0];
            }
            return `${ope}${str}`;
          },
        },
        axisLine: false,
        axisTick: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ccc',
            type: 'dashed',
            opacity: 0.5,
            width: 1,
          },
        },
      },
      series: [{
        name: '折线',
        type: 'line',
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1,
            color: '#588EEB',
          },
        },
        markPoint: {
          data: [],
        },
        // markPoint: {
        //   symbolSize: 30,
        //   data: [{
        //     name: 'a',
        //     coord: [1, 50],
        //     itemStyle: {
        //       color: '#ef5a3c',
        //     },
        //   }],
        // },
        data: seriesData,
      }],
    };
    const trdPoint = this.props.chartData.other.trd_point;
    let pointData = [];
    if (!isEmpty(trdPoint)) {
      pointData = typeof trdPoint[0].busi_date !== 'undefined' ? trdPoint.map((e) => this.formatterDate(e.busi_date))
        : trdPoint.map((e) => this.formatterDate(e));
    }
    const pointColor = this.props.chartData.other.bstype === 1 ? '#EF5A3C' : '#588EEB';
    let buyMin = 'firstPoint';
    pointData.forEach((e) => {
      seriesData.forEach((v) => {
        if (e === v[0]) {
          const date = v[0];
          const yValue = v[1];
          if (buyMin === 'firstPoint') {
            option.series[0].markPoint.data.push({
              // coord: [date, yValue],
              xAxis: date,
              yAxis: yValue,
              symbolOffset: [0, '-100%'],
              symbolSize: 18,
              symbol: `image://${pointImage}`,
            });
            buyMin = 'noFirstPoint';
          }
          buyMin = 'noFirstPoint';
          option.series[0].markPoint.data.push({
            xAxis: date,
            yAxis: yValue,
            symbolSize: 6,
            symbol: 'circle',
            itemStyle: {
              color: pointColor,
            },
          });
        }
      });
    });
    // const aoption = {
    //   xAxis: {
    //     type: 'category',
    //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //   },
    //   yAxis: {
    //     type: 'value',
    //   },
    //   series: [{
    //     data: [150, 230, 224, 218, 135, 147, 260],
    //     type: 'line',
    //   }],
    // };
    // 绘制图表
    (chart).setOption(option);
  }

  initCptAvlChart() {
    const seriesData = this.props.chartData.other.cptl_avl.map((e) => [this.formatterDate(e.date), e.capital]);
    const dates = seriesData.map((e) => e[0]);
    const MAX = dates[dates.length - 1];
    const MIN = dates[0];
    this.setState({
      timePointStart: MIN,
      timePointEnd: MAX,

    });
    // const pointImage = this.props.chartData.other.bstype === 1 ? buy : sell;
    const chart = echarts.init((this.$refs.chart), undefined, { renderer: 'svg' });
    const option = {
      grid: {
        left: 16,
        top: 30,
        bottom: 18,
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签
      },
      animation: false,
      xAxis: {
        type: 'category',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#ccc',
            type: 'solid',
            width: 1,
          },
        },
        axisTick: false,
        boundaryGap: false,
        data: dates,
        axisLabel: {
          interval: 0,
          show: false,
          distance: -40,
          label: {
            formatter: (param) => {
              if (param !== MAX && param !== MIN) {
                return ' ';
              }
              const val = param === MAX ? `{max|${param}}` : `{min|${param}}`;
              return val;
            },
            rich: {
              max: {
                fontSize: 14,
                lineHeight: 24,
                color: '#959cba',
                padding: [0, 0, 0, -120],
              },
              min: {
                fontSize: 14,
                lineHeight: 24,
                padding: [0, 0, 0, 100],
                color: '#959cba',
              },
            },
          },
        },
      },
      yAxis: {
        // min: 0,
        // max: 240,
        name: '金额（元）',
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 400,
          color: '#999',
          padding: [0, 0, 0, -25],
        },
        show: true,
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: '#959cba',
          },
          formatter(yData) {
            let str = '';
            let value = yData;
            if (typeof yData === 'string') {
              value = Number(yData);
            }
            const absValue = Math.abs(value);
            const ope = value >= 0 ? '' : '-';
            const strs = value >= 0 ? value.toString().split('.') : value.toString().slice(1).split('.');
            const intNumber = strs[0].split('');
            if (absValue >= 1000) {
              const len = intNumber.length;
              for (let i = len - 1; i > -1; i--) {
                if (i !== 0 && (len - i) % 3 === 0) {
                  str = `,${intNumber[i]}${str}`;
                } else {
                  str = intNumber[i] + str;
                }
              }
            } else {
              // eslint-disable-next-line prefer-destructuring
              str = strs[0];
            }
            return `${ope}${str}`;
          },
        },
        axisLine: false,
        axisTick: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ccc',
            type: 'dashed',
            opacity: 0.5,
            width: 1,
          },
        },
      },
      series: [{
        name: '折线',
        type: 'line',
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1,
            color: '#588EEB',
          },
        },
        markPoint: {
          data: [],
        },
        // markPoint: {
        //   symbolSize: 30,
        //   data: [{
        //     name: 'a',
        //     coord: [1, 50],
        //     itemStyle: {
        //       color: '#ef5a3c',
        //     },
        //   }],
        // },
        data: seriesData,
      }],
    };
    const pointData = [this.props.chartData.other.cptl_max, this.props.chartData.other.cptl_min];
    pointData.forEach((e) => {
      seriesData.forEach((v) => {
        const date = this.formatterDate(e.date);
        if (v[0] === date) {
          const yValue = v[1];
          if (e.capital === this.props.chartData.other.cptl_max.capital) {
            const mkPoint = {
              xAxis: date,
              yAxis: yValue,
              symbolSize: 4,
              symbol: 'circle',
              itemStyle: {
                color: '#588EEB',
              },
              label: {
                padding: [0, 0, 0, 0],
                show: true,
                position: 'top',
                // position: _this.dealData.maxPosition,
                fontSize: 14,
                color: '#588EEB',
                formatter(params) {
                  const yData = params.data.yAxis;
                  let str = '';
                  let value = yData;
                  if (typeof yData === 'string') {
                    value = Number(yData);
                  }
                  const absValue = Math.abs(value);
                  const ope = value >= 0 ? '' : '-';
                  const strs = value >= 0 ? value.toString().split('.') : value.toString().slice(1).split('.');
                  const intNumber = strs[0].split('');
                  if (absValue >= 1000) {
                    const len = intNumber.length;
                    for (let i = len - 1; i > -1; i--) {
                      if (i !== 0 && (len - i) % 3 === 0) {
                        str = `,${intNumber[i]}${str}`;
                      } else {
                        str = intNumber[i] + str;
                      }
                    }
                  } else {
                    // eslint-disable-next-line prefer-destructuring
                    str = strs[0];
                  }
                  if (strs.length > 1) {
                    return `${ope}${str}.${strs[1]}`;
                  }
                  return `${ope}${str}.00`;
                },
              },
            };
            if (date === MIN) {
              mkPoint.label.padding[3] = 80;
            }
            option.series[0].markPoint.data.push(mkPoint);
          } else {
            const mkPoint = {
              xAxis: date,
              yAxis: yValue,
              symbolSize: 4,
              symbol: 'circle',
              itemStyle: {
                color: '#588EEB',
              },
              label: {
                show: true,
                position: 'bottom',
                padding: [0, 0, 0, 0],
                // position: _this.dealData.maxPosition,
                fontSize: 14,
                color: '#588EEB',
                formatter(params) {
                  const yData = params.data.yAxis;
                  let str = '';
                  let value = yData;
                  if (typeof yData === 'string') {
                    value = Number(yData);
                  }
                  const absValue = Math.abs(value);
                  const strs = value >= 0 ? value.toString().split('.') : value.toString().slice(1).split('.');
                  const intNumber = strs[0].split('');
                  if (absValue >= 1000) {
                    const len = intNumber.length;
                    for (let i = len - 1; i > -1; i--) {
                      if (i !== 0 && (len - i) % 3 === 0) {
                        str = `,${intNumber[i]}${str}`;
                      } else {
                        str = intNumber[i] + str;
                      }
                    }
                  } else {
                    // eslint-disable-next-line prefer-destructuring
                    str = strs[0];
                  }
                  if (strs.length > 1) {
                    return `${str}.${strs[1]}`;
                  }
                  return `${str}.00`;
                },
              },
            };
            if (date === MIN) {
              mkPoint.label.padding[3] = 80;
            }
            option.series[0].markPoint.data.push(mkPoint);
          }
        }
      });
    });
    // 绘制图表
    (chart).setOption(option);
  }

  async requestKline(obj) {
    let ERRORNO = -1;
    let oData = '';
    const data = {
      action: '64',
      accountIndex: 2,
      stockNumIndex: 1,
      NewMarketNo: '0',
      // MobileCode: '($MobileCode)',
      // 时间戳
      Reqno: +new Date().getTime(),
      // 请求服务器标示
      ReqlinkType: 0,
      // 前复权
      BankDirection: 1,
    };
    Object.assign(data, obj);
    const res1 = await QueryStockKLine(data);
    const res = JSON.parse(res1.records);
    if (res.ERRORNO >= 0) {
      ERRORNO = 0;
      oData = this.parseKlineData(res);
    }
    return {
      ERRORNO,
      oData,
    };
  }

  queryKLineData(param) {
    const obj = {
      // 开始位置
      startPos: '0',
      // K线线
      // stockindex: 0,
      // maxCount: 49,
      // stockcode: this.props.chartData.other.secu_code,
      // NewMarketNo: this.props.chartData.other.zzmarket,
      ...param,
      accountIndex: 2,
      reqno: +new Date().getTime(),
      reqlinkType: 0,
      bankDirection: 1,
      stockNumIndex: 1,
      // mobileCode: mobileCode
    };
    this.requestKline(obj).then((data) => {
      // 获取日K
      this.setState({
        listData: Object.assign(
          [],
          this.listData,
          (FormattingData).kLineFn(data?.oData?.TkLineHead, data?.oData?.TkLineData),
        ),
      });
      // 基于准备好的dom，初始化echarts实例
      const myChartExample = echarts.init(this.$refs.chart,
        undefined,
        { renderer: 'svg' });
      this.drawKLine(myChartExample);

    });
  }

  splitData(rawData) {
    const categoryData = [];
    const values = [];
    for (let i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
    }
    return {
      categoryData,
      values,
    };
  }

  drawKLine(myChart) {
    const upColor = '#fff';
    const upBorderColor = '#ef5a3c';
    const downColor = '#029a01';
    const downBorderColor = '#008F28';
    this.interceptData();
    const dates = this.state.needData.map((item) => {
      let val = item.toString();
      val = `${val.substring(0, 4)}.${val.substring(4, 6)}.${val.substring(6, 8)}`;
      return val;
    });
    const MAX = dates[dates.length - 1];
    const MIN = dates[0];
    // 处理日期格式
    // 横坐标集合
    // let spacingData = KlineDiagram.graphicalxAxis(FormattingData.XAxisData(this.needData)) as any;
    let spacingData = (KlineDiagram).graphicalxAxis(this.state.needData.map((e) => e[0]));
    spacingData = {
      ...spacingData,
      type: 'category',
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#ccc',
          type: 'solid',
          width: 1,
        },
      },
      axisTick: false,
      boundaryGap: false,
      data: dates,
      axisLabel: {
        interval: 0,
        show: true,
        distance: -40,
        formatter: (param) => {
          if (param !== MAX && param !== MIN) {
            return '';
          }
          /* const val = param === MAX ? `{max|${param}}` : `{min|${param}}`;
          return val; */
        },
        rich: {
          max: {
            fontSize: 20,
            lineHeight: 24,
            color: '#959cba',
            padding: [0, 0, 0, 100],
          },
          min: {
            fontSize: 20,
            lineHeight: 24,
            padding: [0, 0, 0, 100],
            color: '#959cba',
          },
        },
      },
    };
    // echarts纵坐标轴配置
    const yAxisData = (KlineDiagram).graphicalyAxis();
    // 横纵坐标起始点
    this.setState({
      timePointStart: spacingData.data[0] ? (spacingData.data[0]).toString() : '',
      timePointEnd: spacingData.data[spacingData.data.length - 1] ? (spacingData.data[spacingData.data.length - 1]).toString() : '',
    });
    // 前多拿十一条后多拿十条数据标记信号值 pointData是买卖点和九转点的集合
    let pointData = (FormattingData)
      .calcNine(this.formatData(this.state.pointIndex, 34, 36), this.props.chartData.other.bstype, this.props.chartData.other.busi_date, true);
    // 去除多余信号值数据
    pointData = pointData.map((e) => ({
      ...e,
      coord: [e.coord[0].replace(/\//g, '.'), e.coord[1]],
    }));
    const timePointStart = Number(this.state.timePointStart.replace(/\./g, ''));
    const timePointEnd = Number(this.state.timePointEnd.replace(/\./g, ''));
    const sortSignal = pointData.filter((item) => {
      const date = Number(item.coord[0].replace(/\./g, ''));
      if (date >= timePointStart && date <= timePointEnd) {
        return true;
      }
      return false;
    });
    // todo
    // this.$emit('checkSignal', sortSignal.length);
    this.setState({
      drawData: this.splitData(this.state.needData),
    });
    // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
    const option = {
      legend: {
        data: ['日K线'],
      },
      grid: {
        left: 25,
        right: 10,
        bottom: 10,
        top: 12,
      },
      xAxis: spacingData,
      yAxis: yAxisData,
      series: [{
        name: '',
        type: 'candlestick',
        data: this.state.drawData.values,
        barMaxWidth: '10%',
        barWidth: '62%',
        itemStyle: {
          normal: {
            color: upColor,
            color0: downColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor,
            borderWidth: 1,
            label: {
              show: true,
            },
          },
        },
        visualMap: {
          calculable: false,
        },
        markPoint: {
          animation: false,
          label: {
            show: true,
            position: 'right',
            normal: {
              formatter(param) {
                return param !== undefined ? Math.round(param.value) : '';
              },
            },
          },
          data: sortSignal,
          tooltip: {
            formatter(param) {
              return `${param.name}<br>${param.data.coord || ''}`;
            },
          },
        },
      }],
    };
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

  // 前后截取四十条数据
  interceptData() {
    // 根据指定日期截取K线数据
    const originData = [...this.state.listData];
    const busiDate = this.props.chartData.other.busi_date;
    const appointDate = Number(busiDate ? busiDate.replace(/-/g, '') : '');
    // appointDate = 20210326;
    // appointDate = 20210502;
    // 获得日期是股票日期的下标
    // this.pointIndex = originData.map((item: any[], index: number) => (item.includes(appointDate) ? index : '')).filter((el: string) => el !== '')[0];
    const arr = originData.map((item, index) => {
      let val = 0;
      if (item.includes(appointDate)) {
        val = index;
      } else {
        val = '';
      }
      return val;
      // (item.includes(appointDate) ? index : '')
    });
    const arr2 = arr.filter((el) => el !== '');
    // eslint-disable-next-line
    this.setState({
      pointIndex: arr2[0],
      needData: this.formatData(arr2[0], 19, 21),
      // needData: this.state.listData,
    });
    // this.needData = this.formatData(this.pointIndex, 19, 21);
    // todo 是否显示九转信号
    // this.$emit('checkLength', this.needData.length);
  }

  // 截取数据
  formatData(pointIndex, leftLength, rightLength) {
    let sliceIndex = 0;
    if (pointIndex <= leftLength) {
      sliceIndex = 0;
    } else {
      sliceIndex = pointIndex - leftLength;
    }
    const interList = this.state.listData.slice(sliceIndex, pointIndex + rightLength);
    return interList;
  }

  // 解析k线接口返回的数据
  /* eslint-disable */
  parseKlineData(data) {
    if (!data) { // 读取 undefined/null 的属性会报错
      return undefined;
    }
    // BINDATA结构体数据解析出来 K线头数据 TkLineHead
    if (data.BINDATA) {
      // eslint-disable-next-line no-param-reassign
      data.TkLineHead = (tztTechObjBaseOperation).TkLineHead(data.BINDATA, data.NEWMARKETNO);
    }

    // GRID0结构体数据解析出来  k线数据 TkLineData
    if (data.GRID0) {
      const units = data.TkLineHead ? data.TkLineHead.Units : '0';
      const size = data.TkLineHead ? data.TkLineHead.total_size : '';
      const obj = (tztTechObjBaseOperation).TkLineData(data.GRID0[0], data.NEWMARKETNO, (data.MAXCOUNT || data.ERRORNO), units, size, data.VOLUME);

      // eslint-disable-next-line no-param-reassign
      data.TkLineData = obj.struct;
      // eslint-disable-next-line no-param-reassign
      data.total_max = obj.total_max;
      // eslint-disable-next-line no-param-reassign
      data.total_array = obj.total;
    }
    // 股票或其他非期货时，是成交金额，需要乘volume才是真正的值，期货是持仓量
    if (data.CHICANGL) {
      //
    }
    return data;
  }

  // 解析分时k线接口返回的数据
  parseTimeShareData(data) {
    if (!data) { // 读取 undefined/null 的属性会报错
      return undefined;
    }
    // BINDATA结构体数据解析出来 K线头数据 TkLineHead
    if (data.BINDATA) {
      // eslint-disable-next-line no-param-reassign
      data.TNewBinData = (tztTechObjBaseOperation).TNewBinData(data.BINDATA, data.NEWMARKETNO);
    }

    // GRID0结构体数据解析出来  k线数据 TkLineData
    if (data.GRID0) {
      const units = data.TNewBinData ? data.TNewBinData.Units : '0';
      const size = data.TNewBinData ? data.TNewBinData.total_size : '';
      const obj = (tztTechObjBaseOperation).TNewMinData(data.GRID0[0], data.NEWMARKETNO, (data.MAXCOUNT || data.ERRORNO), units, size, data.VOLUME);
      // eslint-disable-next-line no-param-reassign
      if (data.ERRORNO >= 0) {
        // data = {
        //   ...data,
        //   TNewMinData: obj.struct.slice(0, data.ERRORNO),
        // };
        // eslint-disable-next-line
        data.TNewMinData = (obj.struct).slice(0, data.ERRORNO);
      } else {
        // data = {
        //   ...data,
        //   TNewMinData: obj.struct,
        // };
        // eslint-disable-next-line
        data.TNewMinData = obj.struct;
      }
      // eslint-disable-next-line no-param-reassign
      data.total_max = obj.total_max;
      // eslint-disable-next-line no-param-reassign
      data.total_array = obj.total;
    }
    // 股票或其他非期货时，是成交金额，需要乘volume才是真正的值，期货是持仓量
    if (data.CHICANGL) {
      //
    }
    return data;
  }

  // 保留小数位
  toDecimal(x, poss) {
    const pos = poss || 0;
    // const fs = parseFloat(x);
    const fs = x;
    // if (Number.isNaN(fs)) {
    //   return x;
    // }
    const f = Math.round(fs * (10 ** pos)) / (10 ** pos);
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
    return parseFloat(s);
  }
  render() {
    let node
    if (this.props.type === 'avg_chg_stk') {
      node = <div className={styles.xAxisLine}>
        <span>{this.state.timePointStart}</span>
        <span>{this.state.timePointEnd}</span>
      </div>
    } else if (this.props.type === 'cptl_avl') {
      node = <div className={styles.xAxisLine, styles.cptlWord}>
        <span>{this.state.timePointStart}</span>
        <span>{this.state.timePointEnd}</span>
      </div>
    } else if (this.props.type === 'in_day') {
      node = <div className={styles.minute}>
        <span>9:30</span>
        <span>11:30/13:00</span>
        <span>15:00</span>
      </div>
    }
    return (
      <div className={styles.layout}>
        <div className={styles.layoutMain}>
          <div className={styles.left}>
            <p> {this.dealData.max}</p>
            <p> {this.dealData.closeP}</p>
            <p> {this.dealData.min}</p>
          </div>
          <div ref={el => this.$refs.chart = el} className={styles.chart} />
        </div>
        {node}
      </div>
    );
  }
}
