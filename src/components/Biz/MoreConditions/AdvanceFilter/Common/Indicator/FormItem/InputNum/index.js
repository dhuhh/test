import React from 'react';
import { InputNumber } from 'antd';

class InputNum extends React.Component {
  constructor(props) {
    super(props);
    const { value, dw = 1 } = props;
    this.state = {
      // value: (value !== '' && value > 0) ? value / parseInt(dw, 10) : value,
      value: value !== '' ? value / parseInt(dw, 10) : value,
    };
  }
  handleChange=(value) => {
    const { onChange, dw = 1 } = this.props;
    if (onChange) {
      // const tempVal = (value !== '' && value > 0) ? value * parseInt(dw, 10) : value;
      const tempVal = (value !== '' && value !== null) ? value * parseInt(dw, 10) : value;
      onChange(tempVal);
    }
  }
  render() {
    return (
      <InputNumber min={-1000000000000000} max={1000000000000000} onChange={this.handleChange} style={{ ...this.props.style }} defaultValue={this.state.value} />
    );
  }
}
export default InputNum;
