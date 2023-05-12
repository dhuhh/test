import React from 'react';
import { InputNumber, Row, Col } from 'antd';

class RangeInput extends React.Component {
  constructor(props) {
    super(props);
    const { value, dw = 1 } = props;
    const valueArray = value ? value.split(',') : [];
    const leftValue = valueArray[0] || '';
    const rightValue = valueArray[1] || '';
    this.state = {
      // leftValue: (leftValue !== '' && leftValue > 0) ? leftValue / parseFloat(dw, 10) : leftValue,
      // rightValue: (rightValue !== '' && rightValue > 0) ? rightValue / parseFloat(dw, 10) : rightValue,
      leftValue: (leftValue !== '') ? leftValue / parseFloat(dw, 10) : leftValue,
      rightValue: (rightValue !== '') ? rightValue / parseFloat(dw, 10) : rightValue,
    };
  }
  handleChange = (type = 'leftValue', value) => {
    const { onChange, dw = 1 } = this.props;
    if (onChange) {
      this.state[type] = value;
      let tempLeft = (this.state.leftValue !== '' && this.state.leftValue !== null) ? this.state.leftValue * parseFloat(dw, 10) : this.state.leftValue;
      let tempRight = (this.state.rightValue !== '' && this.state.rightValue !== null) ? this.state.rightValue * parseFloat(dw, 10) : this.state.rightValue;
      tempLeft = (tempLeft || tempLeft === 0) ? tempLeft : '';
      tempRight = (tempRight || tempRight === 0) ? tempRight : '';
      const finnalValue = `${tempLeft},${tempRight}`;
      this.setState({
        [type]: value,
      }, onChange(finnalValue === ',' ? '' : finnalValue));
    }
  }
  render() {
    return (
      <Row gutter={12}>
        <Col span={12}>
          <InputNumber min={-1000000000000000} max={1000000000000000} onChange={(value) => { this.handleChange('leftValue', value); }} style={{ ...this.props.style }} defaultValue={this.state.leftValue} />
        </Col>
        <Col span={12}>
          <InputNumber min={-1000000000000000} max={1000000000000000} onChange={(value) => { this.handleChange('rightValue', value); }} style={{ ...this.props.style }} defaultValue={this.state.rightValue} />
        </Col>
      </Row>
    );
  }
}
export default RangeInput;
