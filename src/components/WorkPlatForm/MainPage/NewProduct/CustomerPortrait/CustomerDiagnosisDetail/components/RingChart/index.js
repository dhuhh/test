import React, { Component } from 'react';
import * as echarts from 'echarts';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';
import styles from './index.less';

export default class RingChart extends Component {
  state = {
    legends: [],
    legends2: [],
    hasShowProfit: true,
    title: '',
    prdTypeDic: {
      1: '股票',
      2: '基金',
      3: '理财',
      4: '国债理财',
    },
    prdTypeColorDic: {
      1: '#F8745D',
      2: '#F2D360',
      3: '#FFB555',
      4: '#6AA2FA',
    },
    swiper: {},
  }
  componentDidMount() {
    this.initRingChart(this.props.chartData);
    this.initRingChart2(this.props.chartData);
    new Swiper('.swiper-container', {
      // pagination: { el: '.swiper-pagination', clickable: true },
      pagination: '.swiper-pagination',
      paginationClickable: true,
    });
  }
  /* componentDidUpdate() {
    const height = (document.getElementById('chart1')).offsetHeight;
    const left2 = (height * 0.44) + 10;
    (document.getElementById('inner1')).style.left = `${left2}px`;
    (document.getElementById('inner2')).style.left = `${left2}px`;
  } */

  formatterDate(date) {
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }
  initRingChart(chartData) {
    const chart = echarts.init((document.getElementById('chart1')), undefined, { renderer: 'svg' });
    const option = {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      color: ['#F8745D ', '#F2D360', '#FFB555', '#6AA2FA'],
      tooltip: {
        show: false,
        trigger: 'item',
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        label: {
          show: false,
          position: 'center',
          label: {
            formatter: () => '{font|收益}{font|贡献}',
            rich: {
              font: {
                fontSize: 14,
                fontWeight: 400,
                color: '#666666',
              },
            },
          },
        },
        /* data: [{
          value: 1048,
          legendName: '搜索引擎',
          name: '搜索引擎|1048元',
        }, {
          value: 735,
          legendName: '直接访问',
          name: '直接访问|735元',
        }, {
          value: 580,
          legendName: '邮件营销',
          name: '邮件营销|580元',
        }, {
          value: 484,
          legendName: '联盟广告',
          name: '联盟广告|484元',
        }, {
          value: 300,
          legendName: '视频广告',
          name: '视频广告|300元',
        }], */
        data: [],
      }, {
        radius: ['50%', '40%'],
        center: ['50%', '50%'],
        type: 'pie',
        silent: true,
        clockwise: false,
        clickable: false,
        hoverAnimation: false,
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        tooltip: {
          show: false,
        },
        data: [{
          value: 100,
          itemStyle: {
            color: 'rgba(68,64,62,0.1)',
          },
        }],
      }],
    };
    let legends = [];
    option.series[0].data = [];
    chartData.other.detail.forEach((e) => {
      legends.push({
        value: Math.abs(e.re),
        prdType: e.prd_type,
        name: this.state.prdTypeDic[e.prd_type],
      });
      (option.series[0].data).push({
        value: Math.abs(e.re),
        name: this.state.prdTypeDic[e.prd_type],
      });
    });
    this.setState({
      legends,
    });
    chart.setOption(option);
  }

  initRingChart2(chartData) {
    const chart = echarts.init((document.getElementById('chart2')), undefined, { renderer: 'svg' });
    const option = {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      color: ['#F8745D ', '#F2D360', '#FFB555', '#6AA2FA'],
      tooltip: {
        show: false,
        trigger: 'item',
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        label: {
          show: false,
          position: 'center',
          label: {
            formatter: () => '{font|收益}{font|贡献}',
            rich: {
              font: {
                fontSize: 14,
                fontWeight: 400,
                color: '#666666',
              },
            },
          },
        },
        /*   data: [{
          value: 1048,
          legendName: '搜索引擎',
          name: '搜索引擎|1048元',
        }, {
          value: 735,
          legendName: '直接访问',
          name: '直接访问|735元',
        }, {
          value: 580,
          legendName: '邮件营销',
          name: '邮件营销|580元',
        }, {
          value: 484,
          legendName: '联盟广告',
          name: '联盟广告|484元',
        }, {
          value: 300,
          legendName: '视频广告',
          name: '视频广告|300元',
        }], */
        data: [],
      }, {
        radius: ['50%', '40%'],
        center: ['50%', '50%'],
        type: 'pie',
        silent: true,
        clockwise: false,
        clickable: false,
        hoverAnimation: false,
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        tooltip: {
          show: false,
        },
        data: [{
          value: 20,
          itemStyle: {
            color: 'rgba(68,64,62,0.1)',
          },
        }],
      }],
    };
    let legends2 = [];
    option.series[0].data = [];
    chartData.other.detail.forEach((e) => {
      legends2.push({
        value: Math.abs(e.max_mkt_val),
        prdType: e.prd_type,
        name: this.state.prdTypeDic[e.prd_type],
      });
      (option.series[0].data).push({
        value: Math.abs(e.max_mkt_val),
        name: this.state.prdTypeDic[e.prd_type],
      });
    });
    this.setState({
      legends2,
    });
    chart.setOption(option);
  }
  render() {
    return (
      <div className={styles.layout}>
        <div className='swiper-container'>
          <div className='swiper-wrapper'>
            <div className='swiper-slide'>
              <figure className={styles.operationShowhart}>
                <div className={styles.opRoundGraphic}>
                  <div className={styles.pieRoundContainer}>
                    <div className={styles.pieRoundOuter, styles.roundOuterBorder}>
                      <div id="chart1" className={styles.innerChart} />
                      {
                        this.state.hasShowProfit ? (
                          <div className={styles.pieRoundInner} id="inner1">
                            收益<br />贡献
                          </div>
                        ) : ''
                      }
                    </div>
                  </div>
                </div>
                <div className={styles.ringLegends}>
                  {
                    this.state.legends.map((legend, index) => (
                      <div key={index} className={styles.ringLegendRow}>
                        <div className={styles.ringLegend}>
                          <div className={styles.ringBlock} style={{ backgroundColor: this.state.prdTypeColorDic[legend.prdType] }} />
                          <div className={styles.ringLabel}>
                            {legend.name}
                          </div>
                        </div>
                        <div className={styles.ringLegendValue}>
                          {legend.value}元
                        </div>
                      </div>
                    )
                    )
                  }
                </div>
              </figure>
            </div>
            <div className='swiper-slide'>
              <figure className={styles.operationShowChart}>
                <div className={styles.opRoundGraphic}>
                  <div className={styles.pieRoundContainer}>
                    <div
                      className={styles.pieRoundOuter, styles.roundOuterBorder}
                    >
                      <div
                        id="chart2"
                        className={styles.innerChart}
                      />
                      <div
                        className={styles.pieRoundInner} id="inner2" style={{ marginLeft: '-98px', marginTop: '-1px' }}
                      >
                        单日<br />最高市值
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.ringLegends}>
                  {
                    this.state.legends2.map((legend, index) => (
                      <div key={index} className={styles.ringLegendRow} >
                        <div className={styles.ringLegend}>
                          <div
                            className={styles.ringBlock}
                            style={{ backgroundColor: this.state.prdTypeColorDic[legend.prdType] }}
                          />
                          <div className={styles.ringLabel}>
                            {legend.name}
                          </div>
                        </div>
                        <div className={styles.ringLegendValue}>
                          {legend.value}元
                        </div>
                      </div>
                    )
                    )
                  }
                </div>
              </figure>
            </div>
          </div>
          <div className={`swiper-pagination ${styles.pagination}`} /* style={{ backgroundColor: 'rgba(242,242,245,0.44)' }} */>
          </div>
        </div >
      </div >
    );
  }
}
