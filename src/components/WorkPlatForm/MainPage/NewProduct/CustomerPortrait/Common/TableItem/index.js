import React, { Component } from 'react';
import styles from './index.less';

export default class TableItem extends Component {
  // 格式化数字，如果数字过大，将数字格式化为数字加万。小数点精确到三位
  formatterNumber(numStr) {
    if (!numStr) {
      return '--';
    }
    const num = Number(numStr);
    // 以10000为界限
    const milestome = 10000;
    if (num > milestome) {
      // 数字部分
      const numPart = (num / milestome).toFixed(2);
      return `${numPart}万`;
    }
    return num.toFixed(2);
  }

  render() {
    return (
      <>
        {
          this.props.type === 'lifecycle' ?
            (< span className={styles.item}>{this.props.item?.question} :<span>{this.props.item?.displayValue}</span></span >) :
            (
              <span className={styles.item}>{this.props.item?.question} :<span style={{ color: '#FF6E30' }}>
                {this.props.item.question === '一年内参与投顾数量' || this.props.item.question === '高风险业务权限开通数量' ? this.props.item?.displayValue : this.formatterNumber(this.props.item?.displayValue)}
              </span></span>
            )
        }
      </>
    );
  }
}
