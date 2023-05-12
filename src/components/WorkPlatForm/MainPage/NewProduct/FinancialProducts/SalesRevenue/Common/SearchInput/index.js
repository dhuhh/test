import React, { Component } from 'react';
import { Col, message, Row, Select, Spin } from 'antd';
import lodash from 'lodash';
import styles from '../../index.less';

class SearchInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,  // 加载状态
      searchValue: '',  // 模糊搜索输入值
      data: [],  // 下拉框数据
      showValue: '', // 选中显示值，解决数据为空时select.option选不上去
    };
    this.debounceFetchData = lodash.debounce(this.fetchData, 300);
  }
  // 输入值改变
  handleSearch = (searchValue) => {
    this.setState({ searchValue });
    this.debounceFetchData(searchValue);
  }
  // 查询数据
  fetchData = (searchValue) => {
    this.setState({ loading: true });
    const { api, type, cycles, cycleValue, departmentValue, productCode, customerName, productMajorType, productSubType } = this.props;
    const cycleItem = cycles.find(item => item.dispDate === cycleValue);
    api({
      department: type === 'departmentValue' ? searchValue : departmentValue,
      staticalPeriodStartTime: cycleItem?.strtDate,
      staticalPeriodEndTime: cycleItem?.endDate,
      productCode: type === 'productCode' ? searchValue : productCode,
      customerName: type === 'customerName' ? searchValue : customerName,
      productMajorType,
      productSubType,
      pagerModel: {
        pageNo: 1,
        pageSize: 50,
        builder: {},
      },
      productTypeConditionModels: [{
        builder: {},
        esCode: type === 'productCode' ? 'product_code' : type === 'customerName' ? 'customer_name' : 'customer_department_id',
        esValue: searchValue,
        type: 2,
      }],
    }).then((response) => {
      const { data = [], count = 0 } = response;
      let temp = [];
      if (type === 'productCode') {
        temp = data.map(item => ({ code: item.product_code, name: item.product_name }));
      } else if (type === 'customerName') {
        temp = data.map(item => ({ code: item.customer_no, name: item.customer_name }));
      } else if (type === 'departmentValue') {
        // temp = data.map(item => ({ code: item.customer_no, name: item.customer_name }));
      }
      this.setState({ data: temp, total: count, loading: false });
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  }
  // 选中option回调
  handleChange = (value) => {
    let { showValue } = this.state;
    if (value === '--') {
      value = '';
      showValue = '--';
    } else if (!value) {
      showValue = '';
    }
    this.setState({ showValue });
    const { onChange } = this.props;
    if (onChange) onChange(value);
  }
  // 获取焦点回调
  handleFocus = () => {
    this.fetchData('');
  }
  render() {
    const { type } = this.props;
    const { data = [], total = 0, loading = true, showValue = '' } = this.state;
    return (
      <Select
        className={`${styles.select} ${this.props.value && styles.searchSelect}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 20, position: 'relative', top: -5, right: 5 }}></i>}
        showSearch
        onSearch={this.handleSearch}
        value={this.props.value || showValue}
        onChange={this.handleChange}
        allowClear
        onFocus={this.handleFocus}
        dropdownRender={menu => (
          <Row>
            <Spin spinning={loading}>
              <Row type='flex' justify='end'>
                <Col style={{ padding: '8px 16px', color: '#244FFF' }}>共{total}条</Col>
              </Row>
              {menu}
            </Spin>
          </Row>
        )}
      >
        { data.map(item => <Select.Option key={item.code} value={type === 'productCode' ? item.code || '--' : item.name || '--'}><span>{item.code || '--'}  {item.name || '--'}</span></Select.Option>) }
      </Select>
    );
  }
}
export default SearchInput;
