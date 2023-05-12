import React, { Component } from 'react';
import { Button,  Col, Form, Radio, Row, Select ,TreeSelect,DatePicker ,Checkbox } from 'antd';
import moment from 'moment';
import { getcustConver } from '$services/businessStatement';
import styles from '../../index.less';
const { MonthPicker } = DatePicker;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeType: 'year',
      timeValue: '',
      department: '', //营业部
      queryType: '4', // 客户范围 1|个人 2|团队 4|营业部
      customerType: ['0'], // 关系类型
      searchValue: '',
      data: [
        { key: '0',value: '0',label: '全部' },
        { key: '5',value: '5',label: '港股通业务开发关系' },
        { key: '10',value: '10',label: '开发关系' },
        { key: '1',value: '1',label: '服务关系' },
        { key: '11',value: '11',label: '无效户激活' },
      ],
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }
  }
  componentDidMount(){
    this.getTimeSelece();
    setTimeout(() => {
      this.fetchData();
    }, 0);
  }
  // 列表查询
  fetchData= (p)=>{
    const { parentThis } = this.props;
    parentThis.setState({ loading: true });
    let { department,dimension ,timeValue, queryType,customerType } = this.state;
    let current = p ? p.current : parentThis.state.current;
    let pageSize = p ? p.pageSize : parentThis.state.pageSize;
    let payload = { 
      current ,
      date: timeValue,
      relationshipType: customerType.join(','),
      cusScope: queryType,
      department,
      dimension,
      pageLength: 0,
      pageSize,
      paging: 1,
      sort: "",
      total: -1,
      totalRows: 0 };
    getcustConver(payload).then(res=>{
      const { total = 0, records = [] } = res;
      records.forEach((item,index)=>{
        item.no = (((current - 1) * pageSize) + index + 1) + '';
      });
      parentThis.setState({
        dataSource: records,
        total,
        loading: false,
        payload,
      });
    });
  }
  // 表单提交
  handleSubmit = () => {
    this.fetchData();
  }
  // 客户范围
  handleQueryTypeChange= (e)=>{
    this.setState({ queryType: e });
  }
  // 关系类型
  handleCustomerTypeChange=(e)=>{
    const length = e.length;
    const item = e[length - 1];
    if (item === '0') {    //如果是全部,则和其他所有关系互斥
      e.splice(0, length - 1);
    }else{
      if (e.indexOf("0") > -1) {
        e.splice(e.indexOf("0"), 1);
      }
    }
    this.setState({ customerType: e });
  }
  // 默认时间选择本年之前的所有月份
  getTimeSelece = () =>{
    let timeArr = [];
    let curTimeYear = moment().endOf('M').format('yyyy'); // 年份
    let curTimeMonth = moment().endOf('M').format('MM');  // 月份
    for(let i = 1;i <= Number(curTimeMonth);i++){
      let obj;
      if(i < 10){
        obj = curTimeYear + "0" + i;
      }else{
        obj = curTimeYear  + `${i}`;
      }
      timeArr.push(obj);
    }
    this.setState({ timeValue: timeArr.join(',') });
  }
  // 按年--时间下拉选项
  handleDateChange=(e)=>{
    let curTimeYear ; // 年份
    let curTimeMonth; // 月份
    let timeArr = [];
    // 判断选中的年份是否是当前年份
    // 获取当前时间的月份
    if(moment().endOf('M').format('yyyy') == e){
      curTimeYear = moment().endOf('M').format('yyyy');
      curTimeMonth = moment().endOf('M').format('MM');
    }else{
      curTimeYear = e;
      curTimeMonth = 12;
    }
    for(let i = 1;i <= Number(curTimeMonth);i++){
      let obj;
      if(i < 10){
        obj = curTimeYear + "0" + i;
      }else{
        obj = curTimeYear  + `${i}`;
      }
      timeArr.push(obj);
    }
    this.setState({ timeValue: timeArr.join(',') });
  }
  // 按月--时间下拉选项
  handleTimeChange= (e)=>{
    this.setState({ timeValue: e.format('yyyyMM') });
  }
  // 年月切换
  handleTimeTypeChange=(e)=>{
    this.props.form.resetFields();
    if(e.target.value === 'year'){
      this.getTimeSelece();
    }
    if(e.target.value === 'month'){
      this.setState({ timeValue: moment().endOf('M').format('yyyyMM') });
    }
    this.setState({
      timeType: e.target.value,
    });
  }
  // 时间控件
  PickDateType = () =>{
    const { getFieldDecorator } = this.props.form;
    const { timeType } = this.state;
    const yearRoot = 2021; // 开始统计日期  2021-01-01
    const yearPresent = new Date().getFullYear();  //当前时间
    const yearLength = yearPresent - yearRoot + 1; // 当前时间跟开始统计时间的长度差
    const yearArr = [];
    for(let i = 0 ;i < yearLength;i++){
      let obj = { key: yearRoot,value: yearRoot,label: yearRoot };
      obj.key =   yearRoot + i;
      obj.value = yearRoot + i ;
      obj.label = yearRoot + i;
      yearArr.push(obj);
    }
    // 时间选择范围从--当前时间往回到 2021 
    if(timeType === 'year'){ return (
      getFieldDecorator('timeValue', { initialValue: moment().endOf('M').format('yyyy') })(
        <Select style={{ width: '42%' }}  defaultActiveFirstOption={false} onChange={(value) => this.handleDateChange(value)}>
          {
            yearArr.map((item)=>{
              return <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>;
            })
          }
        </Select>
      )
    )
    ;};
    // 时间选择范围从--当前时间往回到 2021-01
    if (timeType === 'month'){ return (
      getFieldDecorator('timeValue', { initialValue: moment().endOf('M') })(
        <MonthPicker style={{ width: '42%' }}  onChange={(e) => this.handleTimeChange(e)} allowClear={false} disabledDate={(current) => current > moment().endOf('M') || current < moment().year(2021).month(0) } /> 
      )
    ); }
  }
  // 表单重置
  resetSearchForm = () => {
    const { parentThis } = this.props;
    this.setState({ timeType: 'year',department: '',timeValue: '',customerType: ['0'],queryType: '4',searchValue: '' });
    this.getTimeSelece();
    this.props.form.resetFields();
    parentThis.setState({ current: 1 },()=>{this.fetchData();});
    
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }
  
  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let { department = '' } = this.state;
    if (value.length) {
      department = department ? department.split(',') : [];
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (department.indexOf(item) === -1) department.push(item);
        });
      } else {
        array.forEach(item => {
          if (department.indexOf(item) > -1) department.splice(department.indexOf(item), 1);
        });
      }
    } else {
      department = [];
    }
    this.setState({
      department: department.join(','),
    });
    this.setState({ searchValue: this.state.searchValue });
  }
  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  }
  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYyb = [] } = this.props;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val).yybmc }));
  }

  filterTreeNode = (inputValue, treeNode) => {
  // 方式一
    const { allYyb = [] } = this.props;
    const util = (fid, title) => {
      if (fid === '0') return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
    
  }
  render() {
    const { searchValue,queryType,customerType = '', department = ''  ,timeType,data } = this.state;
    const { departments } = this.props;
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className={`${styles.label} m-form-default ant-advanced-search-form`}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`m-form-item m-form-bss-item-p`}  label='客户范围'>
              <Select value={queryType} defaultActiveFirstOption={false} onChange={(e) => this.handleQueryTypeChange(e)}>
                <Select.Option key='1' value='1'>个人</Select.Option>
                <Select.Option key='2' value='2'>团队</Select.Option>
                <Select.Option key='4' value='4'>营业部</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`m-form-item m-form-bss-item-p`}  label='关系类型'>
              <Select
                value={customerType}
                // showArrow={customerType.length === 0}
                allowClear={true}
                maxTagCount={3}
                maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                maxTagTextLength={4}
                mode='multiple'
                multiple
                defaultActiveFirstOption={false}
                menuItemSelectedIcon={e => {
                  return data.length > 0 && e.value !== 'NOT_FOUND' &&
                        (
                          <Checkbox checked={customerType.filter(key => { return key === e.value; }).length > 0} />
                        );
                }}
                dropdownRender={menu => (
                  <div className='m-bss-select-checkbox'>
                    <div className='m-bss-select-dropdown'>{menu}</div>
                  </div>
                )}
                onChange={(e) => this.handleCustomerTypeChange(e)}>
                {
                  data.map((item,index)=>(
                    <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='所属营业部'>
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                value={this.formatValue(department)}
                treeData={departments}
                dropdownClassName='m-bss-treeSelect'
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                filterTreeNode={this.filterTreeNode}
                placeholder="营业部"
                allowClear
                multiple
                searchValue={searchValue}
                treeDefaultExpandAll
                maxTagCount={3}
                maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                maxTagTextLength={7}
                treeCheckable={true}
                onSearch={this.handleYybSearch}
                onChange={this.handleYybChange}
                treeCheckStrictly={true}
              >
              </TreeSelect>
            </Form.Item>
          </Col> 
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={6}>
            <Form.Item className={`m-form-item m-form-bss-item-p`}  label='查询时间'>
              {
                this.PickDateType()
              }
              <Radio.Group value={timeType} onChange={(e) => this.handleTimeTypeChange(e)} className={styles.rdfrom}>
                <Radio.Button value='year' style={{ borderRadius: '2px',marginLeft: '10px',height: '30px',lineHeight: '28px' }}> 按年</Radio.Button>
                <Radio.Button style={{ marginLeft: '10px',border: 'solid #D1D5E6 1px',borderRadius: '2px',height: '30px',lineHeight: '28px' }} value='month'> 按月</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Form.Item style={{ cssFloat: 'left' }} className='m-form-bss-item-p'>
            <Button className="m-btn-radius ax-btn-small" onClick={() => { this.resetSearchForm(); }}>重置</Button>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleSubmit}>查询</Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
