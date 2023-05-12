import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Icon } from 'antd';
import * as echarts from 'echarts';
import lodash from 'lodash';
import PopoverButton from '../Common/PopoverButton';
import { formatColor, formatThousands, formatNum, clickSensors } from '../util';
import pen from '$assets/newProduct/earing/pen.png';
import styles from './index.less';
import MyPopover from '../Common/MyPopover';

class DateEarning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLegend: 1,
    };
    this.earningChart = null;

    const { getInstence } = props;
    if (getInstence && typeof getInstence === 'function') {
      getInstence(this);
    }
  }

  computed = (type, ...rest) => {
    if (type === 'color') {
      const [val] = rest;
      return formatColor(formatNum(val));
    }
  }

  componentDidMount() {
  }

  initChartOne = () => {
    const { homeData } = this.props;
    const yData = [
      lodash.get(homeData, 'incomeTrend.myRateOfReturn', '0'),
      lodash.get(homeData, 'incomeTrend.sseRatio', '0'),
      lodash.get(homeData, 'incomeTrend.hs300Ratio', '0'),
      lodash.get(homeData, 'incomeTrend.gemRatio', '0'),
    ].map(item => ({ value: item, itemStyle: { color: Number(item) < 0 ? '#029A01' : '#EF5A3C' } }));
    const option = {
      grid: {
        top: 45,
        bottom: 50,
        left: 74,
        right: 30,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        // position: (point, _1, _2, _3, size) => ([point[0] - (size.contentSize[0] / 2), 5]),
        backgroundColor: '#FFF',
        borderColor: '#D1D5E6',
        borderWidth: 1,
        textStyle: {
          fontSize: 12,
          color: '#000',
        },
        axisPointer: {
          lineStyle: {
            width: 30,
            color: 'rgba(36,79,255,0.05)',
          },
        },
        formatter: (params) => {
          const jsx = (
            <div style={{ padding: '0 5px' }}>
              <div style={{ color: '#74819E' }}>{params[0].name}</div>
              <div style={{ color: this.computed('color', params[0]?.value) }}>{formatThousands(params[0]?.value)}</div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      xAxis: {
        type: 'category',
        data: ['TA的', '上证指数', '沪深300', '创业板'],
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 1,
            color: '#E8EAF2',
          },
        },
        axisLabel: {
          color: '#74819E',
        },
      },
      yAxis: {
        type: 'value',
        name: '收益率对比',
        nameTextStyle: {
          color: '#74819E',
          align: 'center',
        },
        nameGap: 21,
        // min: -0.25,
        // max: 1.00,
        // interval: 0.25,
        axisLine: {
          show: false,
          lineStyle: {
            width: 1,
            color: '#CCCCCC',
          },
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
          align: 'left',
          margin: 50,
        },
      },
      series: [{
        data: yData,
        type: 'bar',
        barWidth: 14,
        itemStyle: {
          color: '#EF5A3C',
        },
      }],
    };
    echarts.init(this.earningChart).setOption(option);
  }

  initChartTwo = () => {}

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
      <div style={{ background: '#FFF', paddingTop: 20 }}>
        <div style={{ height: 84, margin: '0 24px', background: '#F7F8FA', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <div className={styles.number} style={{ color: this.computed('color', lodash.get(homeData, 'incomeOverview.rangeTotalIncome', '0')) }}>{formatThousands(lodash.get(homeData, 'incomeOverview.rangeTotalIncome', '0'))}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ paddingRight: 5 }}>收益金额</div>
                <MyPopover content={<div style={{ width: 338, lineHeight: '24px' }}>
                  该账单统计范围包含股票、港股通、场内/场外基金、理财、国债逆回购等各产品种类，美元、港币也换算成人民币计算在收益中。
                </div>}>
                  <Icon type="question-circle" style={{ width: 14, height: 14, color: '#A7AEC6' }} />
                </MyPopover>
              </div>
            </div>
            <div className={styles.divider}></div>
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
            <div className={styles.divider}></div>
            <div>
              <div className={styles.number} style={{ fontSize: 16, color: this.computed('color', lodash.get(homeData, 'incomeTrend.sseRatio', '0')) }}>{Number(lodash.get(homeData, 'incomeTrend.sseRatio', '0')).toFixed(2)}%</div>
              <div>上证指数收益率</div>
            </div>
            <div className={styles.divider}></div>
            <div>
              <div className={styles.number} style={{ fontSize: 16, color: this.computed('color', lodash.get(homeData, 'incomeTrend.hs300Ratio', '0')) }}>{Number(lodash.get(homeData, 'incomeTrend.hs300Ratio', '0')).toFixed(2)}%</div>
              <div>沪深300</div>
            </div>
            <div className={styles.divider}></div>
            <div>
              <div className={styles.number} style={{ fontSize: 16, color: this.computed('color', lodash.get(homeData, 'incomeTrend.gemRatio', '0')) }}>{Number(lodash.get(homeData, 'incomeTrend.gemRatio', '0')).toFixed(2)}%</div>
              <div>创业板收益率</div>
            </div>
            <div className={styles.divider}></div>

          </div>

          <PopoverButton computed={this.computed} placement='bottomRight' homeData={homeData} />
        </div>

        <div style={{ display: 'flex' }}>
          <div ref={(el) => this.earningChart = el} style={{ width: '50%', height: 256 }} />
          { this.props.account !== 3 && (
            <div style={{ width: '50%', padding: '0 24px 0 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 20, display: 'flex' }}>
                <div onClick={() => this.handleTagClick(1)} className={this.state.activeLegend === 1 ? styles.activeTag : styles.tag}>上证指数</div>
                <div onClick={() => this.handleTagClick(2)} className={this.state.activeLegend === 2 ? styles.activeTag : styles.tag}>沪深300</div>
                <div onClick={() => this.handleTagClick(3)} className={this.state.activeLegend === 3 ? styles.activeTag : styles.tag}>创业板</div>
              </div>
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
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DateEarning;