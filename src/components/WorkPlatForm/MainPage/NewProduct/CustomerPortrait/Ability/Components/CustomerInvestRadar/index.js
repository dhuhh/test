import React, { Component } from 'react';
import * as echarts from 'echarts';
import { isEmpty } from 'lodash';
import styles from './index.less';

class CustomerInvestRadar extends Component {

  // 战胜了多少人
  rank = '';

  // 综合得分
  score = '';

  $refs = {};

  init = (data) => {
    this.rank = data.rank;
    this.score = data.compositive_score;
    function getArr(obj) {
      const arr = new Array(5);
      arr[0] = obj.profit;
      arr[1] = obj.pos_manage;
      arr[2] = obj.pos_close;
      arr[3] = obj.selection;
      arr[4] = obj.risk_control;
      return arr;
    }
    this.initRadarChart({
      ...data,
      personalArr: getArr(data.personal_ablility),
      averageArr: getArr(data.average_ablility),
    });
    this.forceUpdate();
  }

  initRadarChart = (data) => {
    const chart = echarts.init(this.$refs.radarChart, undefined, { renderer: 'canvas' });
    const option = {
      color: ['#234FFF', '#E9B552'],
      legend: {
        show: false,
        data: [{
          name: '该客户',
          icon: 'rect',
          textStyle: {
            fontSize: 14,
            fontWeight: 400,
            color: '#61698c',
            lineHeight: 14,
          },
        }, {
          name: '平均水平',
          icon: 'rect',
          textStyle: {
            fontSize: 14,
            fontWeight: 400,
            color: '#61698c',
            lineHeight: 14,
          },
        }],
        bottom: 0,
        width: 400,
        height: 26,
        itemWidth: 16,
        itemHeight: 6,
        itemGap: 99,
      },
      radar: {
        radius: '70%',
        splitNumber: 3,
        axisLine: {
          symbol: ['none', 'circle'],
          symbolSize: 4,
          lineStyle: {
            type: 'dashed',
          },
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: {
          formatter: (param) => {
            const params = param.split('|');
            return `{name|${params[0]}}\n{number|${params[1]}}`;
          },
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 20,
            },
            number: {
              fontSize: 14,
              fontWeight: 400,
              color: '#1a2243',
              lineHeight: 20,
              align: 'center',
            },
          },
        },
        shape: 'circle',
        splitArea: {
          show: false,
        },
        indicator: [{
          name: `盈利能力|${data.personalArr[0]}分`,
          max: 20,
        }, {
          name: `风险控制能力|${data.personalArr[1]}分`,
          max: 20,
        }, {
          name: `资产选择能力|${data.personalArr[2]}分`,
          max: 20,
        }, {
          name: `止盈止损能力|${data.personalArr[3]}分`,
          max: 20,
        }, {
          name: `仓位管理能力|${data.personalArr[4]}分`,
          max: 20,
        }],
      },
      series: [{
        type: 'radar',
        zlevel: 2,
        data: [{
          name: '该客户',
          symbol: 'none',
          value: data.personalArr,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0.5,
              y: 1,
              x2: 0.5,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#1080FF', // 0% 处的颜色
              }, {
                offset: 1, color: '#234FFF', // 100% 处的颜色
              }],
              global: false, // 缺省为 false
            },
          },
        }],
        lineStyle: {
          color: '#234FFF',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#1080FF',
            },
            {
              offset: 1,
              color: '#234FFF',
            },
          ]),
        },
      }, {
        type: 'radar',
        zlevel: 1,
        data: [{
          symbol: 'none',
          name: '平均水平',
          // todo
          value: data.averageArr,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0.5,
              y: 1,
              x2: 0.5,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#FFE7B6', // 0% 处的颜色
              }, {
                offset: 1, color: '#FFCF74', // 100% 处的颜色
              }],
              global: false, // 缺省为 false
            },
          },
        }],
        lineStyle: {
          color: '#E9B552',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#FFE7B6',
            },
            {
              offset: 1,
              color: '#FFCF74',
            },
          ]),
        },
      }],
    };
    chart.setOption(option);
    /* chart.getZr().on('click', (param) => {
      if (isEmpty(param)) {
        return;
      }
      option.radar.indicator = [{
        name: `盈利能力|${param.value[0]}分`,
        max: 20,
      }, {
        name: `风险控制能力|${param.value[1]}分`,
        max: 20,
      }, {
        name: `资产选择能力|${param.value[2]}分`,
        max: 20,
      }, {
        name: `止盈止损能力|${param.value[3]}分`,
        max: 20,
      }, {
        name: `仓位管理能力|${param.value[4]}分`,
        max: 20,
      }];
    }); */
  }

  render() {
    return (
      <div>
        <div className={styles.radarLayout}>
          <div
            ref={el => this.$refs.radarChart = el}
            className={styles.radarChart}
          />
          <div className={styles.analycis_chart_tip}>
            <p><em className={styles.ac_tip_g1} /><span>该客户</span></p>
            <p><em className={styles.ac_tip_g2} /><span>平均水平</span></p>
          </div>
        </div>
        <div className={styles.dash} />
        <div className={styles.scoreContainer}>
          <div className={styles.score}>
            <span className={styles.context}>
              最新综合得分：
            </span>
            <span className={styles.number} style={{ fontFamily: 'EssenceSansStd-Regular' }}>
              {this.score}
            </span>
            <span className={styles.unit}>
              分
            </span>
          </div>
          <div className={styles.bubble}>
            该客户的投资能力战胜了
            <span className={styles.level}>
              {this.rank}%
            </span>
          的安信用户
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerInvestRadar;
