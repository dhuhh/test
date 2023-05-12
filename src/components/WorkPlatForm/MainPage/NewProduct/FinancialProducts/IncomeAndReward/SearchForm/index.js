import React, { Component } from 'react';
import { Col, Row, Form, Select, Button, Divider, TreeSelect, Tooltip, Icon,Input } from 'antd';
import styles from '../index.less';
import lodash from 'lodash';
import moment from 'moment';
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '1',
      value: '', // 统计周期显示值
      basicValue: '', // 统计周期初值
      relateValue: undefined, // 统计关系显示值
      productCodeValue: '' ,
      searchValue: '',
      yybValue: [],
      initFinshed: false, // 统计关系显示值初始化是否完成
      timeDate: [], // 统计周期字典--保有量
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statPeriodData.length !== this.props.statPeriodData.length || prevProps.selectKey !== this.props.selectKey) {
      this.getTenureDate();
      const { statPeriodData , selectKey } = this.props;
      const temp = statPeriodData.find((item) => item.dispDate === '本月');
      if (temp?.isAcct === '0' ) {
        this.setState({
          value: '本月(系统统计)',
          basicValue: '本月(系统统计)',
        });
      }else if(selectKey === '5'){
        this.setState({
          value: '本月(系统统计)',
          basicValue: moment().format('yyyyMM'),
        });
      } else {
        this.setState({
          value: '本月(已核算)',
          basicValue: '本月(已核算)',
        });
      }
    }

  }

  //保有明细统计周期字典
  getTenureDate=()=>{
    let time = [];
    const basicsYear = moment().format('yyyy');
    const basicsMonth = moment().format('yyyyMM');
    const monthList = ['01', '02' , '03' , '04' , '05' ,'06' , '07' , '08' , '09' , '10' , '11' , '12'] ;
    // 动态增加本月之前所有月份
    const tipMonths = moment().format('MM'); 
    const months = monthList.slice(0,monthList.indexOf(tipMonths)) ;

    let basicsYearValue = monthList.map((item)=>`${basicsYear}${item}`).join(','); // 本年
    let blackYearValue = monthList.map((item)=>`${( basicsYear - 1)}${item}`).join(','); // 去年
    time = [
      { value: basicsMonth,name: '本月(系统统计)' },
      { value: basicsYearValue ,name: '本年(系统统计)' },
      { value: blackYearValue , name: `${ basicsYear - 1}年(系统统计)` },
      // { value: (basicsYear + '01') ,name: `${basicsYear}年01月(系统统计)` },
      { value: String((basicsYear - 1) + '12') , name: `${ (basicsYear - 1)}年12月(系统统计)` },
    ] ;  
    months.map(item =>{
      let obj = { value: (basicsYear + item) ,name: `${basicsYear}年${item}月(系统统计)` } ;
      time.push(obj);
    });
    this.setState({ timeDate: time } );
  }

  // 表单提交
  handleSubmit = () => {
    const { fetchData, selectKey } = this.props;
    if (fetchData) fetchData({ 
      key: selectKey,
    });
  }

  // 表单重置
  handleReset = () => {
    const { setData, statPeriodData = [],fetchData, statRealationData = [] , selectKey } = this.props;
    const temp = statPeriodData.find((item) => item.dispDate === '本月');
    this.setState({
      value: this.state.basicValue,
      relateValue: statRealationData[0].note,
      searchValue: '',
      productCodeValue: '' ,
      yybValue: [],
    });
    setData({
      cycleValue: '本月',
      // relateValue: '',
      department: '',
      productMajorType: '',
      productSubType: '',
      staticalPeriodStartTime: temp?.strtDate,
      staticalPeriodEndTime: temp?.endDate,
      staticalRelation: '',
      transactionBehavior: '',
      statisticalPeriod: moment().format('yyyyMM') ,
      productCode: '' ,
    });
    if (fetchData) {
      fetchData({
        key: selectKey,
        department: '',
        productMajorType: '',
        productSubType: '',
        staticalPeriodStartTime: temp?.strtDate,
        staticalPeriodEndTime: temp?.endDate,
        staticalRelation: '',
        transactionBehavior: '',
        statisticalPeriod: moment().format('yyyyMM') ,
        productCode: '' ,
      });
    }
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let { department, setData } = this.props;
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
    if (setData && typeof setData === 'function') {
      setData({
        department: department.join(','),
        productMajorType: '',
        productSubType: '',
        transactionBehavior: '',
      });
    }
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

  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }

  // 选中时间周期变化
  handleCycleChange = (value) => {
    this.setState({ value });
    const { setData, statPeriodData = [] , selectKey } = this.props;
    if (setData && typeof setData === 'function') {
      if(selectKey === '5'){
        setData( { statisticalPeriod: value });
      }else{
        const cycle = statPeriodData.find((item) => item.dispDate === value.split('(')[0]);
        setData({ 
          staticalPeriodStartTime: cycle?.strtDate,
          staticalPeriodEndTime: cycle?.endDate,
          cycleValue: cycle.dispDate,
          productMajorType: '', 
          productSubType: '',
          transactionBehavior: '',
        });
      }


    }
  }

  // 选中统计关系变化
  handleRealationChange = (value) => {
    const { setData, statRealationData } = this.props;
    if (setData && typeof setData === 'function') {
      let relateValue = {};
      if (value) {
        relateValue = statRealationData.find((item) => item.cbm === value);
      }
      setData({
        staticalRelation: value ? value : '',
        productMajorType: '',
        productSubType: '',
        transactionBehavior: '',
      });
      this.setState({
        relateValue: relateValue ? relateValue.note : '',
      });
    }
  }

  // 选中产品代码变化
  handleProductCodeChange = (e) => {
    let value = e.target ? e.target.value : '' ;
    this.setState( { productCodeValue: value });
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ productCode: value });
    }
  }
  initValue = () => {
    if (!this.state.initFinshed && lodash.get(this.props, 'statRealationData[0].note', undefined)) {
      this.setState({ relateValue: lodash.get(this.props, 'statRealationData[0].note', undefined), initFinshed: true });
    }
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


  render () {
    const { value, relateValue, searchValue,timeDate , productCodeValue } = this.state;
    const { department, selectKey, statPeriodData, statRealationData, departments } = this.props;
    this.initValue();
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className={`${styles.incomeForm} m-form-default ant-advanced-search-form`}>
        <Row>
          <Col xs={7} sm={12} md={12} lg={12} xl={12} xxl={5} className={`${styles.col}`}>
            <Form.Item className={`${styles.border} m-form-item`} label='统计周期'>
              {
                <Select
                  placeholder='请选择统计周期'
                  onChange={this.handleCycleChange}
                  value={value}
                >
                  {

                    selectKey === '5' ? (
                      timeDate.map((item, index) => (
                        <Select.Option
                          key={item.name}
                          value={item.value}
                        >
                          { item.name }
                        </Select.Option>
                      ))
                    ) : (
                      statPeriodData.map((item, index) => (
                        <Select.Option
                          key={item.dispOrd}
                          value={item.isAcct && item.isAcct === '0' ? item.dispDate + '(系统统计)' : item.dispDate + '(已核算)'}
                        // disabled={item.ibm === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                        >
                          { item.isAcct && item.isAcct === '0' ? item.dispDate + '(系统统计)' : item.dispDate + '(已核算)' }
                        </Select.Option>
                      ))
                    )

                  }
                </Select>
              }
            </Form.Item>
          </Col>
          {
            (
              <React.Fragment>
                <Col xs={7} sm={12} md={12} lg={12} xl={12} xxl={5}>
                  <Form.Item className={`${styles.org} m-form-item m-form-bss-item`} label='营业部'>
                    {
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.formatValue(department)}
                        treeData={departments}
                        // dropdownMatchSelectWidth={false}
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
                        onChange={this.handleYybChange}
                        onSearch={this.handleYybSearch}
                        treeCheckStrictly={true}
                        // showCheckedStrategy={TreeSelect.SHOW_ALL}
                      >
                      </TreeSelect>
                    }
                  </Form.Item>
                </Col>
              </React.Fragment>
            )
          }
          {
            selectKey === '3' && (
              <Col xs={10} sm={12} md={12} lg={12} xl={12} xxl={7}>
                <Form.Item className={`${styles.border} m-form-item`} label={
                  <div>
                    <span>统计关系</span>
                    <Tooltip title="跨分支机构的理财产品销售需要在OA发起签报流程，总部核算的收入和奖励才会进行对应调整。">
                      <Icon style={{ marginLeft: 5, color: '#959cba' }} type="question-circle" />
                    </Tooltip>
                  </div>
                }>
                  {
                    <Select
                      placeholder='请选择统计关系'
                      onChange={this.handleRealationChange}
                      value={relateValue}
                    >
                      {
                        statRealationData.map((item, index) => (
                          <Select.Option
                            key={item.ibm}
                            value={item.cbm}
                            // disabled={item.ibm === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                          >
                            {item.note}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  }
                </Form.Item>
              </Col>
            ) 
          }
          {
            selectKey === '5' && (
              <Col xs={10} sm={12} md={12} lg={12} xl={12} xxl={7}>
                <Form.Item className={`m-form-item`} label='产品代码'>
                  {
                    <Input value={productCodeValue}
                      onChange={(e)=>{this.handleProductCodeChange(e);}} placeholder='请输入产品代码'/>
                  }
                </Form.Item>
              </Col>
            )
            

          }

          <Form.Item style={{ cssFloat: 'right' }}>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleSubmit}>查询</Button>
            <Button className="m-btn-radius ax-btn-small" onClick={this.handleReset}>重置</Button>
          </Form.Item>
        </Row>
        {
          selectKey === '1' && (
            <Row style={{ marginBottom: 32 }}>
              <div style={{ color: '#ff6e30', fontSize: 14 }}>
                说明
              </div>
              <div style={{ color: '#61698c', fontSize: 14 }}>
                1. 系统统计：手续费收入和公募销售服务费/佣金收入每日更新，私募交易佣金收入、私募销售服务费、信托收入及其他收入系统不会每日更新。
              </div>
              <div style={{ color: '#61698c', fontSize: 14 }}>
                2. 已核算：已统计月度核算部分收入与奖励（私募、信托等后端收入），每月初更新上月数据。
              </div>
            </Row>
          )
        }
        <Divider style={{ margin: '0 0 32px 0', background: '#eaeef2' }} />
      </Form>
    );
  }
}
export default Form.create()(SearchForm);
