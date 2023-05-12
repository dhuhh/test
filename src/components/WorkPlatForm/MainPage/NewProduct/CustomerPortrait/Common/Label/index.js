import React, { Component } from 'react';
import styles from './index.less';
//import good from '$assets/newProduct/customerPortrait/操作诊断-优秀icon@2x.png';
import good from '$assets/newProduct/customerPortrait/operationDiagnosis-excellentIcon@2x.png';
//import bad from '$assets/newProduct/customerPortrait/较差@2x.png';
import bad from '$assets/newProduct/customerPortrait/poor@2x.png';
//import usual from '$assets/newProduct/customerPortrait/操作诊断-一般icon@2x.png';
import usual from '$assets/newProduct/customerPortrait/operationDiagnosis-commonlyIcon@2x.png';
export default class Label extends Component {
  render() {
    let icon = [good, bad, usual];
    return (
      <span className={styles.label}>
        <img src={icon[this.props.item.level - 1]} alt=''></img>
        <span>{this.props.item.title}</span>
      </span>
    );
  }
}
