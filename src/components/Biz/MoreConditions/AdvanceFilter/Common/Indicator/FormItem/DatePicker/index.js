import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value,
    };
  }
  handleChange=(value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }
  render() {
    return <AntdDatePicker defaultValue={this.state.value} onChange={this.handleChange} format="YYYYMMDD" placeholder="" />;
  }
}
export default DatePicker;
