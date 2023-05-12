import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Row, Col, Icon } from 'antd';
import * as echarts from 'echarts';
import lodash from 'lodash';
import moment from 'moment';
import PopoverButton from '../Common/PopoverButton';
import MyPopover from '../Common/MyPopover';
import { formatColor, formatThousands, formatNum, clickSensors } from '../util';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import pen from '$assets/newProduct/earing/pen.png';
import vs from '$assets/newProduct/earing/vs.png';
import blue from '$assets/newProduct/earing/blue.png';
import theme from '$assets/newProduct/earing/theme.png';
import orange from '$assets/newProduct/earing/orange.png';
import styles from './index.less';

const map = {
  1: '上证指数',
  2: '沪深300',
  3: '创业板',
};

class OtherEanring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legendType: 1, // 1收益金额 | 2资产走势
      activeLegend: 1, // 1|上证指数 2|沪深300 3|创业板
    };
    this.barChart = null;
    this.lineChartOne = null;
    this.lineChartTwo = null;

    const { getInstence } = props;
    if (getInstence && typeof getInstence === 'function') {
      getInstence(this);
    }
  }

  componentDidMount() {
    // this.initChartOne();
    // this.initChartTwo();
  }

  initChartOne = () => {
    const type = this.state.legendType === 1 && (this.props.earning !== 4 || (this.props.earning === 4 && (
      (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
      || (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
      || (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
    ))) ? 'bar' : 'line';
    let yData = [];
    let xData = [];
    if (this.props.earning === 4 && this.state.legendType === 1
      && (this.props.date.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') !== moment().subtract(1, 'days').format('YYYYMMDD'))
      && (this.props.date.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') !== moment().subtract(1, 'days').format('YYYYMMDD'))
      && (this.props.date.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') !== moment().subtract(1, 'days').format('YYYYMMDD'))
    ) {
      lodash.get(this.props.homeData, 'incomeDetail', []).map(item => item?.income).reduce((previousValue, currentValue) => {
        const obj = {};
        const value = Number(previousValue) + Number(currentValue);
        obj['value'] = value || 0;
        obj['itemStyle'] = { color: value > 0 ? '#EF5A3C' : value < 0 ? '#029A01' : '#1A2243' };
        yData.push(obj);
        return value;
      }, 0);
      xData = lodash.get(this.props.homeData, 'incomeDetail', []).map(item => item.date);
    } else if (this.state.legendType === 1) {
      yData = lodash.get(this.props.homeData, 'incomeDetail', []).map(item => ({ value: item?.income || 0, itemStyle: { color: Number(item?.income) > 0 ? '#EF5A3C' : Number(item?.income) < 0 ? '#029A01' : '#1A2243' } }));
      xData = lodash.get(this.props.homeData, 'incomeDetail', []).map(item => item.date);
    } else {
      yData = lodash.get(this.props.homeData, 'totalAssetChanges.assetProfitList', []).map(item => ({ value: item?.asset || 0, itemStyle: { color: Number(item?.asset) > 0 ? '#EF5A3C' : Number(item?.asset) < 0 ? '#029A01' : '#1A2243' } }));
      xData = lodash.get(this.props.homeData, 'totalAssetChanges.assetProfitList', []).map(item => item.date);
    }
    if (!yData.length) yData.push({ value: "0.00", itemStyle: { color: "#EF5A3C" } });
    if (!xData.length) xData.push(this.props.date.format('YYYYMMDD'));
    let option = {};
    // 柱状图
    option = {
      grid: {
        top: 45,
        bottom: 50,
        left: type === 'bar' ? 72 : 64,
        right: 30,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#FFF',
        borderColor: type === 'bar' ? '#D1D5E6' : 'rgba(242, 178, 75, 0.38)',
        borderWidth: 1,
        textStyle: {
          fontSize: 12,
          color: '#000',
        },
        extraCssText: 'box-shadow: -2px 2px 8px 0px rgba(5, 14, 28, 0.12);',
        axisPointer: {
          type: 'line',
          lineStyle: type === 'bar' ? {
            width: 30,
            color: 'rgba(36,79,255,0.05)',
          } : {
            width: 1,
            color: '#F2B24B',
          },
          // snap: true,
        },
        formatter: (params) => {
          if (type === 'bar') {
            const jsx = (
              <div style={{ padding: '0 5px' }}>
                <div style={{ color: '#74819E' }}>{moment(params[0].name).format(((this.props.earning === 1 && this.state.legendType === 1) || params[0].name.length === 6) ? 'YYYY.MM' : 'YYYY.MM.DD')}</div>
                <div style={{ color: this.computed('color', params[0]?.value) }}>{formatThousands(params[0]?.value)}</div>
              </div>
            );
            return ReactDOMServer.renderToString(jsx);
          }
          if (this.props.earning === 4 && this.state.legendType === 1
            && (this.props.date.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') !== moment().subtract(1, 'days').format('YYYYMMDD'))
            && (this.props.date.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') !== moment().subtract(1, 'days').format('YYYYMMDD'))
            && (this.props.date.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') !== moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') !== moment().subtract(1, 'days').format('YYYYMMDD'))
          ) {
            const jsx = (
              <div style={{ padding: '5px' }}>
                <div style={{ color: '#74819E' }}>{moment(params[0].name).format(params[0].name.length === 6 ? 'YYYY.MM' : 'YYYY.MM.DD')}</div>
                <div style={{ padding: '5px 0' }}>
                  <span style={{ color: '#61698C', paddingRight: 8 }}>当日盈亏</span>
                  <span style={{ color: this.computed('color', lodash.get(this.props.homeData, 'incomeDetail', []).find(item => item.date === params[0].name)?.income || 0) }}>{formatThousands(lodash.get(this.props.homeData, 'incomeDetail', []).find(item => item.date === params[0].name)?.income || 0)}</span>
                </div>
                <div>
                  <span style={{ color: '#61698C', paddingRight: 8 }}>累计盈亏</span>
                  <span style={{ color: this.computed('color', params[0]?.value) }}>{formatThousands(params[0]?.value)}</span>
                </div>
              </div>
            );
            return ReactDOMServer.renderToString(jsx);
          }
          const jsx = (
            <div style={{ padding: '0 5px' }}>
              <div style={{ color: '#74819E' }}>{moment(params[0].name).format(((this.props.earning === 1 && this.state.legendType === 1) || params[0].name.length === 6) ? 'YYYY.MM' : 'YYYY.MM.DD')}</div>
              <div style={{ color: this.computed('color', params[0]?.value) }}>{formatThousands(params[0]?.value)}</div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          show: false,
        },
        boundaryGap: type === 'bar' ? true : false,
        axisLine: {
          lineStyle: {
            width: 1,
            color: '#E8EAF2',
          },
        },
        axisLabel: {
          // showMinLabel: true,
          interval: 0,
          color: '#61698c',
          formatter: (param) => {
            if (xData.length >= 2) {
              if (param == Math.min(...xData)) {
                return `{minFont|${moment(param).format(((this.props.earning === 1 && this.state.legendType === 1) || param.length === 6) ? 'YYYY.MM' : 'YYYY.MM.DD')}}`;
                // return param;
              }
              if (param == Math.max(...xData)) {
                return `{maxFont|${moment(param).format(((this.props.earning === 1 && this.state.legendType === 1) || param.length === 6) ? 'YYYY.MM' : 'YYYY.MM.DD')}}`;
              }
              return '';
            } else {
              return moment(param).format(((this.props.earning === 1 && this.state.legendType === 1) || param.length === 6) ? 'YYYY.MM' : 'YYYY.MM.DD');
            }
          },
          rich: {
            minFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 0, 0, xData.length < 15 ? 0 : 50],
            },
            maxFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, xData.length < 15 ? 0 : 50, 0, 0],
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        name: this.state.legendType === 1 ? (this.props.earning === 1 ? '每月收益金额' : this.props.earning === 2 ? '每日收益金额' :
          (this.props.earning === 4 && (
            (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
          || (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
          || (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
          )) ? '收益金额' : '累计收益图') : '',
        nameTextStyle: {
          color: '#74819E',
          align: 'right',
        },
        nameGap: 21,
        // min: -0.25,
        // max: 1.00,
        // interval: 0.25,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(209,213,230,0.52)',
          },
        },
        axisLabel: {
          formatter: (value) => {
            let prefix = '';
            if (Number(value) < 0) {
              prefix = '-';
            }
            value = Math.abs(Number(value));
            if (Number(value) >= 10000 && Number(value) < 100000000) {
              return prefix + formatThousands((Number(value) / 10000)) + '万';
            } else if (Number(value) >= 100000000) {
              return prefix + formatThousands((Number(value) / 100000000)) + '亿';
            } else {
              return prefix + formatThousands(value);
            }
          },
          color: '#74819E',
          margin: 8,
        },
      },
      series: [{
        data: yData,
        type,
        barWidth: 14,
        itemStyle: {
          color: this.state.legendType === 1 && (this.props.earning !== 4 || (this.props.earning === 4 && (
            (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
            || (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(6, 'months').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
            || (this.props.date.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.beginTime.format('YYYYMMDD') === moment().subtract(1, 'days').subtract(1, 'years').format('YYYYMMDD') && this.props.endTime.format('YYYYMMDD') === moment().subtract(1, 'days').format('YYYYMMDD'))
          ))) ? '#EF5A3C' : this.state.legendType === 2 ? '#0E8AFF' : '#244FFF',
        },
        symbol: (value, params) => {
          return this.state.legendType === 1 ? `image://${theme}` : `image://${blue}`;
        },
        symbolSize: 10,
        showSymbol: yData.length <= 1 ? true : false,
        markPoint: this.state.legendType === 1 ? {
          label: { show: false },
          symbol: "none",
        } : {
          label: {
            show: true,
            formatter: (param) => {
              return formatThousands(param.value);
            },
          },
          symbol: "circle",
          symbolSize: 6,
          symbolOffset: [0, 0],
          data: [ { type: 'max', label: { position: 'top' } }, { type: 'min', label: { position: 'bottom' } } ],
        },
      }],
    };
    echarts.init(this.barChart).setOption(option);
  }

  initChartTwo = () => {
    const { homeData } = this.props;
    const dataMap = {
      1: {
        name: '上证指数',
        data: lodash.get(homeData, 'incomeTrend.sseRateList', []).map(item => [item?.date, item?.incomeRate]).length ?
          lodash.get(homeData, 'incomeTrend.sseRateList', []).map(item => [item?.date, item?.incomeRate]) :
          [[this.props.date.format('YYYYMMDD'), 0]]
        ,
        type: 'line',
        itemStyle: {
          color: '#FF6E30',
        },
        lineStyle: {
          width: 1,
        },
        showSymbol: lodash.get(homeData, 'incomeTrend.sseRateList', []).map(item => [item?.date, item?.incomeRate]).length <= 1 ? true : false,
        symbol: (value, params) => {
          return `image://${orange}`;
        },
        symbolSize: 10,
      },
      2: {
        name: '沪深300',
        data: lodash.get(homeData, 'incomeTrend.hs300RateList', []).map(item => [item?.date, item?.incomeRate]).length ?
          lodash.get(homeData, 'incomeTrend.hs300RateList', []).map(item => [item?.date, item?.incomeRate]) :
          [[this.props.date.format('YYYYMMDD'), 0]],
        type: 'line',
        itemStyle: {
          color: '#FF6E30',
        },
        lineStyle: {
          width: 1,
        },
        showSymbol: lodash.get(homeData, 'incomeTrend.hs300RateList', []).map(item => [item?.date, item?.incomeRate]).length <= 1 ? true : false,
        symbol: (value, params) => {
          return `image://${orange}`;
        },
        symbolSize: 10,
      },
      3: {
        name: '创业板',
        data: lodash.get(homeData, 'incomeTrend.gemRateList', []).map(item => [item?.date, item?.incomeRate]).length ?
          lodash.get(homeData, 'incomeTrend.gemRateList', []).map(item => [item?.date, item?.incomeRate]) :
          [[this.props.date.format('YYYYMMDD'), 0]],
        type: 'line',
        itemStyle: {
          color: '#FF6E30',
        },
        lineStyle: {
          width: 1,
        },
        showSymbol: lodash.get(homeData, 'incomeTrend.gemRateList', []).map(item => [item?.date, item?.incomeRate]).length <= 1 ? true : false,
        symbol: (value, params) => {
          return `image://${orange}`;
        },
        symbolSize: 10,
      },
    };
    let maxNum = Math.max(...(lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).map(item => item?.incomeRate)),
      ...(lodash.get(homeData, 'incomeTrend.sseRateList', []).map(item => item?.incomeRate)),
      ...(lodash.get(homeData, 'incomeTrend.hs300RateList', []).map(item => item?.incomeRate)),
      ...(lodash.get(homeData, 'incomeTrend.gemRateList', []).map(item => item?.incomeRate)));
    const option = {
      grid: {
        top: 16,
        bottom: 50,
        left: `${Math.floor(Math.abs(maxNum))}` === 'Infinity' ? 50 : (`${Math.floor(Math.abs(maxNum))}`.length * 8) + 42,
        right: 0,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        // position: [0, -13],
        backgroundColor: '#FFF',
        borderColor: 'rgba(242, 178, 75, 0.38)',
        borderWidth: 1,
        extraCssText: 'box-shadow: -2px 2px 8px 0px rgba(5, 14, 28, 0.12);',
        textStyle: {
          fontSize: 12,
          color: '#1A2243',
        },
        axisPointer: {
          lineStyle: {
            color: '#F2B24B',
          },
        },
        formatter: (params) => {
          const value0 = Number(lodash.get(params, '[0].value[1]', '0')).toFixed(2);
          const value1 = Number(lodash.get(params, '[1].value[1]', '0')).toFixed(2);
          const jsx = (
            <div style={{ padding: '5px' }}>
              <div style={{ color: '#74819E' }}>{moment(params[0].name).format('YYYY.MM.DD')}</div>
              <div style={{ padding: '5px 0', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 8, height: 3, backgroundColor: '#244FFF' }}></div>
                <span style={{ color: '#61698C', padding: '0 8px 0 4px' }}>TA的</span>
                <span style={{ color: this.computed('color', value0) }}>{Number(value0) > 0 ? '+' + Number(value0).toFixed(2) : Number(value0).toFixed(2)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 8, height: 3, backgroundColor: '#FF6E30' }}></div>
                <span style={{ color: '#61698C', padding: '0 8px 0 4px' }}>{map[this.state.activeLegend]}</span>
                <span style={{ color: this.computed('color', value1) }}>{Number(value1) > 0 ? '+' + Number(value1).toFixed(2) : Number(value1).toFixed(2)}%</span>
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      // legend: {
      //   data: ['TA的', map[this.state.activeLegend]],
      // },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 1,
            color: '#E8EAF2',
          },
        },
        boundaryGap: false,
        axisLabel: {
          interval: 0,
          color: '#61698c',
          formatter: (param) => {
            if (lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).length >= 2) {
              if (param == Math.min(...(lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).map(item => item.date)))) {
                return `{minFont|${moment(param).format('YYYY.MM.DD')}}`;
                // return param;
              }
              if (param == Math.max(...(lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).map(item => item.date)))) {
                return `{maxFont|${moment(param).format('YYYY.MM.DD')}}`;
              }
              return '';
            } else {
              return moment(param).format('YYYY.MM.DD');
            }
          },
          rich: {
            minFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 0, 0, 60],
            },
            maxFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 60, 0, 0],
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          color: '#74819E',
        },
        // min: -0.25,
        // max: 1.00,
        // interval: 0.25,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(209,213,230,0.52)',
          },
        },
        axisLabel: {
          formatter: (value) => `${Number(value).toFixed(2)}%`,
          color: '#74819E',
        },
      },
      series: [{
        name: 'TA的',
        data: lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).map(item => [item?.date, item?.incomeRate || 0]).length ?
          lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).map(item => [item?.date, item?.incomeRate || 0]) :
          [[this.props.date.format('YYYYMMDD'), 0]],
        type: 'line',
        symbol: (value, params) => {
          return `image://${theme}`;
        },
        symbolSize: 10,
        showSymbol: lodash.get(homeData, 'incomeTrend.myIncomeRateList', []).map(item => [item?.date, item?.incomeRate || 0]).length <= 1 ? true : false,
        itemStyle: {
          color: '#244FFF',
        },
        lineStyle: {
          width: 1.5,
        },
      }, dataMap[this.state.activeLegend]],
    };
    echarts.init(this.lineChartTwo).setOption(option);
  }

  computed = (type, ...rest) => {
    if (type === 'color') {
      const [val] = rest;
      return formatColor(formatNum(val));
    }
  }

  handleLegendClick = (legendType) => {
    newClickSensors({
      third_module: "收益",
      ax_button_name: legendType === 1 ? "收益金额点击次数" : "资产走势点击次数",
    }); 
    this.setState({ legendType }, this.initChartOne);
  }

  handleTagClick = (activeLegend) => {
    clickSensors(activeLegend === 1 ? '上证指数' : activeLegend === 2 ? '沪深300' : '创业板');
    this.setState({ activeLegend }, this.initChartTwo);
  }

  // 参数myIncomeRateList: incomeTrend.myIncomeRateList*
  // 参数rateList: incomeTrend.ssRateList或incomeTrend.hs300RateList或incomeTrend.gemRateList
  countOutperform = (myIncomeRateList, rateList) => {
    let count = 0;
    for (let i = 0; i < rateList.length; i++) {
      if (rateList[i].incomeRate && myIncomeRateList[i].incomeRate) {
        if (Number(rateList[i].incomeRate) < Number(myIncomeRateList[i].incomeRate)) {
          count++;
        }
      }
    }
    return {
    // *跑赢天数*
      count,
      // *交易⽇数*
      tradingDay: rateList.length,
    };
  }

  renderEarningAnalyse = () => {
    const { homeData } = this.props;
    const map = {
      1: '上证指数',
      2: '沪深300',
      3: '创业板',
    };
    const listMap = {
      1: lodash.get(homeData, 'incomeTrend.sseRateList', []),
      2: lodash.get(homeData, 'incomeTrend.hs300RateList', []),
      3: lodash.get(homeData, 'incomeTrend.gemRateList', []),
    };
    const myRateOfReturn = Number(lodash.get(homeData, 'incomeTrend.myRateOfReturn', '0'));
    const hs300Ratio = Number(lodash.get(homeData, 'incomeTrend.hs300Ratio', '0'));
    const sseRatio = Number(lodash.get(homeData, 'incomeTrend.sseRatio', '0'));
    const gemRatio = Number(lodash.get(homeData, 'incomeTrend.gemRatio', '0'));
    let compare = 0; // 比较，高低
    if (this.state.activeLegend === 1) {
      compare = myRateOfReturn - sseRatio;
    } else if (this.state.activeLegend === 2) {
      compare = myRateOfReturn - hs300Ratio;
    } else if (this.state.activeLegend === 3) {
      compare = myRateOfReturn - gemRatio;
    }
    const { count, tradingDay } = this.countOutperform(lodash.get(homeData, 'incomeTrend.myIncomeRateList', []), listMap[this.state.activeLegend]);
    if (compare === 0 && myRateOfReturn === 0) {
      if (Number(count) === 0) {
        return '';
      } else {
        return (
          <React.Fragment>
            <span>有</span>
            <span style={{ color: '#E84646' }}>{count}天跑赢</span>
            <span>{map[this.state.activeLegend]}(共{tradingDay}个交易日)，干得不错！</span>
          </React.Fragment>
        );
      }
    }
    if (compare >= 0) {
      if (myRateOfReturn >= 0) {
        return (
          <React.Fragment>
            <span>收益率比{map[this.state.activeLegend]}</span>
            <span style={{ color: '#E84646' }}>高出{compare.toFixed(2)}%</span>
            <span>，有</span>
            <span style={{ color: '#E84646' }}>{count}天跑赢</span>
            <span>{map[this.state.activeLegend]}(共{tradingDay}个交易日)，干得不错！</span>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <span>收益率虽然为负，但比{map[this.state.activeLegend]}</span>
            <span style={{ color: '#E84646' }}>高出{compare.toFixed(2)}%</span>
            <span>，有</span>
            <span style={{ color: '#E84646' }}>{count}天跑赢</span>
            <span>{map[this.state.activeLegend]}(共{tradingDay}个交易日)，干得不错！</span>
          </React.Fragment>
        );
      }
    } else {
      if (myRateOfReturn >= 0) {
        return (
          <React.Fragment>
            <span>收益率为正，但比{map[this.state.activeLegend]}</span>
            <span style={{ color: '#029A01' }}>低{Math.abs(compare).toFixed(2)}%</span>
            <span>，再接再厉！</span>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <span>收益率比{map[this.state.activeLegend]}</span>
            <span style={{ color: '#029A01' }}>低{Math.abs(compare).toFixed(2)}%</span>
            <span>，再接再厉！</span>
          </React.Fragment>
        );
      }
    }
  }

  render() {
    const { homeData = [] } = this.props;
    const ranking = (1 - Number(lodash.get(homeData, 'revenueRanking.profitRank', '0'))) * 100;
    return (
      <Row style={{ width: 'calc(100% - 1px)', background: '#FFF', padding: '0 24px' }}>
        <Col span={12} style={{ borderRight: '1px solid #EBECF2', position: 'relative' }}>
          <div style={{ margin: '20px 30px 20px 0', height: 74, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 28px', background: '#F7F8FA' }}>
            <div>
              <div style={{ color: this.computed('color', lodash.get(homeData, 'incomeOverview.rangeTotalIncome', '0')), fontSize: 20, lineHeight: '28px' }}>{formatThousands(lodash.get(homeData, 'incomeOverview.rangeTotalIncome', '0'))}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ paddingRight: 5 }}>收益金额(元)</div>
                <MyPopover content={<div style={{ width: 338, lineHeight: '24px' }}>该账单统计范围包含股票、港股通、场内/场外基金、理财、国债逆回购等各产品种类，美元、港币也换算成人民币计算在收益中。</div>}>
                  <Icon type="question-circle" style={{ width: 14, height: 14, color: '#A7AEC6' }} />
                </MyPopover>
              </div>
            </div>
            <PopoverButton computed={this.computed} placement='bottomLeft' homeData={homeData} />
          </div>

          <Row style={{ width: 200, height: 24, background: 'rgba(209,213,230,0.32)', borderRadius: 16, fontSize: 12, color: '#61698C', position: 'absolute', left: '50%', transform: 'translate(-50%, 0)', zIndex: 2 }}>
            <Col span={12} className={this.state.legendType === 1 ? styles.activeLegend : styles.legend} onClick={() => this.handleLegendClick(1)}>收益金额</Col>
            <Col span={12} className={this.state.legendType === 2 ? styles.activeLegend : styles.legend} onClick={() => this.handleLegendClick(2)}>资产走势</Col>
          </Row>

          <div ref={el => this.barChart = el} style={{ width: '100%', height: 270 }} />

          {
            this.props.account !== 3 && (
              <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: 33, height: 32, borderRadius: '50% 0 0 50%', border: '1px solid #959CBA', borderRight: '1px solid transparent' }}></div>
                  <div style={{ position: 'relative', width: 'calc(100% - 156px)', height: 32, borderTop: '1px solid #959CBA', borderBottom: '1px solid #959CBA', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>收益金额战胜了</span>
                    <span style={{ color: this.computed('color', lodash.get(homeData, 'revenueRanking.myRatio', '0')) }}>{Number(lodash.get(homeData, 'revenueRanking.myRatio', '0')).toFixed(2)}%</span>
                    <span>的投资者</span>
                    <div className={styles.triangle} style={{ left: `calc(${lodash.get(homeData, 'revenueRanking.myRatio', '0')}% - 2px)` }}></div>
                    <div className={styles.message} style={{ left: `${lodash.get(homeData, 'revenueRanking.myRatio', '0')}%` }}></div>
                  </div>
                  <div style={{ width: 33, height: 32, borderRadius: '0 50% 50% 0', border: '1px solid #959CBA', borderLeft: '1px solid transparent' }}></div>
                </div>
                <div style={{ padding: '14px 78px 27px' }}>
                  <div style={{ height: 10, display: 'flex', borderRadius: 63, overflow: 'hidden' }}>
                    <div style={{ width: `${lodash.get(homeData, 'revenueRanking.lossRatio', '0')}%`, height: '100%', marginRight: Number(lodash.get(homeData, 'revenueRanking.lossRatio', '0')) >= 1 ? 2 : 0, background: 'linear-gradient(360deg, #96E184 0%, #3CD11C 100%)' }}></div>
                    <div style={{ width: `${lodash.get(homeData, 'revenueRanking.zeroRate', '0')}%`,height: '100%', background: 'linear-gradient(360deg, #F0F0F0 0%, #EBEBEB 100%)' }}></div>
                    <div style={{ width: `${lodash.get(homeData, 'revenueRanking.profitRatio', '0')}%`,height: '100%', marginLeft: Number(lodash.get(homeData, 'revenueRanking.profitRatio', '0')) >= 1 ? 2 : 0, background: 'linear-gradient(360deg, #FFA27E 0%, #FF8061 100%)' }}></div>
                  </div>
                  <div style={{ display: 'flex', fontSize: 12, marginTop: 10, justifyContent: 'space-between' }}>
                    <div style={{ minWidth: 90, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5ED743' }}></div>
                      <div style={{ color: '#74819E', margin: '0 4px' }}>亏损账户</div>
                      <div>{`${lodash.get(homeData, 'revenueRanking.lossRatio', '0')}%`}</div>
                    </div>
                    <div style={{ minWidth: 90, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#DBDBDB' }}></div>
                      <div style={{ color: '#74819E', margin: '0 4px' }}>零收益账户</div>
                      <div>{`${lodash.get(homeData, 'revenueRanking.zeroRate', '0')}%`}</div>
                    </div>
                    <div style={{ minWidth: 90, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF977E' }}></div>
                      <div style={{ color: '#74819E', margin: '0 4px' }}>盈利账户</div>
                      <div>{`${lodash.get(homeData, 'revenueRanking.profitRatio', '0')}%`}</div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
        </Col>

        <Col span={12} style={{ padding: '20px 24px 0 31px' }}>
          <div style={{ height: 74, background: '#F7F8FA', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 22, display: 'flex', justifyContent: 'center' }}>
              <div>
                <div className={styles.number} style={{ color: this.computed('color', lodash.get(homeData, 'incomeTrend.myRateOfReturn', '0')) }}>
                  <span>{Number(lodash.get(homeData, 'incomeTrend.myRateOfReturn', '0')).toFixed(2)}</span>
                  <span style={{ fontSize: 14 }}>%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ paddingRight: 5 }}>收益率</div>
                  <MyPopover placement='bottom' content={<div style={{ width: 338, lineHeight: '24px' }}>
                    <div>
                      时间加权收益率是指每日日收益累计算出报告周期内的收益率。该收益率计算方法也叫基金净值法，是业界常用的收益率计算方法，便于对比账户收益与各基金收益情况。但是在账户资产出现大额变动时，可能出现收益金额、收益率正负号表现不一致的情况。
                    </div>
                    <div style={{ fontWeight: 600, paddingTop: 9 }}>举个例子：</div>
                    <div>T日：总资产1万元，T日收盘收益200元(+2%)</div>
                    <div>T+1日：转出5200元</div>
                    <div>T+1日：总资产5000元，T+1日收盘亏损-150元(-3%)</div>
                    <div>收益金额=200-150=+50元</div>
                    <div>时间加权收益率=(1+2%)*(1-3%)-1=-1.06%</div>
                  </div>}>
                    <Icon type="question-circle" style={{ width: 14, height: 14, color: '#A7AEC6' }} />
                  </MyPopover>
                </div>
              </div>
            </div>
            <div className={styles.divider}></div>
            <div style={{ flex: 26, display: 'flex', justifyContent: 'center' }}>
              <div>
                <div className={styles.number} style={{ fontSize: 16, color: this.computed('color', lodash.get(homeData, 'incomeTrend.sseRatio', '0')) }}>{Number(lodash.get(homeData, 'incomeTrend.sseRatio', '0')).toFixed(2)}%</div>
                <div>上证指数收益率</div>
              </div>
            </div>
            <div className={styles.divider}></div>
            <div style={{ flex: 26, display: 'flex', justifyContent: 'center' }}>
              <div>
                <div className={styles.number} style={{ fontSize: 16, color: this.computed('color', lodash.get(homeData, 'incomeTrend.hs300Ratio', '0')) }}>{Number(lodash.get(homeData, 'incomeTrend.hs300Ratio', '0')).toFixed(2)}%</div>
                <div>沪深300收益率</div>
              </div>
            </div>
            <div className={styles.divider}></div>
            <div style={{ flex: 26, display: 'flex', justifyContent: 'center' }}>
              <div>
                <div className={styles.number} style={{ fontSize: 16, color: this.computed('color', lodash.get(homeData, 'incomeTrend.gemRatio', '0')) }}>{Number(lodash.get(homeData, 'incomeTrend.gemRatio', '0')).toFixed(2)}%</div>
                <div>创业板收益率</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 15, display: 'flex', fontSize: 12 }}>
            <div style={{ width: 66, height: 28, background: 'rgba(36, 79, 255, 0.04)', border: '1px solid #93A8FF', borderRadius: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#244FFF', cursor: 'default' }}>TA的</div>
            <div style={{ margin: '0 10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={vs} style={{ width: 26, height: 11 }} alt='' /></div>
            <div onClick={() => this.handleTagClick(1)} className={this.state.activeLegend === 1 ? styles.activeTag : styles.tag}>上证指数</div>
            <div onClick={() => this.handleTagClick(2)} className={this.state.activeLegend === 2 ? styles.activeTag : styles.tag}>沪深300</div>
            <div onClick={() => this.handleTagClick(3)} className={this.state.activeLegend === 3 ? styles.activeTag : styles.tag}>创业板</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 0 2px', lineHeight: '14px' }}>
            <div style={{ width: 8, height: 3, background: '#244FFF' }}></div>
            <div style={{ fontSize: 12, margin: '0 35px 0 5px' }}>TA的</div>
            <div style={{ width: 8, height: 3, background: '#FF6E30' }}></div>
            <div style={{ fontSize: 12, margin: '0 35px 0 5px' }}>{map[this.state.activeLegend]}</div>
          </div>

          <div ref={el => this.lineChartTwo = el} style={{ width: '100%', height: 230 }} />

          {
            this.props.account !== 3 && (
              <div style={{ height: 70, background: '#F7F8FA', fontSize: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 140, height: 32, display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, rgba(131,155,255,0.06) 0%, rgba(36,79,255,0.06) 100%)', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 4px 0 14px' }}>
                      <img style={{ width: 14, height: 14 }} src={pen} alt='' />
                    </div>
                    <div>TA的收益率解读</div>
                  </div>
                  <div style={{ paddingLeft: 5, color: '#61698C' }}>
                    <span>收益率战胜了</span>
                    <span style={{ color: this.computed('color', ranking) }}>{Number(ranking).toFixed(2)}%</span>
                    <span>的安信用户</span>
                  </div>
                </div>
                <div style={{ color: '#61698C', paddingLeft: 14 }}>
                  { this.renderEarningAnalyse() }
                </div>
              </div>
            )}
        </Col>
      </Row>
    );
  }
}

export default OtherEanring;