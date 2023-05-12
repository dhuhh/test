import React, { Component } from 'react';
import { Button, Checkbox, Col, Form, message, Row, Select } from 'antd';
import lodash from 'lodash';
import SearchInput from '../../InvestSearch/SearchInput';
import { FetchQueryFinancailCusList, FetchQueryStaticsCycleConfig } from '$services/newProduct';
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
      data: datas,  // 下拉框数据
      checkedList: checkedList, // 下拉多选框值
      statisticsCycle: [], // 统计周期数据
      selectData: [], //客户搜索下拉框数据
      checkedListProps: checkedList,
      searchTotal: [],
      loading: false,
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }
  }

  componentDidMount = () => {
    this.getQueryStatisticsCycleConfig();
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

  // 查询统计周期
  getQueryStatisticsCycleConfig = () => {
    let { tmPrd } = this.props.parentThis.state;
    FetchQueryStaticsCycleConfig({ srchScene: 3, suitTp: 1 }).then((res) => {
      const esCodeSfxStr = {
        '上日': 'current',
        '上周': 'last_week',
        '本周': 'week',
        '上月': 'last_month',
        '本月': 'month',
        '近一月': 'recent_month',
        '近三月': 'recent_three_month',
        '本年': 'year',
        '上年': 'last_year',
        '上两年': 'last_two_year',
      };
      const { records = [] } = res;
      records.forEach((record) => {
        if (!record.esCodeSfx) {
          record.esCodeSfx = esCodeSfxStr[record.cyclNm] || record.cyclVal;
          tmPrd[esCodeSfxStr[record.cyclNm]] = record.cyclVal;
        } else {
          tmPrd[record.esCodeSfx] = record.cyclVal;
        }
      });
      this.setState({ statisticsCycle: records });
      this.props.parentThis.setState({ tmPrd });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询数据
  fetchData = (p) => {
    let { sort: oldSort = [] } = this.props.parentThis.state;
    const {
      khfw: queryType = parseInt(this.props.form.getFieldsValue().khfw),
      khlx: customerType = this.props.form.getFieldsValue().khlx.join(),
      current: pageNo = this.props.parentThis.state.current,
      pageSize = this.props.parentThis.state.pageSize,
      sort = oldSort,
      timePeriod = this.props.form.getFieldsValue().tjsj,
      filter: attrConditionModels = this.props.parentThis.state.filter,
      keyword = this.SearchInput.state.seleValue,
      isSubmit = 0,
    } = p;
    if (isSubmit === 1) {
      this.props.parentThis.setState({ loading: true, attrConditionModels: [] });
    }
    if (oldSort.length) {
      let key = Object.keys(oldSort[0])[0];
      if (key) {
        const val = oldSort[0][key];
        if (key.slice(0, key.lastIndexOf('.')) === 'sale_relation.transaction_amount' || key.slice(0, key.lastIndexOf('.')) === 'sale_relation.average_market_value') {
          key = key.slice(0, key.lastIndexOf('.') + 1) + this.props.form.getFieldsValue().tjsj;
        }
        const temp = {};
        temp[key] = val;
        oldSort = [temp];
      }
    }
    const payload = {
      attrConditionModels,
      customerType, // 关系类型
      fieldsCode: [
        'customer_name',
        'customer_no',
        'customer_id',
        'market_value',
        'holding_product_number',
        'transaction_amount',
        'average_market_value',
      ], // 返回字段
      financialCusListAggModelList: [{
        code: 'market_value_merge',
        type: '1',
      }], // 主模型聚合
      financialCusListAggSunModelList: [
        {
          code: `sale_relation.transaction_amount.${timePeriod}`,
          type: '1',
        },
        {
          code: `sale_relation.average_market_value.${timePeriod}`,
          type: '1',
        },
      ], // 子模型聚合
      pagerModel: {
        pageNo,
        pageSize,
      }, // 分页
      queryType, // 客户范围 1|个人 2|团队 3|营业部
      sort, // 排序
      timePeriod,
      keyword,
    };
    FetchQueryFinancailCusList(payload).then((res) => {
      const { count = 0, data = [], agg = {}, aggSun = {} } = res;
      const { 'market_value_merge': market_value = '--' } = agg;
      const average_market_value = lodash.get(aggSun, `sale_relation.average_market_value.${timePeriod}`, '--');
      const transaction_amount = lodash.get(aggSun, `sale_relation.transaction_amount.${timePeriod}`, '--');
      const statistics = { market_value, average_market_value, transaction_amount };
      let result = [];
      data.forEach((item, index) => {
        const temp = JSON.parse(JSON.stringify(item));
        temp['no'] = (((pageNo - 1) * pageSize) + index + 1) + '';
        result.push(temp);
      });

      if (isSubmit === 1) {
        this.props.parentThis.setState({
          dataSource: result,
          total: count,
          loading: false,
          statistics,
          customerType,
          queryType,
          sort,
          timePeriod,
          keyword,
        });
      } else {
        this.props.parentThis.setState({ searchTotal: count });
        this.setState({ selectData: result, searchTotal: count, loading: false });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };

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
    this.props.form.setFieldsValue({ khlx: checkedList });
    this.setState({
      checkedList,
    });
  };

  // 表单提交
  handleSubmit = () => {
    if (this.props.form.getFieldsValue().khlx.join()) {
      this.fetchData({ current: 1, filter: [], isSubmit: 1 });
      this.props.parentThis.setState({ current: 1, filter: [] });
      const { filterCustomerThis } = this.props;
      if (filterCustomerThis) {
        filterCustomerThis.setState({ customerData: [], loading: true, pageSize: 100, checked: false, checkedGroup: [] });
      }
    }
  }

  handleFormChange = (payload, callback) => {
    this.setState(payload, () => {
      if (callback) {
        callback();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { suffixIcon = false, scene = '3', authorities = {}, teamPmsn = '0' } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    const { loading, checkedList = [], data = [], statisticsCycle = [], checkedListProps, selectData = [], searchTotal = 0 } = this.state;
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className='m-form-default ant-advanced-search-form'>
        <Row className={styles.label}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='客户范围'>
              {
                getFieldDecorator('khfw', { initialValue: scene + '' })(
                  <Select onChange={(e) => this.handleChange(e)}>
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
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className="m-form-item m-form-bss-item " label='客户类型'>
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
                      return data.length > 0 && e.value !== 'NOT_FOUND' && (
                        <Checkbox
                          checked={checkedList.filter(key => { return key === e.value; }).length > 0}
                        // disabled={e.value === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                        ></Checkbox>
                      );
                    }}
                    onChange={(e) => this.onChange(e)}
                    dropdownRender={menu => (
                      <div className='m-bss-select-checkbox'>
                        <div className='m-bss-select-dropdown'>{menu}</div>
                      </div>
                    )}
                    suffixIcon={suffixIcon && checkedList.length === 0 ? <i className='iconfont icon-search' style={{ marginTop: '-.5rem' }}></i> : ''}
                  // open
                  >
                    {
                      data.map((item, index) => (
                        <Select.Option
                          key={item.note}
                          value={item.ibm}
                        // disabled={item.ibm === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                        >
                          {item.note}
                          <div style={index === 0 ? { height: 1, backgroundColor: '#e6e7e8', position: 'relative', top: '0.666rem' } : {}}></div>
                        </Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='统计时间'>
              {
                getFieldDecorator('tjsj', { initialValue: 'last_week' })(
                  <Select>
                    {
                      statisticsCycle.map((item) => {
                        return <Select.Option key={item.cyclVal} value={item.esCodeSfx}>{item.cyclNm || '--'}</Select.Option>;
                      })
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={5}>
            <Form.Item className={`m-form-item`} label='客户查询'>
              {
                getFieldDecorator('khcx', { initialValue: '' })(
                  <SearchInput loading={loading} handleFormChange={this.handleFormChange} type="Wealth" ref={(node) => { this.SearchInput = node; }} total={searchTotal} parentThis={this} selectData={selectData} />
                )
              }
            </Form.Item>
          </Col>
          <Form.Item style={{ float: 'left' }}>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleSubmit}>查询</Button>
            <Button className="m-btn-radius ax-btn-small" onClick={() => { this.props.form.resetFields(); this.SearchInput.state.seleValue = ''; this.setState({ checkedList: checkedListProps }); this.handleSubmit(); }}>重置</Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(SearchForm);
