import React, { Component } from 'react';
import styles from './index.less';

export default class index extends Component {
  state = {
    labelArr: [],
  }
  $refs = {}
  componentDidMount() {
    const chartDataC = [this.getChartsData(this.others.drawdown_1), this.getChartsData(this.others.drawdown_2), this.getChartsData(this.others.drawdown_3)];
    this.initBar(chartDataC, this.$refs.opRectRate);
  }

  get others() {
    return this.props.chartData.other;
  }

  get numBdryData() {
    let numBdryDataAdd = 0;
    let numBdryDataLess = 0;
    if (this.others.num_bdry_few && this.others.num_bdry_many) {
      numBdryDataAdd = Number(this.others.num_bdry_few) + 1;
      numBdryDataLess = Number(this.others.num_bdry_many) - 1;
    }
    return {
      numBdryDataAdd,
      numBdryDataLess,
    };
  }

  formatterDate(date) {
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }

  initBar(dataArray, id) {
    const yBarArray = dataArray; /* 把值组成数组 */
    // const totalMax = Math.max.apply(null, yBarArray); /* 获取最大值 */
    const totalMin = Math.min.apply(undefined, yBarArray); /* 获取最小值 */
    const yBarId = id;
    const yBarLi = yBarId.querySelectorAll('li');
    // const yItem = yBarId.querySelectorAll('.op-rect-x');

    // 赋值项目
    for (let i = 0; i < dataArray.length; i++) {
      // yItem[i].innerHTML = dataItem[i];
      yBarLi[i].querySelector('.op-rect-tip').innerHTML = yBarArray[i] ? `${yBarArray[i]}%` : '--';
      /* 长方形的宽度占多少百分比 */
      if (yBarArray[i] !== 0) {
        let a = 0;
        a = Math.abs(yBarArray[i]);
        a /= Math.abs(totalMin);
        a = +a.toFixed(4);
        a *= 100;
        yBarLi[i].querySelector('figure').style.height = `${a}%`;
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
      <div>
        <div
          className={styles.opRectRate}
          ref={el => this.$refs.opRectRate = el}>
          <em className={styles.opRectY}>0%</em>
          <ul>
            <li className={Number(this.others.hld_stk_lvl) === 1 ? styles.opRectChoose : ''}>
              <span className={styles.opRectX}>
                <div>
                  单一持仓
                </div>
                {
                  this.others.num_bdry_few ? (<div>(少于{this.others.num_bdry_few}只)</div>) : ''
                }
              </span>
              <figure>
                <div className={`op-rect-tip ${styles.opRectTip}`}>
                  0.00
                </div>
              </figure>
            </li>
            <li className={Number(this.others.hld_stk_lvl) === 2 ? styles.opRectChoose : ''}>
              <span className={styles.opRectX}>
                <div>均衡持仓</div>
                {
                  this.others.num_bdry_few && this.others.num_bdry_many ? (
                    <span>
                      ({this.numBdryData.numBdryDataAdd}到{this.numBdryData.numBdryDataLess}只)
                    </span>
                  ) : ''
                }

              </span>
              <figure>
                <div className={`op-rect-tip ${styles.opRectTip}`}>
                  0.00
                </div>
              </figure>
            </li>
            <li className={Number(this.others.hld_stk_lvl) === 3 ? styles.opRectChoose : ''}>
              <span className={styles.opRectX}><div>多个持仓</div>
                {
                  this.others.num_bdry_many ? (<span >(大于{this.others.num_bdry_many}只)</span>) : ''
                }
              </span>
              <figure>
                <div className={`op-rect-tip ${styles.opRectTip}`}>
                  0.00
                </div>
              </figure>
            </li>
          </ul >
        </div >
      </div >
    );
  }
}
