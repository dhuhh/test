import React from 'react';
import moment from 'moment';
import { Row, Col, DatePicker } from 'antd';

class RangeDate extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    const valueArray = value ? value.split(',') : [];
    const leftValue = valueArray[0] ? moment(valueArray[0]) : '';
    const rightValue = valueArray[1] ? moment(valueArray[1]) : '';
    this.state = {
      leftValue,
      rightValue,
    };
  }
  handleChange=(type = 'leftValue', value) => {
    const { onChange } = this.props;
    if (onChange) {
      this.state[type] = value;
      const tempLeft = moment.isMoment(this.state.leftValue) ? moment(this.state.leftValue).format('YYYYMMDD') : '';
      const tempRight = moment.isMoment(this.state.rightValue) ? moment(this.state.rightValue).format('YYYYMMDD') : '';
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
          <DatePicker min={0} onChange={(value) => { this.handleChange('leftValue', value); }} style={{ ...this.props.style }} defaultValue={this.state.leftValue} />
        </Col>
        <Col span={12}>
          <DatePicker min={0} onChange={(value) => { this.handleChange('rightValue', value); }} style={{ ...this.props.style }} defaultValue={this.state.rightValue} />
        </Col>
      </Row>
    );
  }
}
export default RangeDate;
