import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { Button, Col, Row, Select } from 'antd';
// import CustomerSelectTimeBar from './Components/CustomerSelectTimeBar';
import CustomerInvestRadar from './Components/CustomerInvestRadar';
import CustomerInvestCard from './Components/CustomerInvestCard';
import CustomerInvestChart from './Components/CustomerInvestChart';
import CustomerRiskControlInnerCard from './Components/CustomerRiskControlInnerCard';
// import SingleBar from './Components/SingleBar';
import * as API from '$services/newProduct';
import styles from './index.less';
import profitAbilityHeader from '$assets/newProduct/customerPortrait/profit-ability-header.png';
import questionMark from '$assets/newProduct/customerPortrait/question-mark.png';
import riskControl from '$assets/newProduct/customerPortrait/risk-control.png';
import warehouseManage from '$assets/newProduct/customerPortrait/warehouse-manage.png';
import stopLoss from '$assets/newProduct/customerPortrait/stop-loss.png';
import assetSelection from '$assets/newProduct/customerPortrait/asset-selection.png';
import bluePoint from '$assets/newProduct/customerPortrait/invest-blue-point.png';
import brownPoint from '$assets/newProduct/customerPortrait/invest-brown-point.png';

const percent = (num) => {
  const ope = num > 0 ? '' : '';
  /* if (Math.floor(num * 100) === num * 100) {
    return `${ope}${(num * 100)}%`;;
  } else { */
  return `${ope}${(num * 100).toFixed(2)}%`;
  // }
};

class CustomerInvestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // cusCode: '',
      // hasShowBlueBubble1: false,
      // hasShowBlueBubble2: false,
      // computeDate: '',
      // profit: {},
      // // 风险控制能力
      // riskControl: {},
      // // 仓位管理能力
      // posManage: {},
      // // 止盈止损能力
      // posClose: {},
      // // 资产选择能力
      // selection: {},
      // // 风险投资能力评价方案
      // riskAssess: '',
      // // 仓位管理能力评价方案
      // manageAssess: '',
      // // 止盈止损能力评价方案
      // closeAssess: '',
      // // 资产选择能力评价方案
      // selectionAssess: '',
      // stoplossDateStart: '',
      // stoplossDateEnd: '',
      // warehouseDateStart: '',
      // warehouseDateEnd: '',
      // riskControlDateStart: '',
      // riskControlDateEnd: '',
      // history: {},
      // indexAreaLow: 0,
      // indexAreaHigh: 0,
      // lastDate: '',
      // lastPosition: '',
      // lastPrice: 0,

      time: this.props.time, // 选择时间
    };
    if (props.getInstance) {
      props.getInstance(this);
    }
  }

  // 客户号
  cusCode = '';

  hasShowBlueBubble1 = false;

  hasShowBlueBubble2 = false;

  // 统计周期
  computeDate = '';

  // 盈利能力
  profit = {};

  // 风险控制能力
  riskControl = {};

  // 仓位管理能力
  posManage = {};

  // 止盈止损能力
  posClose = {};

  // 资产选择能力
  selection = {};

  // 风险投资能力评价方案
  riskAssess = '';

  // 仓位管理能力评价方案
  manageAssess = '';

  // 止盈止损能力评价方案
  closeAssess = '';

  // 资产选择能力评价方案
  selectionAssess = '';

  stoplossDateStart = '';

  stoplossDateEnd = '';

  warehouseDateStart = '';

  warehouseDateEnd = '';

  riskControlDateStart = '';

  riskControlDateEnd = '';

  history = {};

  indexAreaLow = 0;

  indexAreaHigh = 0;

  lastDate = '';

  lastPosition = '';

  lastPrice = 0;

  $refs = {};
  formatterNumber(numStr) {
    if (!numStr) {
      return '';
    }
    const num = Number(numStr.split(',').join(''));
    // 以10000为界限
    const milestome = 10000;
    if (Math.abs(num) > milestome) {
      // 数字部分
      const numPart = (num / milestome).toFixed(2);
      return `${numPart}万`;
    }
    return num.toFixed(2);
  }
  lastPositionFormat = (num) => {
    if (!num) {
      return `${num}%`;
    }
    if (Math.floor(num * 100) === num * 100) {
      return `${(num * 100)}%`;;
    } else {
      return `${(num * 100).toFixed(2)}%`;
    }
  };
  lastPriceFormat = (num) => {
    if (!num) {
      return '';
    }
    if (Math.floor(num) === num) {
      return `${(num)}`;;
    } else {
      return `${(num).toFixed(2)}`;
    }
  };

  componentDidMount() {
    const { cusCode } = this.props;
    this.cusCode = '1232541';
    if (!isEmpty(cusCode)) {
      this.cusCode = cusCode;
    }
    this.getInfoByYear(this.state.time);
    let that = this;
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      if (!(param.target.className === 'question1' || param.target.className.indexOf('ble1') !== -1)) {
        that.hasShowBlueBubble1 = false;
        that.forceUpdate();
      }
      if (!(param.target.className === 'question2' || param.target.className.indexOf('ble2') !== -1)) {
        that.hasShowBlueBubble2 = false;
        that.forceUpdate();
      }
    };

  }

  // 数字每三位加一个,
  get profitReturn() {
    const profit = this.profit;
    if (!profit.detail) {
      return '--';
    }
    const value = profit.detail.return;
    let str = '';
    let ope = value > 0 ? '' : '-';
    ope = value < 0 ? ope : '';
    const strs = value >= 0 ? value.toString().split('.') : value.toString().slice(1).split('.');
    const intNumber = strs[0].split('');
    const absValue = Math.abs(value);
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
      if (strs[1].length === 1) {
        return `${ope}${str}.${strs[1]}0`;
      }
      return `${ope}${str}.${strs[1].slice(0, 2)}`;
    }
    return `${ope}${str}.00`;
  }


  handleChange = (value) => {
    this.setState({ time: value });
    this.getInfoByYear(value);
  }

  // 获取投资日历
  queryInvestCalandar = () => {
    const map = {
      '1': '近一年',
      '2': '近两年',
      '3': '2021',
      '4': '2020',
    };
    API.QueryAnaCalendar({
      cusCode: this.cusCode,
    }).then((res) => {
      // (this.$refs.timeBar).initYearArr(res.records.yearly_report);
      this.getInfoByYear({ selectedTime: map[this.state.time] || '近一年' });
      this.forceUpdate();
    });
  }

  getInfoByYear = (timeRange) => {
    const map = {
      '1': '近一年',
      '2': '近两年',
      // '3': this.props.anaCalendar[0],
      // '4': this.props.anaCalendar[1],
    };
    this.props.anaCalendar.forEach((item, index) => {
      map[index + 3] = item;
    });
    const param = {
      cusCode: this.cusCode,
      term: '360',
    };
    // 如果不是年份
    if (map[timeRange] === '近两年') {
      param.term = '720';
    } else if (map[timeRange] === '近一年') {
      param.term = '360';
    } else {
      param.year = map[timeRange];
    }
    this.queryInvestScore(param);
    this.queryInvestDetail(param);
  }

  // 查询账户能力分数
  queryInvestScore = (param) => {
    API.QueryAnaScore(param).then((res) => {
      if (res.code > -1 && !isEmpty(res.records)) {
        this.computeDate = `${this.formatterDate(res.records.compute_begin_date)}-${this.formatterDate(res.records.compute_end_date)}`;
        this.$refs.radarChart.init(res.records);
        this.forceUpdate();
      }
    });
  }

  formatterJudgeDate(date) {
    if (!date) {
      return '';
    }
    const arr = date.split('-');
    if (arr.length === 1) {
      return arr[0];
    }
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }
  formatterDate = (date) => {
    if (!date) {
      return '';
    }
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }

  // 查询账户能力详情
  queryInvestDetail = (param) => {
    function getNum(date) {
      return Number(date.replace(/-/g, ''));
    }
    API.QueryAnaDetail(param).then((res) => {
      if (res.code > -1) {
        const resObj = res.records;
        this.profit = resObj.profit;
        this.pofitProfit(this.profit.detail.twrr, this.profit.detail.rr_market, 50);
        this.riskControl = resObj.risk_control;
        this.posManage = resObj.pos_manage;
        this.posClose = resObj.pos_close;
        this.selection = resObj.selection;
        this.history = resObj.history;
        const history = {
          ...resObj.history,
        };
        // 仓位管理最新日期
        const obj0 = history.return_rate_market[history.return_rate_market.length - 1];
        const date0 = obj0.date;
        const obj1 = history.position_user[history.position_user.length - 1];
        const date1 = obj1.date;
        this.lastDate = getNum(date0) > getNum(date1) ? date0 : date1;

        // this.lastPrice = obj0.price.toString().split('.')[0];
        // this.lastPrice = +(obj0.price).toFixed(2);
        this.lastPrice = this.lastPriceFormat(obj0.price);

        // this.lastPosition = `${(obj1.position * 100).toString().split('.')[0]}%`;
        this.lastPosition = this.lastPositionFormat(obj1.position);

        // 初始化评价方案
        this.initAssess();
        this.initRiskControlChart({
          returnRateMarket: resObj.history.return_rate_market,
          returnRateUser: resObj.history.return_rate_user,
        }, this.riskControl);
        this.initStopLossChart({
          returnRateMarket: resObj.history.return_rate_market,
          returnRateUser: resObj.history.return_rate_user,
        });
        this.initWarehouseChart({
          returnRateMarket: resObj.history.return_rate_market,
          positionUser: resObj.history.position_user,
        }, history);
        this.forceUpdate();
      }
    }).catch(() => {
      /* if (mockRes.code > -1) {
        const resObj = mockRes.records;
        this.profit = resObj.profit;
        this.pofitProfit(this.profit.detail.twrr, this.profit.detail.rr_market, 50);
        this.riskControl = resObj.risk_control;
        this.posManage = resObj.pos_manage;
        this.posClose = resObj.pos_close;
        this.selection = resObj.selection;
        this.history = resObj.history;
        const history = {
          ...resObj.history,
        };
        // 仓位管理最新日期
        const obj0 = history.return_rate_market[history.return_rate_market.length - 1];
        const date0 = obj0.date;
        const obj1 = history.position_user[history.position_user.length - 1];
        const date1 = obj1.date;
        this.lastDate = getNum(date0) > getNum(date1) ? date0 : date1;
        // eslint-disable-next-line prefer-destructuring
        this.lastPrice = obj0.price.toString().split('.')[0];
        // eslint-disable-next-line prefer-destructuring
        this.lastPosition = `${(obj1.position * 100).toString().split('.')[0]}%`;
        // 初始化评价方案
        this.initAssess();
        this.initRiskControlChart({
          returnRateMarket: resObj.history.return_rate_market,
          returnRateUser: resObj.history.return_rate_user,
        }, this.riskControl);
        this.initStopLossChart({
          returnRateMarket: resObj.history.return_rate_market,
          returnRateUser: resObj.history.return_rate_user,
        });
        this.initWarehouseChart({
          returnRateMarket: resObj.history.return_rate_market,
          positionUser: resObj.history.position_user,
        }, history);
        this.forceUpdate();
      } */
    });
  }

  // 初始化评价方案
  initAssess = () => {
    // 风险管理评价方案
    const riskDic = [{
      0: '弱',
      1: '较弱',
      2: '适中',
      3: '较强',
      4: '强',
    }, {
      0: '优于大盘',
      1: '与大盘持平',
      2: '差于大盘',
    }];
    const riskDetail = this.riskControl.detail;
    // const returnTime = riskDetail.recover_days ? `，回撤恢复时长为${riskDetail.recover_days || '--'}个交易日。` : '。';
    /* this.riskAssess = `该客户的风险控制能力${riskDic[0][riskDetail.ability_lvl]}，
    最大回撤${riskDic[1][riskDetail.drawdown_vs_mkt_lvl]}${returnTime}`; */

    this.riskAssess = riskDetail.recover_days ? `该客户的风险控制能力${riskDic[0][riskDetail.ability_lvl]}，
    最大回撤${riskDic[1][riskDetail.drawdown_vs_mkt_lvl]}，回撤恢复时长为${riskDetail.recover_days}个交易日。`
      : `该客户的风险控制能力${riskDic[0][riskDetail.ability_lvl]}，
    最大回撤${riskDic[1][riskDetail.drawdown_vs_mkt_lvl]}。`;
    // 仓位管理评价方案
    const manageDic = [{
      0: '紧跟市场涨跌',
      1: '似乎与大盘无关',
      2: '与市场有些脱节',
    }, {
      0: '弱',
      1: '较弱',
      2: '适中',
      3: '较强',
      4: '强',
    }];
    const manageDetail = this.posManage.detail;
    this.manageAssess = `该客户对仓位的控制${manageDic[0][manageDetail.coefficient_lvl]}，该客户对市场变动的识别能力${manageDic[1][manageDetail.ability_lvl]}。`;
    // 止盈止损评价方案
    const closeDic = {
      0: '弱',
      1: '较弱',
      2: '适中',
      3: '较强',
      4: '强',
    };
    const closeDetail = this.posClose.detail;
    this.closeAssess = `该客户在市场上涨时，平均收益是大盘涨幅的${closeDetail.up_capture.toFixed(2)}倍，
    倍数越大止盈能力越强，该客户的止盈能力${closeDic[closeDetail.stop_profit_lvl]}；该客户在市场下跌时，
    平均收益是大盘跌幅的${closeDetail.down_capture.toFixed(2)}倍，倍数越低止损能力越强，该客户的止损能力${closeDic[closeDetail.stop_loss_lvl]}。`;
    // 止盈止损评价方案
    const selectionDic = {
      0: '弱',
      1: '较弱',
      2: '适中',
      3: '较强',
      4: '强',
    };
    const selectionDetail = this.selection.detail;
    this.selectionAssess = `该客户选择超额收益高的资产的能力${selectionDic[selectionDetail.ability_lvl]}，资产配置带来的超额收益的可能性${selectionDic[selectionDetail.ability_lvl]}`;
    this.forceUpdate();
  }

  findMinDate = (param) => {
    let min = moment().add(100, 'year').unix() * 1000;
    Object.keys(param).forEach((key) => {
      if (!isEmpty(param[key])) {
        const time = new Date(param[key][0].date).getTime();
        min = time < min ? time : min;
      }
    });
    return moment(min).format('YYYY.MM.DD');
  }

  findMaxDate = (param) => {
    let max = 0;
    Object.keys(param).forEach((key) => {
      if (!isEmpty(param[key])) {
        const time = new Date(param[key][param[key].length - 1].date).getTime();
        max = time > max ? time : max;
      }
    });
    return moment(max).format('YYYY.MM.DD');
  }

  getXpositions = (param) => {
    let xArr = [];
    Object.keys(param).forEach((key) => {
      param[key].forEach((e) => {
        if (xArr.indexOf(e[0]) === -1) {
          xArr.push(e[0]);
        }
      });
    });
    const dates = xArr.map((e) => moment(e));
    dates.sort((a, b) => a - b);
    xArr = dates.map((e) => e.format('YYYY.MM.DD'));
    return xArr;
  }

  getChartArr = (arr) => {
    return arr.map((e) => [this.formatterDate(e.date), +(e.return_rate * 100).toFixed(2)]);
  }
  getWareChartArr(arr) {
    return arr.map((e) => [this.formatterDate(e.date), e.price]);
  }


  // 生成风险控制能力卡片的折线图
  initRiskControlChart = (lines, riskControl) => {
    const returnRateMarket = this.getChartArr(lines.returnRateMarket);
    const returnRateUser = this.getChartArr(lines.returnRateUser);
    const xArr = this.getXpositions({
      returnRateMarket,
      returnRateUser,
    });
    const MAX = this.findMaxDate(lines);
    const MIN = this.findMinDate(lines);
    this.riskControlDateStart = MIN;
    this.riskControlDateEnd = MAX;
    // 回撤率起始点和终止点，账户收益曲线必定包含这两个点
    let drawDownArr = [];
    const { detail } = riskControl;
    if (detail) {
      //mock假数据
      let { drawdown_begin: drawBegin, drawdown_end: drawEnd } = detail;
      drawBegin = this.formatterDate(drawBegin);
      drawEnd = this.formatterDate(drawEnd);
      /* const drawBegin = '2021.04.01';
      const drawEnd = '2021.04.07'; */

      const beginIdx = returnRateUser.findIndex((e) => e[0] === drawBegin);
      const endIdx = returnRateUser.findIndex((e) => e[0] === drawEnd);
      //mock修改
      // drawDownArr = returnRateUser.slice(beginIdx, endIdx);
      drawDownArr = returnRateUser.slice(beginIdx, endIdx + 1);

    }
    const options = {
      grid: {
        left: 50,
        top: 10,
        right: 20,
        bottom: 25,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitNumber: 0,
        data: xArr,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,//坐标轴不在0显示,在最小值显示
          lineStyle: {
            width: 1,
            color: '#CCCCCC',
          },
        },
        axisLabel: {
          show: false,
          interval: 0,
          formatter: (param) => {
            if (param === MIN) {
              return `{minFont|${param}}`;
            }
            if (param === MAX) {
              return `{maxFont|${param}}`;
            }
            return '';
          },
          rich: {
            minFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 0, 0, 120],
            },
            maxFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 0, 0, -120],
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: 'dashed',
            color: 'rgba(0,0,0,0.1)',
          },
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 400,
          color: '#61698c',
          lineHeight: 12,
          formatter: (param) => `${param}%`,
        },
      },
      series: [{
        symbol: 'none',
        name: '账户收益',
        data: returnRateUser,
        type: 'line',
        splitNumber: 1,
        lineStyle: {
          width: 1,
          color: '#588eeb',
        },
      }, {
        symbol: 'none',
        name: '上证指数',
        data: returnRateMarket,
        type: 'line',
        splitNumber: 1,
        lineStyle: {
          width: 1,
          color: '#cca663',
        },
      },
      {
        name: '账户最大回撤率',
        type: 'line',
        symbol: 'none',
        lineStyle: {
          normal: {
            // width: window.rem2px(0.02666),
            width: 1,
            color: '#EF5A3C',
          },
        },
        areaStyle: {
          origin: 'start',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(239, 90, 60,0.5)', // 0% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(255, 255, 255,0)', // 100% 处的颜色
            }],
            global: false, // 缺省为 false
          },
        },
        data: drawDownArr,
        markPoint: {
          symbol: 'circle',
          // symbolSize: window.rem2px(0.16),
          symbolSize: 7,
          itemStyle: {
            color: '#F85332',
          },
          data: [{
            coord: drawDownArr[0],
          }, {
            //mock修改
            // coord: drawDownArr[1],
            coord: drawDownArr[drawDownArr.length - 1],
          }],
        },
      }],
    };
    this.$refs.riskControlChart.initChart(options);
    this.forceUpdate();
  }

  // 生成仓位管理能力卡片的折线图
  initWarehouseChart = (lines, history) => {
    const LOW = `${history.index_area_boundary.index_area_low}`;
    const HIGH = `${history.index_area_boundary.index_area_high}`;
    const leftYaxis = {
      min: 0,
      max: 0,
    };
    const rightYaxis = {
      min: 0,
      max: 0,
    };

    // const LOW = 0.6;
    // const HIGH = 1.5;
    const MAX = this.findMaxDate(lines);
    const MIN = this.findMinDate(lines);
    this.warehouseDateStart = MIN;
    this.warehouseDateEnd = MAX;
    const returnRateMarket = this.getWareChartArr(lines.returnRateMarket);
    const positionUser = lines.positionUser.map((e) => [this.formatterDate(e.date), +(e.position * 100).toFixed(2)]);
    // 左轴
    leftYaxis.max = Math.max.apply(undefined, positionUser.map((e) => e[1]));
    leftYaxis.max = leftYaxis.max > 100 ? leftYaxis.max + 10 : 100;
    // 右轴
    rightYaxis.min = Math.min.apply(undefined, returnRateMarket.map((e) => e[1])) - 10;
    rightYaxis.max = Math.max.apply(undefined, returnRateMarket.map((e) => e[1])) + 10;

    /* // 终点处的仓位值
    const MAX_USER_Y = positionUser.find((e) => e[0] === MAX)[1];
    // 终点处的上证指数值
    const MAX_MARKET_Y = returnRateMarket.find((e) => e[0] === MAX)[1]; */
    // 终点处的仓位值
    const MAX_USER_Y = positionUser.find((e) => e[0] === MAX) ? positionUser.find((e) => e[0] === MAX)[1] : 0;
    // 终点处的上证指数值
    const MAX_MARKET_Y = returnRateMarket.find((e) => e[0] === MAX) ? returnRateMarket.find((e) => e[0] === MAX)[1] : 0;
    const xArr = this.getXpositions({
      returnRateMarket,
      positionUser,
    });
    let minValue = Number.MIN_VALUE;
    let maxValue = Number.MAX_VALUE;
    returnRateMarket.forEach((e) => {
      minValue = e.price < minValue ? e.price : minValue;
      maxValue = e.price < maxValue ? e.price : maxValue;
    });
    positionUser.forEach((e) => {
      minValue = e.position < minValue ? e.position : minValue;
      maxValue = e.position < maxValue ? e.position : maxValue;
    });
    const options = {
      grid: {
        top: 10,
        left: 50,
        right: 50,
        bottom: 25,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
        splitNumber: 0,
        data: xArr,
        axisLine: {
          lineStyle: {
            width: 1,
            color: '#CCCCCC',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          interval: 0,
          formatter: (param) => {
            if (param === MIN) {
              return `{minFont|${param}}`;
            }
            if (param === MAX) {
              return `{maxFont|${param}}`;
            }
            return '';
          },
          rich: {
            minFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 12,
              padding: [0, 0, 0, 120],
            },
            maxFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 12,
              padding: [0, 0, 0, -120],
            },
          },
        },
      },
      yAxis: [{
        type: 'value',
        interval: (leftYaxis.max - leftYaxis.min) / 5,
        min: leftYaxis.min,
        max: leftYaxis.max,
        // interval: 1,
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: 'dashed',
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 400,
          color: '#61698c',
          lineHeight: 12,
          formatter: (param) => `${param.toFixed(0)}%`,
        },
      }, {
        type: 'value',
        interval: (rightYaxis.max - rightYaxis.min) / 5,
        min: rightYaxis.min,
        max: rightYaxis.max,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 400,
          color: '#61698c',
          lineHeight: 12,
          formatter: (param) => `${param.toFixed(0)}`,
        },
      }],
      series: [{
        name: '股票仓位',
        data: positionUser,
        type: 'line',
        splitNumber: 1,
        lineStyle: {
          width: 1,
          color: '#3A7BEC',
        },
        symbol: 'none',
        markLine: {
          type: 'dashed',
          symbol: 'none',
          data: [[{
            symbol: 'none',
            xAxis: this.warehouseDateEnd,
            yAxis: 0,
            label: {
              show: false,
            },
            lineStyle: {
              type: 'solid',
              color: '#3A7BEC',
            },
          }, {
            // symbol: 'circle',
            symbolSize: 6,
            symbol: `image://${bluePoint}`,
            xAxis: this.warehouseDateEnd,
            yAxis: MAX_USER_Y,
            label: {
              show: false,
            },
            lineStyle: {
              type: 'solid',
              color: '#3A7BEC',
            },
          }]],
        },
      }, {
        name: '上证指数',
        yAxisIndex: 1,
        symbol: 'none',
        data: returnRateMarket,
        type: 'line',
        splitNumber: 1,
        itemStyle: {
          opacity: 0,
        },
        lineStyle: {
          width: 1,
          color: '#CCA663',
        },
        markLine: {
          type: 'dashed',
          symbol: 'none',
          data: [[{
            symbol: 'none',
            xAxis: this.warehouseDateEnd,
            yAxis: rightYaxis.max,
            label: {
              show: false,
            },
            lineStyle: {
              type: 'solid',
              color: '#CCA663',
            },
          }, {
            // symbol: 'circle',
            symbolSize: 6,
            symbol: `image://${brownPoint}`,
            xAxis: this.warehouseDateEnd,
            yAxis: MAX_MARKET_Y,
            label: {
              show: false,
            },
            lineStyle: {
              type: 'solid',
              color: '#CCA663',
            },
          }], {
            yAxis: HIGH,
            label: {
              show: false,
            },
            lineStyle: {
              width: 1,
              color: '#EF5A3C',
            },
          }, {
            yAxis: LOW,
            label: {
              show: false,
            },
            lineStyle: {
              width: 1,
              color: '#FF9800',
            },
          }, {
            yAxis: rightYaxis.min,
            label: {
              show: false,
            },
            lineStyle: {
              width: 1,
              color: '#029A01',
            },
          }],
        },
        markArea: {
          data: [[{
            yAxis: rightYaxis.min,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(2, 154, 1, 0.06)', // 100% 处的颜色
                }, {
                  offset: 1, color: 'rgba(5, 202, 2, 0.1)', // 0% 处的颜色
                }],
              },
            },
          }, {
            yAxis: Number(LOW) > rightYaxis.max ? rightYaxis.max : LOW,
            /* itemStyle: {
              color: 'rgba(5, 202, 2, 0.1)',
            }, */
          }], [{
            yAxis: LOW,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(255, 152, 0, 0.06)', // 100% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255, 173, 0, 0.2)', // 0% 处的颜色
                }],
              },
            },
          }, {
            yAxis: Number(HIGH) > rightYaxis.max ? rightYaxis.max : HIGH,
            /* itemStyle: {
              color: 'rgba(255, 173, 0, 0.2)',
            }, */
          }], [{
            yAxis: Number(HIGH) > rightYaxis.min ? HIGH : rightYaxis.min,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(239, 90, 60, 0.06)', // 100% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255, 3, 0, 0.1)', // 0% 处的颜色
                }],
              },
            },
          }, {
            yAxis: rightYaxis.max,
            /* itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)',
            }, */
          }]],
        },
      }],
    };
    this.$refs.warehouse.initChart(options);
    this.forceUpdate();
  }

  // 生成止盈止损能力卡片的折线图
  initStopLossChart = (lines) => {
    //mock假数据
    /* if (lines.returnRateMarket.length > 3) {
      // eslint-disable-next-line no-param-reassign
      lines.returnRateMarket[2].tendency = 1;
      // eslint-disable-next-line no-param-reassign
      lines.returnRateMarket[3].tendency = 1;
    } */

    const MAX = this.findMaxDate(lines);
    const MIN = this.findMinDate(lines);
    this.stoplossDateStart = MIN;
    this.stoplossDateEnd = MAX;
    const returnRateMarket = this.getChartArr(lines.returnRateMarket);
    const returnRateUser = this.getChartArr(lines.returnRateUser);
    const xArr = this.getXpositions({
      returnRateMarket,
      returnRateUser,
    });
    const markArea = {
      data: [],
      silent: true,
    };
    const markLine = {
      type: 'dashed',
      symbol: 'none',
      label: {
        show: false,
      },
      data: [],
    };
    let i = 0;
    const COLORDIC = {
      // 下跌
      0: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0, color: 'rgba(5, 202, 2, 0.1)', // 0% 处的颜色
        }, {
          offset: 1, color: 'rgba(2, 154, 1, 0.06)', // 100% 处的颜色
        }],
      },
      // 震荡
      1: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0, color: 'rgba(255, 173, 0, 0.2)', // 0% 处的颜色
        }, {
          offset: 1, color: 'rgba(255, 152, 0, 0.06)', // 100% 处的颜色
        }],
      },
      // 上涨
      2: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0, color: 'rgba(255, 3, 0, 0.1)', // 0% 处的颜色
        }, {
          offset: 1, color: 'rgba(239, 90, 60, 0.06)', // 100% 处的颜色
        }],
      },
    };
    const LINECOLORDIC = {
      // 下跌
      0: 'rgb(144, 198, 129)',
      // 震荡
      1: 'rgb(246, 202, 125)',
      // 上涨
      2: 'rgb(235, 162, 140)',
    };
    while (i < lines.returnRateMarket.length) {
      const tendency = lines.returnRateMarket[i].tendency;
      //mock修改
      let markAreaBegin = returnRateMarket[i][0];
      if (i > 0 && lines.returnRateMarket[i - 1].tendency !== tendency) {
        // eslint-disable-next-line prefer-destructuring
        markAreaBegin = returnRateMarket[i - 1][0];
      }

      const color = COLORDIC[tendency];
      //mock修改
      // const endIdx = lines.returnRateMarket.slice(i, lines.returnRateMarket.length - 1).findIndex((e) => e.tendency !== tendency);
      let endIdx = lines.returnRateMarket.slice(i, lines.returnRateMarket.length - 1).findIndex((e) => e.tendency !== tendency);
      endIdx = endIdx === -1 ? -1 : endIdx + i;

      const areaArr = [{
        //mock修改
        // xAxis: returnRateMarket[i][0],
        xAxis: markAreaBegin,
        // xAxis: returnRateMarket[i].date,
        silent: true,
        itemStyle: {
          color,
        },
      }, {
        silent: true,
        // xAxis: '0',
        xAxis: endIdx !== -1 ? returnRateMarket[endIdx - 1][0] : returnRateMarket[returnRateMarket.length - 1][0],

        itemStyle: {
          color,
        },
      }];
      const line = {
        // xAxis: returnRateMarket[i][0],
        xAxis: markAreaBegin,
        lineStyle: {
          color: LINECOLORDIC[tendency],
        },
      };
      //mock修改
      /* let j = i;
      for (; j < lines.returnRateMarket.length; j++) {
        if (lines.returnRateMarket[j].tendency !== tendency) {
          break;
        }
      }
      i = j; */
      i = endIdx;
      // areaArr[1].xAxis = returnRateMarket[j - 1][0];
      markArea.data.push(areaArr);
      markLine.data.push(line);
      //mock修改
      if (endIdx === -1) {
        i = lines.returnRateMarket.length + 1;
      }

    }
    const options = {
      grid: {
        left: 50,
        top: 10,
        right: 20,
        bottom: 25,
      },
      xAxis: {
        type: 'category',
        show: true,
        boundaryGap: false,
        data: xArr,
        // splitNumber: 0,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            width: 1,
            color: '#CCCCCC',
          },
        },
        axisLabel: {
          show: false,
          interval: 0,
          label: {
            interval: 0,
            formatter: (param) => {
              if (param === MIN) {
                return `{minFont|${param}}`;
              }
              if (param === MAX) {
                return `{maxFont|${param}}`;
              }
              return ' ';
            },
            rich: {
              minFont: {
                fontSize: 12,
                fontWeight: 400,
                color: '#61698c',
                // lineHeight: 29,
                padding: [0, 0, 0, 60],
              },
              maxFont: {
                fontSize: 12,
                fontWeight: 400,
                color: '#61698c',
                // lineHeight: 29,
                padding: [0, 0, 0, -60],
              },
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false, //y轴线消失
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: 'dashed',
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 400,
          color: '#61698c',
          // lineHeight: 60,
          formatter: (param) => `${param}%`,
        },
      },
      series: [{
        name: '账户收益',
        data: returnRateUser,
        type: 'line',
        splitNumber: 1,
        lineStyle: {
          width: 1,
          color: '#588eeb',
        },
        itemStyle: {
          opacity: 0,
        },
      }, {
        name: '上证指数',
        data: returnRateMarket,
        type: 'line',
        splitNumber: 1,
        lineStyle: {
          width: 1,
          color: '#cca663',
        },
        itemStyle: {
          opacity: 0,
        },
        markLine,
        markArea,
      }],
    };
    (this.$refs.stopLoss).initChart(options);
    this.forceUpdate();
  }

  showBlueBubble1 = () => {
    this.hasShowBlueBubble1 = !this.hasShowBlueBubble1;
    this.forceUpdate();
  }

  showBlueBubble2 = () => {
    this.hasShowBlueBubble2 = !this.hasShowBlueBubble2;
    this.forceUpdate();
  }

  pofitProfit = (ceLis, dpLis, marked = 50) => {
    const ceLi = Number(ceLis);
    const dpLi = Number(dpLis);
    const sLine = document.querySelectorAll('.s-line');
    let totalTrend;
    if (sLine.length > 0) {
      const numArray = [ceLi, dpLi]; /* 把值组成数组 */
      const trendMax = Math.max(Math.abs(ceLi), Math.abs(dpLi)); /* 获取最大值 */
      const trendMin = Math.min(ceLi, dpLi); /* 获取最小值 */
      const profitItem = document.querySelectorAll('.asset_total_graph li');
      const figure = document.querySelectorAll('.asset_total_graph li figure');
      /* 循环显示数据 */
      for (let i = 0; i < numArray.length; i++) {
        /* 判断百分度的数值以及确定灰线的位置 */
        (sLine[i]).style.left = `${marked}%`;
        /* 最大值都大于0与最小值大于等于0时 */
        if (trendMax > 0 && trendMin >= 0) {
          totalTrend = Math.abs(trendMax);
        }
        /* 最大值都小于等于0与最小值小于0时 */
        if (trendMax <= 0 && trendMin < 0) {
          totalTrend = Math.abs(trendMin);
        }
        /* 最大值与最小值都等于0时 */
        if (trendMax === 0 && trendMin === 0) {
          totalTrend = Math.abs(trendMin);
        }

        /* 最大值都大于0与最小值小于0时 */
        if (trendMax > 0 && trendMin < 0) {
          /* 当整个图表既有正数，又有负数时，百分百为最大的正数和最小的负数绝对值之和 */
          totalTrend = Math.abs(trendMax);
        }
        if (numArray[i] < 0) {
          /* 数据为负数时添加的class */
          profitItem[i].className = styles.pro_loss;
          if (marked !== 0) {
            /* 获取为数值为负数时的定位 */
            (figure[i]).style.right = `${100 - marked}%`;
            (figure[i]).style.left = '';
          } else {
            (figure[i]).style.right = '0';
            (figure[i]).style.left = '';
          }
        } else if (numArray[i] >= 0) {
          /* 数据为正数和0时添加的class */
          profitItem[i].className = styles.pro_win;
          if (marked !== 0) {
            /* 当整个图表既有正数，又有负数时，百分百为最大的正数和最小的负数绝对值之和 */
            if (marked === 100) {
              (figure[i]).style.left = `${100 - marked}%`;
              (figure[i]).style.right = '';
            } else {
              (figure[i]).style.left = `${marked}%`;
              (figure[i]).style.right = '';
            }
          } else {
            (figure[i]).style.right = `${marked}%`;
            (figure[i]).style.left = '';
          }
        }
        // /* 长方形的高度占多少百分比 */
        if (numArray[i] === 0) {
          (figure[i]).style.width = '2px';
        } else if (totalTrend !== undefined) {
          const num1 = Number(parseFloat((Math.abs(numArray[i]) / totalTrend).toString()).toFixed(11));
          (figure[i]).style.width = `${num1 * 50}%`;
        }
      }
    }
    this.forceUpdate();
  }

  render() {
    return (
      <Scrollbars autoHide style={{ height: '800px' }} ref={el => this.scrollRef = el}>
        <div id='customerInvestDetailModal' className={styles.customerInvestDetail}>
          {/* <CustomerSelectTimeBar
            ref={el => this.$refs.timeBar = el}
            className={styles.customerSelectTimeBar}
            title="每周五更新"
            getInfo={this.getInfoByYear}
          >
            <span className={styles.title}>
          每周末更新
            </span>
          </CustomerSelectTimeBar> */}

          <Row type='flex' align='middle' justify='space-between' style={{ background: '#fff', padding: '21px 23px 0' }}>
            <Col style={{ paddingRight: '8px' }}>统计周期：{this.computeDate}</Col>
            <Col>
              <Select optionLabelProp='title' value={this.state.time} onChange={this.handleChange} style={{ width: 152 }} dropdownClassName={styles.select}>
                <Select.Option value='2' title='近两年'>{`近两年`}</Select.Option>
                <Select.Option value='1' title='近一年'>{`近一年`}</Select.Option>
                {
                  this.props.anaCalendar.map((item, index) => {
                    if (item !== moment().format('YYYY')) return <Select.Option key={`${index + 3}`} value={`${index + 3}`} title={item}>{`${item}`}</Select.Option>;
                    return null;
                  })
                }
                {/* <Select.Option value='3' title={this.props.anaCalendar[0]}>{`${this.props.anaCalendar[0]}   (${this.props.detailDate[0]})`}</Select.Option>
                <Select.Option value='4' title={this.props.anaCalendar[1]}>{`${this.props.anaCalendar[1]}   (${this.props.detailDate[1]})`}</Select.Option> */}
              </Select>
            </Col>
          </Row>
          {/* <div className={styles.dash} /> */}
          {/* <!-- 投资能力检测 --> */}
          <div className={styles.investAbility}>
            {/* <div className={styles.investAbilityHeader}>
              <div className={styles.investAbilityHeaderMain}>
            账户投资能力检测
              </div>
              <div className={styles.investAbilityHeaderTime}>
            统计周期：{ this.computeDate }
              </div>
            </div> */}
            <CustomerInvestRadar
              ref={el => this.$refs.radarChart = el}
              className={styles.customerInvestRadar}
            />
          </div>
          {/* <!-- 盈利能力 --> */}
          <CustomerInvestCard
            headerTitle="盈利能力"
            headerDefeatNumber={this.profit.score}
            headerDefeatText={`战胜了${this.profit.rank}%的安信用户`}
            bottomText='盈利能力根据区间内客户的账户收益率排名，计算出盈利能力得分；收益越高，得分越高。'
          >
            <div name='headerIcon'>
              <img src={profitAbilityHeader} alt='' />
            </div>
            <div name='main'>
              <div className={styles.profitAbilityMainContainer}>
                <div className={styles.profitAbilityMainContainerHeader}>
                  收益金额
                </div>
                <div
                  style={{ fontSize: 24, marginBottom: 16 }}
                  className={`${styles.profitAbilityNumber}, ${this.profit.detail && this.profit.detail.return > 0 ? styles.riseColor : (this.profit.detail && this.profit.detail.return < 0 ? styles.downColor : styles.zeroColor)}`}
                >
                  {this.profitReturn}
                </div>
                <div className={styles.profitAbilityDescription}>
                  资金加权收益率
                  <img
                    onClick={this.showBlueBubble1}
                    className='question1'
                    src={questionMark}
                    alt=''
                  />
                  <span>{this.profit.detail && `${percent(this.profit.detail.mwrr)}`}</span>
                  {this.hasShowBlueBubble1 ? (
                    <div
                      className={`${styles.blueBubble1} blueBubble1`}
                    >
                      <div className={styles.buble1Top}>
                        资金加权收益率是指以投资组合在报告周期内的收益金额与最大投入本金计算出的收益率，该收益率计算方法可以避免在出现大额资金变动时，收益率与收益金额正负号不一致的情况。
                      </div>
                      <div className={styles.buble1Bottom}>
                        <div style={{ fontWeight: 'bold', color: '#1A2243' }}>
                          举个例子
                        </div>
                        T日：总资产1万元，T日收盘收益200元
                        T+1日：转出5200元
                        T+1日：总资产5000元，T+1日收盘亏损-150元
                      </div>
                      <div className={styles.buble1Bottom}>
                        收益金额=200-150=+50元
                      </div>
                      <div className={styles.buble1Bottom}>
                        资金加权收益率=50/10000=0.5%
                      </div>
                    </div>
                  ) : ''
                  }
                </div>
                <div className={styles.dash} />
                {/* <div className={styles.profitAbilityBarContainer">
                    <div className={styles.profitAbilityBarContainerLeft">
                      <div
                        className={styles.profitAbilityBarContainerLeftRow"
                        style="margin-bottom: 32px;"
                      >
                        时间加权收益率
                        <img
                          @click="showBlueBubble2"
                          src="@/assets/customerPortrait/question-mark.png"
                        >
                        <div :className={styles.['profitAbilityBarContainerRate', profit.detail&&profit.detail.twrr>0?'riseColor':'']">
                          {{ profit.detail && `${percent(profit.detail.twrr)}` }}
                        </div>
                        <div
                          v-show="hasShowBlueBubble2"
                          className={styles.blueBubble2"
                        />
                      </div>
                      <div className={styles.profitAbilityBarContainerLeftRow">
                        上证指数收益率
                        <div :className={styles.['profitAbilityBarContainerRate', profit.detail&&profit.detail.rr_market>0?'riseColor':'']">
                          {{ profit.detail && `${percent(profit.detail.rr_market)}` }}
                        </div>
                      </div>
                    </div>
                    <single-bar
                      ref="singleBar"
                      style="width: 304px;"
                    />
                  </div> */}
                <div className={styles.profit_chart}>
                  <ul className={`${styles.asset_total_graph} asset_total_graph`}>
                    <li>
                      <div className={styles.p_item_number}>
                        {/* <h4 className={styles.p_item_question}>
                          时间加权收益率
                        </h4>
                        <img
                          onClick={this.showBlueBubble2}
                          src={questionMark}
                          alt=''
                        /> */}
                        <div style={{ display: 'felx', alignItems: 'center' }} >
                          <h4 style={{ whiteSpace: 'nowrap' }}>时间加权收益率</h4>
                          <img
                            onClick={this.showBlueBubble2}
                            className='question2'
                            src={questionMark}
                            alt='' />
                        </div>
                        {this.hasShowBlueBubble2 ? (
                          <div
                            className={`${styles.blueBubble2} blueBubble2`}
                          >
                            <div className={styles.buble1Top}>
                              时间加权收益率是指每日日收益累计算出报告周期内的收益率。该收益率计算方法也叫基金净值法，是业界常用的收益率计算方法，便于对比账户收益与各基金收益情况。但是在账户资产出现大额变动时，可能出现收益金额、收益率正负号表现不一致的情况。
                            </div>
                            <div style={{ fontWeight: 'bold', color: '#1A2243' }}>
                              举个例子
                            </div>
                            <div className={styles.buble1Bottom}>
                              T日：总资产1万元，T日收盘收益200元(+2%)
                            </div>
                            <div className={styles.buble1Bottom}>
                              T+1日：转出5200元
                            </div>
                            <div className={styles.buble1Bottom}>
                              T+1日：总资产5000元，T+1日收盘亏损-150元(-3%)
                            </div>
                            <div className={styles.buble1Bottom}>
                              收益金额=200-150=+50元
                            </div>
                            <div className={styles.buble1Bottom}>
                              时间加权收益率=(1+2%)*(1-3%)-1=-1.06%
                            </div>
                          </div>
                        ) : ''
                        }
                        <p
                          className={styles.number_stock}
                          style={{ color: this.profit.detail && this.profit.detail.twrr > 0 ? ' #EF5A3C' : (this.profit.detail && this.profit.detail.twrr < 0 ? '#029A01' : '') }}
                        >
                          {/* {{ profitAbility.twrr|emptyToLeverage }}% */}
                          {this.profit.detail && `${percent(this.profit.detail.twrr)}`}
                        </p>
                      </div>
                      <figure /><i className='s-line' />
                    </li>
                    <li>
                      <div className={styles.p_item_number}>
                        <h4 style={{ whiteSpace: 'nowrap' }}>上证指数收益率</h4><p
                          className={styles.number_stock}
                          style={{ color: this.profit.detail && this.profit.detail.rr_market > 0 ? ' #EF5A3C' : (this.profit.detail && this.profit.detail.rr_market < 0 ? '#029A01' : '') }}
                        >
                          {/* {{ profitAbility.rrMarket|emptyToLeverage }}% */}
                          {this.profit.detail && `${percent(this.profit.detail.rr_market)}`}
                        </p>
                      </div>
                      <figure /><i className='s-line' />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CustomerInvestCard>
          {/* <!-- 风险控制能力 --> */}
          <CustomerInvestCard
            headerTitle="风险控制能力"
            headerDefeatNumber={this.riskControl.score}
            headerDefeatText={`战胜了${this.riskControl.rank}%的安信用户`}
            headerDialogText={this.riskAssess}
            bottomText="风险控制能力是根据区间内日夏普比率、最大回撤及收益波动率来衡量，风险控制能力越稳健，得分越高。"
          >
            <div name='headerIcon'>
              <img src={riskControl} alt='' />
            </div>
            <div name='main'>
              <CustomerInvestChart
                minDate={this.riskControlDateStart}
                maxDate={this.riskControlDateEnd}
                ref={el => { this.$refs.riskControlChart = el; }}
                className={styles.customerInvestChart}
                title="账户收益率与上证指数走势对比图"
              >
                <div name='legend'>
                  <div className={styles.legendContainer}>
                    <div
                      className={styles.legendContainerRow}
                      style={{ marginBottom: '12px' }}
                    >
                      <div
                        className={styles.legendBlock}
                        style={{ marginRight: '48px' }}
                      >
                        <div className={styles.legend} />
                          账户收益
                      </div>
                      <div
                        className={styles.legendBlock}
                        style={{ marginRight: '50px' }}
                      >
                        <div
                          className={styles.legend}
                          style={{ background: '#cca663' }}
                        />
                          上证指数
                      </div>
                      <div className={styles.legendBlock}>
                        <div
                        /* style={{ background: 'linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, rgba(239, 90, 60, 0.5) 100%)' }} */
                          className={`${styles.icon} ${styles.icon1}`}
                        />
                          账户最大回撤率
                      </div>
                    </div>
                  </div>
                </div>
                <div name='external'>
                  <div className={styles.riskControlCardContainer}>
                    <CustomerRiskControlInnerCard
                      title="最大回撤率"
                      type="bg"
                      color=' #3A7BEC'
                      levels={['稳健', '适中', '高风险']}
                      selectedLevel={this.riskControl.detail && this.riskControl.detail.drawdown_lvl}
                    >
                      <div className={styles.riskControlCardMain}>
                        <div className={styles.riskControlCardMainBlock}>
                          <div className={styles.riskControlCardMainBlockNumber}>
                            {this.riskControl.detail && `${percent(this.riskControl.detail.drawdown_market)}`}
                          </div>
                          <div className={styles.riskControlCardMainBlockSub}>
                            大盘最大回撤率
                          </div>
                        </div>
                        <div className={styles.verticalLine} />
                        <div className={styles.riskControlCardMainBlock}>
                          <div className={styles.riskControlCardMainBlockNumber}>
                            {this.riskControl.detail && `${percent(this.riskControl.detail.drawdown)}`}
                          </div>
                          <div className={styles.riskControlCardMainBlockSub}>
                            账户最大回撤率
                          </div>
                        </div>
                      </div>
                    </CustomerRiskControlInnerCard>
                    <div className={styles.riskControlCardContainerHalfRow}>
                      <CustomerRiskControlInnerCard
                        style={{ marginRight: '20px' }}
                        title="收益波动率"
                        number={this.riskControl.detail && percent(this.riskControl.detail.volatility)}
                        levels={['稳健', '适中', '高风险']}
                        color='#FF9800'
                        selectedLevel={this.riskControl.detail && this.riskControl.detail.volatility_lvl}
                      />
                      <CustomerRiskControlInnerCard
                        title="夏普比率"
                        number={this.riskControl.detail && this.riskControl.detail.sharpe}
                        levels={['较高', '适中', '较低']}
                        color=' #EF5A3C'
                        selectedLevel={this.riskControl.detail && this.riskControl.detail.sharpe_lvl}
                      />
                    </div>
                  </div>
                </div>
              </CustomerInvestChart>
            </div>
          </CustomerInvestCard>
          {/* <!-- 仓位管理能力 --> */}
          <CustomerInvestCard
            headerTitle="仓位管理能力"
            headerDefeatNumber={this.posManage.score}
            headerDefeatText={`战胜了${this.posManage.rank}%的安信用户`}
            headerDialogText={this.manageAssess}
            bottomText="根据区间内账户仓位及大盘走势计算，衡量账户的仓位与市场涨、跌的相关性；相关性越高，涨跌适应能力越强，得分越高。"
          >
            <div name='headerIcon'>
              <img src={warehouseManage} alt='' />
            </div>
            <div name='main'>
              <CustomerInvestChart
                minDate={this.warehouseDateStart}
                maxDate={this.warehouseDateEnd}
                ref={el => this.$refs.warehouse = el}
                className={styles.customerInvestChart}
                title="账户仓位及上证指数走势图"
              >
                <div name='legend'>
                  <div className={styles.legendContainer}>
                    <div
                      className={styles.legendContainerRow}
                      style={{ marginBottom: 12 }}
                    >
                      <div
                        className={styles.legendBlock}
                        style={{ marginRight: 19 }}
                      >
                        <div className={styles.legend} />
                          股票仓位（左轴）
                      </div>
                      <div className={styles.legendBlock}>
                        <div
                          className={styles.legend}
                          style={{ background: '#cca663' }}
                        />
                          上证指数（右轴）
                      </div>
                    </div>
                    <div className={styles.legendContainerRow}>
                      <span style={{ marginRight: 8 }}>
                        上证指数：
                      </span>
                      <div className={`${styles.legendBlock} ${styles.bottomAreaLegendBlock}`}>
                        <div
                          style={{ background: 'linear-gradient(360deg, rgba(255, 3, 0, 0.15) 0%, rgba(239, 90, 60, 0.06) 100%)', borderBottom: '2px dotted rgba(255, 3, 0, 0.35)' }}
                          className={`${styles.icon} ${styles.icon2}`}
                        />
                          高值区
                      </div>
                      <div className={`${styles.legendBlock} ${styles.bottomAreaLegendBlock}`}>
                        <div style={{ background: 'linear-gradient(360deg, rgba(255, 173, 0, 0.3) 0%, rgba(255, 152, 0, 0.06) 100%)', borderBottom: '2px dotted rgba(255, 173, 0, 0.5)' }} className={`${styles.icon} ${styles.icon3}`} />
                          正常区
                      </div>
                      <div className={`${styles.legendBlock} ${styles.bottomAreaLegendBlock}`}>
                        <div style={{ background: 'linear-gradient(360deg, rgba(5, 202, 2, 0.1) 0%, rgba(2, 154, 1, 0.06) 100%)', borderBottom: '2px dotted rgba(5, 202, 2, 0.4)' }} className={`${styles.icon} ${styles.icon4}`} />
                          低值区
                      </div>
                    </div>
                    <div className={styles.tooltip}>
                      <div className={styles.tooltipDate}>
                        {this.formatterJudgeDate(this.lastDate)}
                      </div>
                      <div className={styles.tootipLabel}>
                        该客户的仓位
                      </div>
                      <div className={styles.tooltipNumber}>
                        {this.lastPosition}
                      </div>
                      <div className={styles.tooltipLabel}>
                        上证指数
                      </div>
                      <div className={styles.tooltipNumber}>
                        {this.lastPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </CustomerInvestChart>
            </div>
          </CustomerInvestCard>
          {/* <!-- 止盈止损能力 --> */}
          <CustomerInvestCard
            headerTitle="止盈止损能力"
            headerDefeatNumber={this.posClose.score}
            headerDefeatText={`战胜了${this.posClose.rank}%的安信用户`}
            headerDialogText={this.closeAssess}
            bottomText="根据该客户的收益和相应的市场行情，计算账户放大市场上涨幅度（涨得比大盘好）和缩小市场下跌幅度（跌得比大盘少）的能力，综合两项能力越强，得分越高。"
          >
            <div name='headerIcon'>
              <img src={stopLoss} alt='' />
            </div>
            <div name='main'>
              <CustomerInvestChart
                ref={el => this.$refs.stopLoss = el}
                minDate={this.stoplossDateStart}
                maxDate={this.stoplossDateEnd}
                className={styles.customerInvestChart}
                title="各类行情走势下账户收益率与大盘走势对比图"
              >
                <div name='legend'>
                  <div className={styles.legendContainer}>
                    <div
                      className={styles.legendContainerRow}
                      style={{ marginBottom: 12 }}
                    >
                      <div
                        className={styles.legendBlock}
                        style={{ marginRight: 19 }}
                      >
                        <div className={styles.legend} />
                          账户收益
                      </div>
                      <div className={styles.legendBlock}>
                        <div
                          className={styles.legend}
                          style={{ background: '#cca663' }}
                        />
                          上证指数
                      </div>
                    </div>
                    <div className={styles.legendContainerRow}>
                      <span style={{ marginRight: 8 }}>
                        上证指数：
                      </span>
                      <div className={`${styles.legendBlock} ${styles.bottomAreaLegendBlock}`}>
                        <div
                          className={`${styles.icon} ${styles.icon5}`}
                          style={{ background: 'linear-gradient(90deg, rgba(255, 3, 0, 0.15) 0%, rgba(239, 90, 60, 0.06) 100%)', borderLeft: '2px dotted rgba(255, 3, 0, 0.35)' }}
                        />
                          上涨行情
                      </div>
                      <div className={`${styles.legendBlock} ${styles.bottomAreaLegendBlock}`}>
                        <div style={{ background: 'linear-gradient(270deg, rgba(5, 202, 2, 0.1) 0%, rgba(2, 154, 1, 0.06) 100%)', borderLeft: '2px dotted rgba(5, 202, 2, 0.4)' }} className={`${styles.icon} ${styles.icon6}`} />
                          下跌行情
                      </div>
                      <div className={`${styles.legendBlock} ${styles.bottomAreaLegendBlock}`}>
                        <div style={{ background: 'linear-gradient(90deg, rgba(255, 173, 0, 0.3) 0%, rgba(255, 152, 0, 0.06) 100%)', borderLeft: '2px dotted rgba(255, 173, 0, 0.5)' }} className={`${styles.icon} ${styles.icon7}`} />
                          震荡行情
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- <template v-slot:bottomDate>
                    <div className={styles.bottomDate">
                      <div className={styles.date">
                        {{ stoplossDateStart }}
                      </div>
                      <div className={styles.date">
                        {{ stoplossDateEnd }}
                      </div>
                    </div>
                  </template> --> */}
              </CustomerInvestChart>
            </div>
          </CustomerInvestCard>
          {/* <!-- 资产选择能力 --> */}
          <CustomerInvestCard
            headerTitle="资产选择能力"
            headerDefeatNumber={this.selection.score}
            headerDefeatText={`战胜了${this.selection.rank}%的安信用户`}
            headerDialogText={this.selectionAssess}
            bottomText="现代金融理论认为，投资收益可以看作两部分之和，第一部分是穿越牛熊、独立于大盘的超额回报，
              即来自于资产选择的收益（alpha相关）；第二部分是跟着大盘起伏的贝塔（beta相关）收益，alpha排名越高，得分越高。"
          >
            <div name='headerIcon'>
              <img src={assetSelection} alt='' />
            </div>
            <div name='main'>
              <div className={styles.assetContainer}>
                <div className={styles.assetBlock}>
                  来自大盘的收益
                  <div className={styles.assetNumber, this.selection.detail && this.selection.detail.return_from_market > 0 ?
                    styles.riseColor : (this.selection.detail && this.selection.detail.return_from_market === 0 ? styles.zeroColor : '')}>
                    {this.selection.detail && percent(this.selection.detail.return_from_market)}
                  </div>
                </div>
                <div className={styles.verticalLine} />
                <div className={styles.assetBlock}>
                  来自资产选择的收益
                  <div className={styles.assetNumber} style={{
                    color: this.selection.detail && this.selection.detail.alpha === 0 ? ' #333' :
                      (this.selection.detail && this.selection.detail.alpha > 0 ? ' #EF5A3C' : ''),
                  }}>
                    {this.selection.detail && percent(this.selection.detail.alpha)}
                  </div>
                </div>
              </div>
              <div className={styles.horizonLine} />
            </div>
          </CustomerInvestCard>
        </div>
      </Scrollbars >
    );
  }
}

export default CustomerInvestDetail;
