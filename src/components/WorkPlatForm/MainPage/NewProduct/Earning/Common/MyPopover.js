import { Popover } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

class MyPopover extends Component {
  render() {
    return (
      <Popover trigger='click' placement={this.props.placement || 'bottomLeft'} content={this.props.content} overlayClassName={`${styles.overlay} ${this.props.overlayClassName || ''}`}>
        { this.props.children }
      </Popover>
    );
  }
}

export default MyPopover;