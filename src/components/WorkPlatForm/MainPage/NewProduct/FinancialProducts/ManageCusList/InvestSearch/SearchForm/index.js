import React, { Component } from 'react';
import { Button, Checkbox, Col, Form, message, Row, Select } from 'antd';
import lodash from 'lodash';
import { FetchQueryInvestPlanList } from '$services/newProduct';
import SearchInput from '../SearchInput';
import styles from '../../index.less';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    const { scene = '1' } = this.props;
    let checkedList = scene === '3' ? ['0'] : ['12'];
    let datas = [];
    datas = scene === '3' ? [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }, { ibm: '0', note: '全部客户' }]
      : [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }];
    this.state = {
      checkedList: checkedList,  // 下拉多选框值
      data: datas,  // 下拉框数据
      selectData: [], //模糊搜索框数据
      checkedListProps: checkedList,
      loading: false,
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }
  }
  // 查询数据
  fetchData = (p, special = '') => {
    const { isSubmit = 0 } = p;
    if (isSubmit === 1) {
      this.props.parentThis.setState({ loading: true, attrConditionModels: [] });
    }
    this.props.parentThis.setState({ attrConditionModels: [] });
    let {
      khfw: queryType = parseInt(this.props.form.getFieldsValue().khfw),
      khlx: customerType = this.props.form.getFieldsValue().khlx.join(),
      current: pageNo = this.props.parentThis.state.current,
      pageSize = this.props.parentThis.state.pageSize,
      sort = this.props.parentThis.state.sort,
      filter: attrConditionModels = this.props.parentThis.state.filter,
      esValue = this.SearchInput.state.seleValue,
    } = p;
    let item = {};
    if (special === 'searchInput') {
      item = { type: 5, esCode: 'automatic_investment_plan.customer_no,automatic_investment_plan.customer_name', esValue: esValue };
    } else {
      item = { type: 6, esCode: 'automatic_investment_plan.customer_no,automatic_investment_plan.customer_name', esValue: esValue };
    }
    let fieldsCode = isSubmit === 1 ? [
      'automatic_investment_plan.customer_name',
      'automatic_investment_plan.customer_no',
      'automatic_investment_plan.customer_id',
      'automatic_investment_plan.market_value',
      'automatic_investment_plan.product_name',
      'automatic_investment_plan.product_id',
      'automatic_investment_plan.product_code',
      'automatic_investment_plan.investment_type_name',
      'automatic_investment_plan.investment_date',
      'automatic_investment_plan.is_effective_name',
      'automatic_investment_plan.investment_period',
      'automatic_investment_plan.plan_amount',
      'automatic_investment_plan.next_deduction_date',
      'automatic_investment_plan.succeed_deduction_amount',
      'automatic_investment_plan.protocol',
    ] : ['automatic_investment_plan.customer_no', 'automatic_investment_plan.customer_name'];
    attrConditionModels.push(item);
    const payload = {
      attrConditionModels, // 筛选
      customerType, // 关系类型
      fieldsCode, // 返回字段
      investPlanAggModels: [
        {
          code: 'automatic_investment_plan.market_value',
          type: '1',
        },
        {
          code: 'automatic_investment_plan.plan_amount',
          type: '1',
        },
        {
          code: 'automatic_investment_plan.succeed_deduction_amount',
          type: '1',
        },
      ], // 聚合
      pagerModel: {
        pageNo,
        pageSize,
      }, // 分页
      queryType, // 客户范围 1|个人 2|团队 3|营业部
      sort, // 排序
    };
    FetchQueryInvestPlanList(payload).then((res) => {
      const { count = 0, data = [], agg = {} } = res;
      const {
        'automatic_investment_plan.market_value': agg_market_value = '--',
        'automatic_investment_plan.plan_amount': agg_plan_amount = '--',
        'automatic_investment_plan.succeed_deduction_amount': agg_succeed_deduction_amount = '--',
      } = agg;
      let result = [];
      data.forEach((item, index) => {
        let automatic_investment_plan = lodash.get(item, 'automatic_investment_plan', {});
        automatic_investment_plan['no'] = (((pageNo - 1) * pageSize) + index + 1) + '';
        result.push(automatic_investment_plan);
      });
      if (isSubmit === 1) {
        this.props.parentThis.setState({
          agg_market_value,
          agg_plan_amount,
          agg_succeed_deduction_amount,
          dataSource: result,
          total: count,
          loading: false,
          customerType,
          queryType,
          sort,
          pageNo,
          filter: attrConditionModels,
        });
      } else {
        this.props.parentThis.setState({ searchTotal: count });
        this.setState({ selectData: result, loading: false });
      }

    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 客户类型下拉框
  onChange = (checkedList) => {
    const length = checkedList.length;
    const item = checkedList[length - 1];
    if (item === '0') {    //如果是全部客户,则和其他所有关系互斥
      checkedList.splice(0, length - 1);
    } else {
      if (item === "12") {   //如果是销售关系
        checkedList.splice(0, length - 1);
      } else {
        if (checkedList.indexOf("12") > -1) {
          checkedList.splice(checkedList.indexOf("12"), 1);
        }
        if (checkedList.indexOf("0") > -1) {
          checkedList.splice(checkedList.indexOf("0"), 1);
        }
      }
    }
    this.setState({
      checkedList: checkedList,
    });
    this.props.form.setFieldsValue({ khlx: checkedList });

  };
  // 下拉多选框显示
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };
  // 表单提交
  handleSubmit = () => {
    if (this.props.form.getFieldsValue().khlx.join()) {
      this.fetchData({ current: 1, filter: [], isSubmit: 1 });
      this.props.parentThis.setState({ current: 1, filter: [] });
      const { filterCustomerThis, filterProductThis } = this.props;
      if (filterCustomerThis) {
        filterCustomerThis.setState({ customerData: [], loading: true, pageSize: 100, checked: false, checkedGroup: [] });
      }
      if (filterProductThis) {
        filterProductThis.setState({ productData: [], hasMore: true, loading: true, pageSize: 15, checked: false, checkedGroup: [] });
      }
    }
  }
  handleChange = (e) => {
    const oldData = [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }];
    const newData = [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }, { ibm: '0', note: '全部客户' }];
    if (e === '3') {
      const checkedList = ['0'];
      this.setState({ data: newData, checkedList: ['0'] });
      this.props.form.setFieldsValue({ khlx: checkedList });
    } else {
      const checkedList = ['12'];
      this.setState({ data: oldData, checkedList: ['12'] });
      this.props.form.setFieldsValue({ khlx: checkedList });
    }
  }

  handleFormChange = (payload, callback) => {
    this.setState(payload, () => {
      if (callback) {
        callback();
      }
    });
  }

  resetSearchForm = () => {
    this.SearchInput.setState({ seleValue: '' });
    const { checkedListProps } = this.state;
    this.props.form.setFieldsValue({ khcx: '' });
    this.state.checkedList = checkedListProps;
    this.props.form.resetFields();
    this.handleSubmit();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { suffixIcon = false, scene = '3', authorities = {}, teamPmsn = '0', searchTotal = 0 } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    const { checkedList, data, selectData = [], checkedListProps, loading } = this.state;
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className='m-form-default ant-advanced-search-form'>
        <Row className={styles.label}>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='客户范围'>
              {
                getFieldDecorator('khfw', { initialValue: scene + '' })(
                  <Select defaultActiveFirstOption={false} onChange={(e) => this.handleChange(e)}>
                    <Select.Option key='1' value='1'>个人</Select.Option>
                    {teamPmsn === '1' && <Select.Option key='2' value='2'>团队</Select.Option>}
                    {
                      productPanoramaAuth.includes('yyb') && <Select.Option key='3' value='3'>营业部</Select.Option>
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={5}>
            <Form.Item className="m-form-item m-form-bss-item" label='客户类型'>
              {
                getFieldDecorator('khlx', { initialValue: checkedList, rules: [{ required: true, message: '请选择客户类型' }] })(
                  <Select
                    placeholder='请选择客户类型'
                    filterOption={(input, option) => option.key.indexOf(input) >= 0}
                    showArrow={checkedList.length === 0}
                    allowClear={true}
                    mode='multiple'
                    multiple
                    defaultActiveFirstOption={false}
                    maxTagCount={3}
                    maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                    maxTagTextLength={7}
                    menuItemSelectedIcon={e => {
                      return data.length > 0 && e.value !== 'NOT_FOUND' &&
                        (
                          <Checkbox
                            checked={checkedList.filter(key => { return key === e.value; }).length > 0}
                          //</Form.Item>disabled={e.value === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                          >
                          </Checkbox>
                        );
                    }}
                    onChange={(e) => this.onChange(e)}
                    // className='m-bss-select-checkbox m-bss-select-dropdown m-bss-select-dropdown-title'
                    dropdownRender={menu => (
                      <div className='m-bss-select-checkbox'>
                        <div className='m-bss-select-dropdown'>{menu}</div>
                      </div>
                    )}
                    suffixIcon={suffixIcon && checkedList.length === 0 ? <i className='iconfont icon-search' style={{ marginTop: '-.5rem' }}></i> : ''}
                  // open
                  >
                    {data.map((item, index) => (
                      <Select.Option key={item.note} value={item.ibm}
                      // disabled={item.ibm === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                      >
                        {item.note}
                        <div style={index === 0 ? { height: 1, backgroundColor: '#e6e7e8', position: 'relative', top: '0.666rem' } : {}}></div>
                      </Select.Option>
                    ))}
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={5}>
            <Form.Item className={`m-form-item`} label='客户查询'>
              {
                getFieldDecorator('khcx', { initialValue: '' })(
                  <SearchInput handleFormChange={this.handleFormChange} loading={loading} type="Invest" ref={(node) => { this.SearchInput = node; }} total={searchTotal} selectData={selectData} parentThis={this} />
                )
              }
            </Form.Item>
          </Col>
          <Form.Item style={{ float: 'left' }}>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleSubmit}>查询</Button>
            <Button className="m-btn-radius ax-btn-small" onClick={() => { this.resetSearchForm(); }}>重置</Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
