import React from 'react';
import { Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import indicatorJSON from '../../../../../JSON/indicatorJSON';

// 高级筛选-开户日期组件
class KHRQ extends React.Component {
  constructor(props) {
    super(props);
    const { value, tempData, onChange } = props;
    const valueArray = value[1] ? value[1].split(',') : [];
    this.state = {
      leftValue: valueArray[0] ? moment(valueArray[0]) : null,
      rightValue: valueArray[1] ? moment(valueArray[1]) : null,
      selectValue: value[0] ? value[0] : (tempData[0] ? tempData[0].ibm : ''), // eslint-disable-line
    };
    const leftDate = moment.isMoment(this.state.leftValue) ? this.state.leftValue.format('YYYYMMDD') : '';
    const rightDate = moment.isMoment(this.state.rightValue) ? this.state.rightValue.format('YYYYMMDD') : '';
    const finnalValue = `${this.state.selectValue}${indicatorJSON.separator}${leftDate},${rightDate}`;
    onChange(finnalValue);
  }
  handleChange=(type = 'leftValue', value) => {
    const { onChange, tempData } = this.props;
    if (onChange) {
      this.state[type] = value;
      let leftDate = moment.isMoment(moment(this.state.leftValue)) ? moment(this.state.leftValue).format('YYYYMMDD') : '';
      let righttDate = moment.isMoment(moment(this.state.rightValue)) ? moment(this.state.rightValue).format('YYYYMMDD') : '';
      leftDate = leftDate.replace('Invalid date', '');
      righttDate = righttDate.replace('Invalid date', '');
      const finnalValue = `${this.state.selectValue}${indicatorJSON.separator}${leftDate},${righttDate}`;
      const name = tempData.findIndex((item) => { return `${item.ibm}` === `${this.state.selectValue}`; }) >= 0 ? tempData[tempData.findIndex((item) => { return `${item.ibm}` === `${this.state.selectValue}`; })].note : ''; // 获取字典名称
      if (name === '信用账户' || name === '股票期权账户' || name === '理财账户') { // 这三种账户，日期不能全部为空
        this.setState({
          [type]: value,
        }, onChange(!leftDate && !righttDate ? '' : finnalValue));
      } else {
        this.setState({
          [type]: value,
        }, onChange(finnalValue));
      }
    }
  }
  render() {
    const { tempData } = this.props;
    return (
      <Row gutter={12}>
        <Col span={8}>
          <Select value={this.state.selectValue} onChange={(value) => { this.handleChange('selectValue', value); }} getPopupContainer={() => document.getElementById('advance_modal')} dropdownMatchSelectWidth style={{ width: '100%' }}>
            {tempData.map((item) => {
            const { ibm, note } = item;
            return <Select.Option title={note} key={ibm} value={ibm}>{note}</Select.Option>;
              })}
          </Select>
        </Col>
        <Col span={8}>
          <DatePicker onChange={(value) => { this.handleChange('leftValue', value); }} format="YYYYMMDD" defaultValue={this.state.leftValue} placeholder="" />
        </Col>
        <Col span={8}>
          <DatePicker onChange={(value) => { this.handleChange('rightValue', value); }} format="YYYYMMDD" defaultValue={this.state.rightValue} placeholder="" />
        </Col>
      </Row>
    );
  }
}
export default KHRQ;
