import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import styles from './index.less';

export default class index extends Component {
  state = {
    labelArr: [],
  }
  $refs = {}
  componentDidMount() {
    // const other = {
    //   ...this.props.chartData.other,
    // };
    const chartDataB = [this.getChartsData(this.props.chartData.other.rr_long), this.getChartsData(this.props.chartData.other.rr_short)];
    this.barChart(chartDataB, this.$refs.barGross2);
  }

  get others() {
    return this.props.chartData.other;
  }

  formatterDate(date) {
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }

  barChart(dataArray, id) {
    let numArray = []; /* 把值组成数组 */
    numArray = dataArray;
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
    for (let i = 0; i < dataArray.length; i++) {
      // pItem[i].querySelector('h4').innerHTML = dataItem[i];
      pItem[i].querySelector('.number-data').innerHTML = numArray[i] ? `${numArray[i]}%` : '--';
    }

    /* 最大值与最小值都大于等于0时 */
    if (totalMax >= 0 && totalMin >= 0) {
      totalNum = totalMax;
      /* 判断百分度的数值以及确定灰线的位置 */
      for (let i = 0; i < numArray.length; i++) {
        sLine[i].style.left = '2%';
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
      if (Number(this.props.chartData.other.hld_day_lvl) === 1) {
        barLi[0].classList.add(styles.prSpecial);
      } else {
        barLi[1].classList.add(styles.prSpecial);
      }
      // if (numArray[i] === totalMax && totalMax !== totalMin) {
      //   barLi[i].classList.add(styles.prSpecial);
      // }
      if (numArray[i] < 0) {
        /* 数据为负数时添加的class */
        barLi[i].classList.add(styles.prLoss);
        if (marked !== 0) {
          /* 获取为数值为负数时的定位 */
          barLi[i].querySelector('figure').style.right = `${100 - marked}%`;
          barLi[i].querySelector('figure').style.left = '';
        } else {
          barLi[i].querySelector('figure').style.right = '2%';
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
          barLi[i].querySelector('figure').style.left = '2%';
          barLi[i].querySelector('figure').style.right = '';
        }
      }

      // 为0或--时不需要交互色
      if (Number(numArray[i]) === 0) {
        barLi[i].classList.remove(styles.prWin);
      }
      /* 长方形的宽度占多少百分比 */
      if (numArray[i] !== 0) {
        const total = totalNum;
        let a = numArray[i] / total;
        a = Math.abs(a);
        a = +a.toFixed(4);
        a *= 100;
        barLi[i].querySelector('figure').style.width = `${a}%`;
        // barLi[i].querySelector('figure').style.width = `${parseFloat(Math.abs(numArray[i]) / totalNum).toFixed(4) * 100}%`;
      }
    }
  }

  barChart1(dataArray, dataItem, id) {
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
        sLine[i].style.left = '2%';
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
          barLi[i].classList.add('dt-loss');
        } else {
          barLi[i].classList.add(styles.prLoss);
        }
        if (marked !== 0) {
          /* 获取为数值为负数时的定位 */
          barLi[i].querySelector('figure').style.right = `${100 - marked}%`;
          barLi[i].querySelector('figure').style.left = '';
        } else {
          barLi[i].querySelector('figure').style.right = '2%';
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
          barLi[i].querySelector('figure').style.left = '2%';
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
  render() {
    return (
      <div className={`op-chart-graphic ${styles.opChartGraphic}`} >
        <ul
          className={`bar-total-graph ${styles.barTotalGraph}`}
          ref={el => this.$refs.barGross2 = el}
          style={{ opacity: '0' }}
        >
          <li>
            <div className={`p-item-number ${styles.pItemNumber}`}>
              <h4>长线
                {
                  this.others.day_bdry_long ? (<span>(大于{this.others.day_bdry_long}天)</span>) : ''
                }
              </h4>
              <p className={`number-data ${styles.numberData}`} />
            </div>
            <figure /><i className={`s-line ${styles.sLine}`} />
          </li>
          <li>
            <div className={`p-item-number ${styles.pItemNumber}`}>
              <h4>短线
                {
                  this.others.day_bdry_short ? (<span >(小于{this.others.day_bdry_short}天)</span>) : ''
                }
              </h4>
              <p className={`number-data ${styles.numberData}`} />
            </div>
            <figure /><i className={`s-line ${styles.sLine}`} />
          </li>
        </ul>
      </div >
    );
  }
}
