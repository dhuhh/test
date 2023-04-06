/* eslint-disable no-debugger */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Button } from 'antd';

class SimplePagination extends PureComponent {
  handleLastPage = (e) => {
    const {
      current = 1,
      pageSize = 8,
      handleLastPage,
    } = this.props;
    if (handleLastPage) {
      handleLastPage(e, current - 1, pageSize);
    }
    this.triggerChnage(current - 1, pageSize);
  }
  handleNexPage = (e) => {
    const {
      current = 1,
      pageSize = 8,
      handleNexPage,
    } = this.props;
    if (handleNexPage) {
      handleNexPage(e, current + 1, pageSize);
    }
    this.triggerChnage(current + 1, pageSize);
  }
  triggerChnage = (current, pageSize) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(current, pageSize);
    }
  }
  render() {
    const {
      className = '',
      style = {},
      current = 1,
      pageSize = 8,
      total = 0,
    } = this.props;
    return (
      <div className={classnames('clearfix', className)} style={style}>
        <span style={{ float: 'right', lineHeight: 1 }}>
          { current > 1 && <Button className="m-btn m-btn-radius m-btn-blue m-btn-radius-small m-btn-headColor" style={{ marginRight: 10, borderRadius: '2rem' }} onClick={this.handleLastPage}><span>上一页</span></Button> }
          { (current * pageSize < total) && <Button className="m-btn m-btn-radius m-btn-blue m-btn-radius-small m-btn-headColor" style={{ borderRadius: '2rem' }} onClick={this.handleNexPage}><span>下一页</span></Button> }
        </span>
      </div>
    );
  }
}

export default SimplePagination;
