import React, { Component } from 'react';
import { Button, Checkbox, Col, Form, Icon, message, Row, Select, Spin, TreeSelect } from 'antd';
import lodash, { divide } from 'lodash';
import SearchInput from '../Common/SearchInput';
import { FetchSaleAndIncomeList } from '$services/newProduct';
import styles from '../index.less';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      departments: [],
      loading: true,  // 加载状态
      checkAll: false,
      indeterminate: false,
    };
    this.debounceFetchSelectData = lodash.debounce(this.fetchSelectData, 300);
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };

  // 表单提交
  handleSubmit = () => {
    const { fetchData } = this.props;
    if (fetchData) fetchData();
  }

  // 查询数据
  fetchSelectData = (searchValue) => {
    this.setState({ loading: true });
    const { cycles, cycleValue, productCode, customerName, productMajorType, productSubType } = this.props;
    const cycleItem = cycles.find(item => item.dispDate === cycleValue);
    FetchSaleAndIncomeList({
      department: searchValue,
      staticalPeriodStartTime: cycleItem?.strtDate,
      staticalPeriodEndTime: cycleItem?.endDate,
      productCode,
      customerName,
      productMajorType,
      productSubType,
      pagerModel: {
        pageNo: 1,
        pageSize: 50,
        builder: {},
      },
      productTypeConditionModels: [{
        builder: {},
        esCode: 'customer_department_id',
        esValue: searchValue,
        type: 2,
      }],
    }).then((response) => {
      const { data = [], count = 0 } = response;
      let temp = [];
      temp = data.map(item => ({ customer_department_id: item.customer_department_id, customer_department: item.customer_department }));
      this.setState({ departments: temp, total: count, loading: false });
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  }

  // 表单重置
  handleReset = () => {
    this.setState({ searchValue: '' });
    const { fetchData, setData, cycles } = this.props;
    const temp = cycles.find((item) => item.dispDate === '本月');
    setData({
      cycleValue: '本月',
      departmentValue: '',
      productCode: '',
      customerName: '',
      productMajorType: '',
      productSubType: '',
    });
    if (fetchData) fetchData({
      department: '',
      staticalPeriodStartTime: temp?.strtDate,
      staticalPeriodEndTime: temp?.endDate,
      productCode: '',
      customerName: '',
      productMajorType: '',
      productSubType: '',
    });
  }

  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ departmentValue: value.join(','), productMajorType: '', productSubType: '' });
    }
  }

  // 选中时间周期变化
  handleCycleChange = (value) => {
    const { setData, cycles = [] } = this.props;
    if (setData && typeof setData === 'function') {
      const cycleValue = cycles.find((item) => item.dispDate === value).dispDate;
      setData({ cycleValue, productMajorType: '', productSubType: '' });
    }
  }

  // 选中产品代码变化
  handleProductCodeChange = (value) => {
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ productCode: value, productMajorType: '', productSubType: '' });
    }
  }

  // 选中客户姓名变化
  handleCustomerNameChange = (value) => {
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ customerName: value, productMajorType: '', productSubType: '' });
    }
  }

  // 选中客户姓名变化
  handleDepartmentValueChange = (value) => {
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ departmentValue: value, productMajorType: '', productSubType: '' });
    }
  }

  selectChange = (value) => {
    const { setData } = this.props;
    if (setData && typeof setData === 'function') {
      setData({ departmentValue: value.join(','), productMajorType: '', productSubType: '' });
    }
  }

  selectSearch = (value) => {
    this.setState({ searchValue: value });
    this.debounceFetchSelectData(value);
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };

  onCheckAllChange = (e) => {

  }

  render() {
    const { scene = '1', authorities = {}, teamPmsn = '0', cycles = [], cycleValue = '', departmentValue = '', productCode = '', customerName = '', productMajorType = '', productSubType = '' } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    const { departments = [] } = this.state;
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className='m-form-default ant-advanced-search-form'>
        <Row className={styles.label}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='统计周期'>
              <Select
                className={styles.select}
                suffixIcon={<i className='iconfont icon-rili'></i>}
                onChange={this.handleCycleChange}
                value={cycleValue}
              >
                {
                  cycles.map((item) => {
                    return <Select.Option key={item.dispOrd} value={item.dispDate}>{item.dispDate || '--'}</Select.Option>;
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`${styles.border} ${styles.org} m-form-item m-form-bss-item`} label='客户所在营业部'>
              {/* <SearchInput value={departmentValue} onChange={this.handleDepartmentValueChange} type='departmentValue' api={FetchSaleAndIncomeList} cycles={cycles} cycleValue={cycleValue} departmentValue={departmentValue} productCode={productCode} customerName={customerName} productMajorType={productMajorType} productSubType={productSubType} /> */}
              <Select
                mode='multiple'
                value={departmentValue ? departmentValue.split(',') : []}
                onChange={this.selectChange}
                searchValue={this.state.searchValue}
                onSearch={this.selectSearch}
                onFocus={() => { this.fetchSelectData(this.state.searchValue); }}
                onBlur={() => { this.setState({ searchValue: '' }); }}
                showArrow={!departmentValue}
                allowClear={true}
                multiple
                defaultActiveFirstOption={false}
                maxTagCount={3}
                maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                maxTagTextLength={7}
                menuItemSelectedIcon={e => {
                  return departments.length > 0 && e.value !== 'NOT_FOUND' && (
                    <Checkbox
                      checked={departmentValue.split(',').filter(key => { return key === e.value; }).length > 0}
                    ></Checkbox>
                  );
                }}
                dropdownRender={menu => (
                  <Spin spinning={this.state.loading}>
                    <div className='m-bss-select-checkbox'>
                      <div className='m-bss-select-dropdown'>
                        {/* {departments.length > 0 && (
                        <div style={{ borderBottom: '1px solid #EAECF2', width: '100%', padding: '10px 20px', display: 'flex', flexWrap: 'nowrap' }}>
                          <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={(e) => this.onCheckAllChange(e)}
                            checked={this.state.checkAll}
                          >
                            全选
                          </Checkbox>
                        </div>
                      )} */}
                        {menu}
                      </div>
                    </div>
                  </Spin>
                )}
              >
                {
                  departments.map((item) => {
                    return <Select.Option key={item.customer_department_id} value={item.customer_department_id}>{ item.customer_department_id || '--' }  { item.customer_department || '--' }</Select.Option>;
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`m-form-item`} label='产品代码'>
              <SearchInput value={productCode} onChange={this.handleProductCodeChange} type='productCode' api={FetchSaleAndIncomeList} cycles={cycles} cycleValue={cycleValue} departmentValue={departmentValue} productCode={productCode} customerName={customerName} productMajorType={productMajorType} productSubType={productSubType} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`m-form-item`} label='客户姓名'>
              <SearchInput value={customerName} onChange={this.handleCustomerNameChange} type='customerName' api={FetchSaleAndIncomeList} cycles={cycles} cycleValue={cycleValue} departmentValue={departmentValue} productCode={productCode} customerName={customerName} productMajorType={productMajorType} productSubType={productSubType} />
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
