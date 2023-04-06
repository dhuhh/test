/* eslint-disable no-debugger */

import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

class MonthDatePicker extends React.Component {
  state = {
    mode: ['month', 'month'],
    value: [],
  };

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
    const { handleChangeC } = this.props;
    handleChangeC(value);
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  render() {
    const { value, mode } = this.state;
    return (
      <RangePicker
        placeholder={['选择开始月份', '选择结束月份']}
        format="YYYY-MM"
        value={value}
        mode={mode}
        onChange={this.handleChange}
        onPanelChange={this.handlePanelChange}
      />
    );
  }
}

export default MonthDatePicker;

