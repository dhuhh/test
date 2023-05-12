import React, { Component } from 'react';
import * as echarts from 'echarts';
import { isEmpty } from 'lodash';
import styles from './index.less';

export default class index extends Component {
  state = {
    labelArr: [],
  }
  $refs = {}

  componentDidMount() {
    const other = {
      ...this.props.chartData.other,
    };
    let labelArr = this.props.chartData.type === 'fund_aip' ? ['一次性买入', '定投', '灵活定投'] : ['3天', '5天', '10天'];
    this.setState({
      labelArr,
    });
    //数据先写死
    if (this.props.chartData.type === 'fund_aip') {
      this.props.chartData.other.chg_3 = '0.5066';
      this.props.chartData.other.chg_5 = '0.5327';
      this.props.chartData.other.chg_10 = '0.6507';
    }
    const dataArr = [this.getChartsData(other.chg_3), this.getChartsData(other.chg_5), this.getChartsData(other.chg_10)];
    this.barChart(dataArr, this.props.chartData, this.$refs.barGrpross1);
  }

  formatterDate(date) {
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }

  barChart(dataArray, dataItem, id) {
    let numArray = dataArray; /* 把值组成数组 */
    if (typeof numArray[0] === 'string') {
      numArray = numArray.map((e) => Number(e));
    }
    const totalMax = Math.max.apply(undefined, numArray); /* 获取最大值 */
    const totalMin = Math.min.apply(undefined, numArray); /* 获取最小值 */
    let totalNum = 0;
    let marked = 0;
    const barBrand = id;
    const barLi = barBrand.querySelectorAll('li');
    const sLine = barBrand.querySelectorAll('.s-line');
    const pItem = barBrand.querySelectorAll('.p-item-number');
    barBrand.style.opacity = 1;

    // 赋值项目
    for (let i = 0; i < dataItem.length; i++) {
      pItem[i].querySelector('h4').innerHTML = dataItem[i];
      pItem[i].querySelector('.number-data').innerHTML = numArray[i] ? `${numArray[i]}%` : '--';
    }

    /* 最大值与最小值都大于等于0时 */
    if (totalMax >= 0 && totalMin >= 0) {
      totalNum = totalMax;
      /* 判断百分度的数值以及确定灰线的位置 */
      for (let i = 0; i < numArray.length; i++) {
        sLine[i].style.left = '0%';
      }
    }
    /* 最大值都大于等于0与最小值小于0时 */
    if (totalMax <= 0 && totalMin < 0) {
      totalNum = Math.abs(totalMin);
      for (let i = 0; i < numArray.length; i++) {
        sLine[i].style.left = '98%';
      }
    }

    /* 最大值都大于0与最小值小于0时 */
    if (totalMax > 0 && totalMin < 0) {
      /* 当整个图表既有正数，又有负数时，百分百为最大的正数和最小的负数绝对值之和 */
      totalNum = totalMax + Math.abs(totalMin);
      marked = (Math.abs(totalMin) / totalNum);
      marked = Number(marked.toFixed(11)) * 100;
      for (let i = 0; i < numArray.length; i++) {
        sLine[i].style.left = `${marked}%`;
      }
    }

    /* 循环显示数据 */
    for (let i = 0; i < numArray.length; i++) {
      // 添加特殊标志，加金色底色
      if (Number(this.props.chartData.other.term) === 3) {
        barLi[0].classList.add(styles.prSpecial);
      } else if (Number(this.props.chartData.other.term) === 5) {
        barLi[1].classList.add(styles.prSpecial);
      } else {
        barLi[2].classList.add(styles.prSpecial);
      }
      // if (numArray[i] === totalMax && totalMax !== totalMin) {
      //   barLi[i].classList.add(styles.prSpecial);
      // }
      if (numArray[i] < 0) {
        /* 数据为负数时添加的class */
        if (this.props.chartData.type === 'fund_aip') {
          barLi[i].classList.add(styles.dtLoss);
        } else {
          barLi[i].classList.add(styles.prLoss);
        }
        if (marked !== 0) {
          /* 获取为数值为负数时的定位 */
          barLi[i].querySelector('figure').style.right = `${100 - marked}%`;
          barLi[i].querySelector('figure').style.left = '';
        } else {
          barLi[i].querySelector('figure').style.right = '';
          barLi[i].querySelector('figure').style.left = '';
        }
      } else if (numArray[i] >= 0) {
        /* 数据为正数和0时添加的class */
        barLi[i].classList.add(styles.prWin);
        if (marked !== 0) {
          /* 当整个图表既有正数，又有负数时，百分百为最大的正数和最小的负数绝对值之和 */
          barLi[i].querySelector('figure').style.left = `${marked}%`;
          barLi[i].querySelector('figure').style.right = '';
        } else if (totalMin < 0) {
          barLi[i].querySelector('figure').style.left = `${100 - marked}%`;
          barLi[i].querySelector('figure').style.right = '';
        } else {
          barLi[i].querySelector('figure').style.left = '';
          barLi[i].querySelector('figure').style.right = '';
        }
      }

      // 为0或--时不需要交互色
      if (numArray[i] === '' || Number(numArray[i]) === 0) {
        barLi[i].classList.remove(styles.prWin);
      }
      /* 长方形的宽度占多少百分比 */
      if (numArray[i] !== 0) {
        let num = 0;
        if (typeof numArray[i] === 'string' && !isEmpty(numArray[i])) {
          num = Number(numArray[i]);
        } else {
          num = numArray[i];
        }
        barLi[i].querySelector('figure').style.width = `${Number(parseFloat(`${Math.abs(num) / totalNum}`).toFixed(4)) * 100}%`;
      }
    }
  }

  getChartsData(data) {
    if (data === undefined || data === '' || data === undefined) {
      return 0;
    }
    return +((Number(data)) * 100).toFixed(2);
  }

  initChart() {
    const chart = echarts.init((this.$ref.chart), undefined, { renderer: 'svg' });
    const option = {};
    // 绘制图表
    (chart).setOption(option);
  }
  render() {
    return (
      <div className={styles.layout}>
        <div>
          <ul className={this.props.chartData && this.props.chartData.type === 'fund_aip' ? styles.dtBarTotalGraph : styles.barTotalGraph} ref={el => this.$refs.barGrpross1 = el} style={{ opacity: '0' }}>
            <li>
              <div className={`p-item-number ${styles.pItemNumber}`}>
                <h4>
                  {this.state.labelArr[0]}
                </h4>
                <p className={`number-data ${styles.numberData}`}>
                  {this.getChartsData(this.props.chartData.other.chg_3)}%
                </p>
              </div>
              <figure /><i className={`s-line ${styles.sLine}`} />
            </li>
            <li>
              <div className={`p-item-number ${styles.pItemNumber}`}>
                <h4>
                  {this.state.labelArr[1]}
                </h4>
                <p className={`number-data ${styles.numberData}`}>
                  {this.getChartsData(this.props.chartData.other.chg_5)}%
                </p>
              </div>
              <figure /><i className={`s-line ${styles.sLine}`} />
            </li>
            <li>
              <div className={`p-item-number ${styles.pItemNumber}`}>
                <h4>
                  {this.state.labelArr[2]}
                </h4>
                <p className={`number-data ${styles.numberData}`}>
                  {this.getChartsData(this.props.chartData.other.chg_10)}%
                </p>
              </div>
              <figure /><i className={`s-line ${styles.sLine}`} />
            </li>
          </ul>
        </div>
        {
          this.props.chartData.type === 'fund_aip' && <div style={{ padding: '8px', background: '#F8F8F8' }}>数据来源：wind 安信证券 2017.12.01-2020.11.10回测</div>
        }

      </div >
    );
  }
}
