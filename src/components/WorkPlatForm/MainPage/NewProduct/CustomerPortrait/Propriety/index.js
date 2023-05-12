import React, { Component } from 'react';
import { Empty } from 'antd';
import Title from '../Common/Title';
import Poptag from '../Common/Poptag';
import TableItem from '../Common/TableItem';
import ReactEcharts from 'echarts-for-react';
import { QueryCusSuitInfo } from '$services/newProduct';
import styles from './index.less';
//import defaultImg from '$assets/newProduct/customerPortrait/缺省图@2x.png';
import defaultImg from '$assets/newProduct/customerPortrait/defaultGraph@2x.png';
require('echarts/lib/chart/radar');


export default class Propriety extends Component {
  state = {
    lifecycle: [],
    wealth: [],
    invest: [],
    risk: [],
    valueArr: [],
    lifecycleTable: [],
    investTable: [],
    wealthTable: [],
    riskTable: [],
  }
  getOption = () => {
    let option = {
      radar: {
        radius: 110,
        splitNumber: 4,
        axisLine: { // (圆内的几条直线)坐标轴轴线相关设置
          lineStyle: {
            color: '#E4E7E9',
            // 坐标轴线线的颜色。
            width: 1,
            // 坐标轴线线宽。
            type: 'solid',
            // 坐标轴线线的类型。
          },
        },
        splitLine: { // (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
          lineStyle: {
            color: '#E4E7E9',
            // 分隔线颜色
            width: 1,
            // 分隔线线宽
          },
        },
        name: {
          color: '#61698C',
          fontSize: 13,
          fontWeight: 400,
        },
        splitArea: {
          show: false,
        },
        indicator: [{
          name: '生命周期',
          max: 200,
          axisLabel: {
            show: true,
            fontSize: 9,
            fontWeight: 400,
            color: '#61698C',
            lineColor: 'black',
          },
        }, {
          name: '投资情况',
          max: 200,
        }, {
          name: '财富水平',
          max: 200,
        }, {
          name: '风险偏好',
          max: 200,
        }],
      },
      series: [{
        // name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        data: [{
          value: this.valueArr,
        }],
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: {
          color: '#234FFF',
        },
        lineStyle: {
          color: '#234FFF',
        },
        areaStyle: {
          color: 'rgba(35,79,255,0.3)',
        },
      }],
    };
    return option;
  }
  get lifecycleMax() { return this.state.lifecycle.reduce((pre, cur) => pre + parseInt(cur.maxScore), 0); }
  get lifecycleValue() { return this.state.lifecycle.reduce((pre, cur) => pre + parseInt(cur.optionScore), 0); }

  get wealtheMax() { return this.state.wealth.reduce((pre, cur) => pre + parseInt(cur.maxScore), 0); }
  get wealthValue() { return this.state.wealth.reduce((pre, cur) => pre + parseInt(cur.optionScore), 0); }

  get investeMax() { return this.state.invest.reduce((pre, cur) => pre + parseInt(cur.maxScore), 0); }
  get investValue() { return this.state.invest.reduce((pre, cur) => pre + parseInt(cur.optionScore), 0); }

  get riskMax() { return this.state.risk.reduce((pre, cur) => pre + parseInt(cur.maxScore), 0); }
  get riskValue() { return this.state.risk.reduce((pre, cur) => pre + parseInt(cur.optionScore), 0); }

  get valueArr() {
    let valueArr = [];
    valueArr[0] = this.lifecycleValue;
    valueArr[1] = this.investValue;
    valueArr[2] = this.wealthValue;
    valueArr[3] = this.riskValue;
    return valueArr;
  }
  get totalValue() {
    let total = this.lifecycleValue + this.investValue + this.wealthValue + this.riskValue;
    return total;
  }

  lifecycleTable() {
    let arr = [];
    arr[0] = this.state.lifecycle.find(item => item.question === "学历");
    arr[1] = this.state.lifecycle.find(item => item.question === '职业');
    arr[2] = this.state.lifecycle.find(item => item.question === '年龄');
    this.setState({
      lifecycleTable: arr,
    });
  }
  investTable() {
    let arr = [];
    arr[0] = this.state.invest.find(item => item.question === '一年内参与投顾数量');
    arr[1] = this.state.invest.find(item => item.question === '月均交易频次');
    this.setState({
      investTable: arr,
    });
  }
  wealthTable() {
    let arr = [];
    arr[0] = this.state.wealth.find(item => item.question === '月均交易量');
    arr[1] = this.state.wealth.find(item => item.question === '月均总资产');
    this.setState({
      wealthTable: arr,
    });
  }
  riskTable() {
    let arr = [];
    arr[0] = this.state.risk.find(item => item.question === '高风险业务权限开通数量');
    arr[1] = this.state.risk.find(item => item.question === '全部账户收益波动率');
    arr[2] = this.state.risk.find(item => item.question === '月均高风险产品市值占比');
    this.setState({
      riskTable: arr,
    });
  }
  componentDidMount() {
    QueryCusSuitInfo({
      "cusNo": this.props.cusCode,
      "userId": 0,
    }).then(res => {
      const { records } = res;
      let lifecycle = records.filter(item => item.questionType === '1');
      let wealth = records.filter(item => item.questionType === '2');
      let invest = records.filter(item => item.questionType === '3');
      let risk = records.filter(item => item.questionType === '4');
      this.setState({
        lifecycle,
        wealth,
        invest,
        risk,
      });
      this.lifecycleTable();
      this.investTable();
      this.wealthTable();
      this.riskTable();
    });
  }
  render() {
    let section = '', grade = '';
    if (this.totalValue <= 41) {
      grade = 'C1';
      section = '41分以下';
    } else if (this.totalValue > 41 && this.totalValue <= 75) {
      grade = 'C2';
      section = '41分~75分';
    } else if (this.totalValue > 75 && this.totalValue <= 114) {
      grade = 'C3';
      section = '75分~114分';
    } else if (this.totalValue > 114 && this.totalValue <= 159) {
      grade = 'C4';
      section = '114分~159分';
    } else {
      grade = 'C5';
      section = '159分以上';
    }
    return (
      <div className={styles.propriety}>
        <Title title='适当性' />
        <div className={styles.line}></div>
        {
          this.state.risk.length * this.state.lifecycle.length * this.state.invest.length * this.state.wealth.length === 0 ? <Empty image={defaultImg} description='暂无适当性数据' style={{ paddingTop: '50px', height: '300px' }} /> : (
            <div className={styles.content}>
              <div className={styles.chart}>
                <div className={styles.chart_left}>
                  <ReactEcharts option={this.getOption()} style={{ height: '400px', width: '400px' }} />
                </div>
                <div className={styles.chart_line}></div>
                <div className={styles.chart_right}>
                  <div style={{ fontFamily: 'EssenceSansStd-Regular' }}>{this.totalValue}<span>分</span></div>
                  <div>总分</div>
                  <Poptag rank={grade} section={section} type='propriety' />
                </div>
              </div>
              {/* <table border="1">
                <tbody>
                  <tr>
                    <td>
                      <div>生命周期{this.lifecycleValue}/{this.lifecycleMax}</div>
                      <div>{this.state.lifecycleTable.map((item, index) => <TableItem type='lifecycle' item={item} key={index} />)}</div>
                    </td>
                    <td>
                      <div>投资情况{this.investValue}/{this.investeMax}</div>
                      <div>{this.state.investTable.map((item, index) => <TableItem item={item} key={index} />)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>财富水平{this.wealthValue}/{this.wealtheMax}</div>
                      <div>{this.state.wealthTable.map((item, index) => <TableItem item={item} key={index} />)}</div>
                    </td>
                    <td>
                      <div>风险偏好{this.riskValue}/{this.riskMax}</div>
                      <div>{this.state.riskTable.map((item, index) => <TableItem item={item} key={index} />)}</div>
                    </td>
                  </tr>
                </tbody>
              </table> */}
              <div className={styles.table}>
                <div className={styles.top}>
                  <div>
                    <div className={styles.title}>生命周期{this.lifecycleValue}/{this.lifecycleMax}</div>
                    <div>{this.state.lifecycleTable.map((item, index) => <TableItem type='lifecycle' item={item} key={index} />)}</div>
                  </div>
                  <div>
                    <div className={styles.title}>投资情况{this.investValue}/{this.investeMax}</div>
                    <div>{this.state.investTable.map((item, index) => <TableItem item={item} key={index} />)}</div>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div>
                    <div className={styles.title}>财富水平{this.wealthValue}/{this.wealtheMax}</div>
                    <div>{this.state.wealthTable.map((item, index) => <TableItem item={item} key={index} />)}</div>
                  </div>
                  <div>
                    <div className={styles.title}>风险偏好{this.riskValue}/{this.riskMax}</div>
                    <div>{this.state.riskTable.map((item, index) => <TableItem item={item} key={index} />)}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      </div>
    );
  }
}
