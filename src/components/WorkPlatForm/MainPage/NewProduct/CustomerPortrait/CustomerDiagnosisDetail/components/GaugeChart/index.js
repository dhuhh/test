import React, { Component } from 'react';
import * as echarts from 'echarts';
import styles from './index.less';
export default class index extends Component {
  state = {
    ratioValue: 0,
  }

  $refs = {};
  componentDidMount() {
    this.initGaugeChart();
  }

  get colorSet() {
    const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
      offset: 0,
      color: '#F8936F', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#EF5A3C', // 100% 处的颜色
    },
    ]);
    return [
      [this.state.ratioValue, color],
      [1, '#F2F2F5'],
    ];
  }
  // 绘制仪表
  initGaugeChart() {
    const key = Object.keys(this.props.chartData.other);
    let ratioValue = this.props.chartData.other[key[0]];
    this.setState({
      ratioValue,
    }, () => {
      const chart = echarts.init((this.$refs.GaugeChart), undefined, { renderer: 'svg' });
      const coption = {
        animation: false,
        series: [
          {
            type: 'gauge',
            radius: 80,
            center: ['50%', '50%'],
            startAngle: '225',
            endAngle: '-43',
            pointer: {
              show: false,
            },
            detail: {
              show: false,
            },
            title: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: this.colorSet,
                width: 10,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            type: 'gauge',
            radius: 80,
            center: ['50%', '50%'],
            splitNumber: 50, // 刻度数量
            detail: {
              show: false,
            },
            startAngle: '225',
            endAngle: '-43',
            axisLine: {
              show: false,
              lineStyle: {
                width: 10,
                shadowBlur: 0,
                color: [
                  [0, '#979797'],
                  [1, '#979797'],
                ],
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#F2F2F5',
                width: -1,
              },
              length: -20,
              splitNumber: 3,
            },
            splitLine: {
              show: true,
              length: 0,
              lineStyle: {
                color: '#F2F2F5',
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: { // 仪表盘指针
              show: 0,
            },
            data: [],
          },
        ],
      };
      (chart).setOption(coption);
    });
  }
  render() {
    return (
      <div className={styles.opChartGraphic}>
        <div className={styles.opChartRound} >
          <div
            style={{ height: '200px' }}
            ref={el => this.$refs.GaugeChart = el}
            className={styles.container}
          />
          <div className={styles.opChartRoundData}>
            <p><span>{+(this.state.ratioValue * 100).toFixed(2)}</span>%</p>
          </div>
        </div>
        <div className={styles.opChartRoundWord}>
          <ul>
            <li><span>0%</span></li>
            <li><span className={styles.prolit}>100%</span><em className={styles.roundGood} /></li>
          </ul>
        </div>
      </div>
    );
  }
}
