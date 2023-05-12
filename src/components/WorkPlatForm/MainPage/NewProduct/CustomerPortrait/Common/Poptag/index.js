import React, { Component } from 'react';
import styles from './index.less';

export default class Poptag extends Component {
  render() {
    return (
      <>
        {
          this.props.type === 'ability' ? (
            <div className={styles.popTag}>
              <span>该客户的投资能力战胜了<span>{this.props.rank}</span>的安信用户</span>
            </div>
          ) : (
              <div className={styles.popTag}>
                <span>参考评级: <span>{this.props.rank}</span>, 分值区间: {this.props.section}</span>
              </div>
            )
        }
      </>
    );
  }
}
