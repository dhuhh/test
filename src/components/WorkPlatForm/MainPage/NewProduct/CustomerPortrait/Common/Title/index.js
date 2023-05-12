import React, { Component } from 'react';
import styles from './index.less';

export default class Title extends Component {
  render() {
    return (
      <div className={styles.title}>
        <i></i>
        <span>{this.props.title}</span>
        {this.props.children}
      </div>
    );
  }
}
