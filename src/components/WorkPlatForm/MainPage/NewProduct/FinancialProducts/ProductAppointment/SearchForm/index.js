import React, { Component } from 'react';
import { Button, Col, Form,DatePicker, Row, Input , message } from 'antd';
import moment from 'moment';
import styles from '../index.less';
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 加载状态
      indeterminate: false,
      prodCodeValue: '',
      custCodeValue: '' ,
      dates: [moment().startOf('day').subtract(7,'d'),moment().endOf('day')], 
    };
  }
  // 表单提交
  handleSubmit = () => {
    const { dates } = this.state ;
    if(dates.length !== 2 ){
      message.error('请选择完整时间范围');
    }
    const { fetchData } = this.props;
    if (fetchData) fetchData();
  }

  // 表单重置
  handleReset = () => {
    const { fetchData, setData } = this.props;
    setData({ prodCode: '',custCode: '' ,cycleValue: [moment().startOf('day').subtract(7,'d'),moment().endOf('day')] });
    this.setState( { 
      custCodeValue: '' ,
      prodCodeValue: '' ,
      dates: [moment().startOf('day').subtract(7,'d'),moment().endOf('day')],
    },()=>{
      if (fetchData) fetchData();
    });
  }


  // 选中时间变化
  handleCycleChange = (value) => {
    if(value.length === 0 ){
      this.setState( { dates: [] });
    }
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ cycleValue: value });
    }
  }
  // 选中日期时
  CalendarChange=(value)=>{
    this.setState({ dates: value });
  }

  //是否隐藏
  disabledDate=(current)=>{
    let { dates } = this.state;
    if (!dates || dates.length === 0) {
      return false;
    } 
    let center = dates[0] ;
    const start = moment(center).subtract(21,'days') > current;
    const end = moment(center).add(21,'days') < current;
    return start || end;
  }
  // 选中产品代码变化
  handProduct = (e) => {
    let value = e.target ? e.target.value : '' ;
    this.setState( { prodCodeValue: value });
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ prodCode: value });
    }
  }

  // 选中客户姓名变化
  handCoumter = (e) => {
    let value = e.target ? e.target.value : '' ;
    this.setState( { custCodeValue: value });
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ custCode: value });
    }
  }

  render() {
    const { custCodeValue , prodCodeValue , dates } = this.state;
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className='m-form-default ant-advanced-search-form'>
        <Row className={styles.label}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={9} style={{display:'flex'}}>
            <Form.Item className={`${styles.border} m-form-item`} label='统计时间'>
              <DatePicker.RangePicker
                mode={['day', 'day']}
                allowClear={false}
                value={dates}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                placeholder={['开始日期', '结束日期']}
                format={"YYYY-MM-DD"}
                separator='至'
                onChange={(e)=>this.handleCycleChange(e)}
                onCalendarChange={this.CalendarChange}
                disabledDate={this.disabledDate}
              />
            </Form.Item>
            <div style={{marginTop:"10px",marginLeft:"10px"}}>时间跨度最长为三周</div>
          </Col>

          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='客户代码'>
              <Input
                placeholder="请输入客户代码"
                onChange={(e)=>this.handCoumter(e)}
                value={custCodeValue}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item `} label='产品代码'>
              <Input
                placeholder="请输入产品代码"
                onChange={(e)=>this.handProduct(e)}
                value={ prodCodeValue }
              />
            </Form.Item>
          </Col>
          <Form.Item style={{ cssFloat: 'left' }}>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleSubmit}>查询</Button>
            <Button className="m-btn-radius ax-btn-small" onClick={this.handleReset}>重置</Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}
export default SearchForm;
