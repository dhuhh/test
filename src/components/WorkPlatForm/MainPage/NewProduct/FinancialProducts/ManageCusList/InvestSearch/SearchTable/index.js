import React, { Component } from 'react';
import { Col, message, Row, Table } from 'antd';
import lodash from 'lodash';
import FilterCustomer from '../../Common/FilterCustomer';
import FilterProduct from '../../Common/FilterProduct';
import FilterDropdown from '../../../../../../../Biz/NewProduct/FilterDropdown';
import { FetchQueryInvestPlanList } from '$services/newProduct';
import styles from '../../index.less';

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: {},
      xysfyxSelectData: [],
      dtlxSelectData: [],
      strDict: {},
    };
  }

  componentDidMount() {
    const { handleHeaderName } = this.props;
    let headerName = ['客户姓名', '客户号', '上日市值(万)', '产品名称', '产品代码', '定投类型', '定投登记日期', '协议是否有效', '定投周期', '协议金额(万)', '下一个扣款日', '成功扣款金额(万)'];
    if (handleHeaderName) {
      handleHeaderName(headerName);
    }
  }

  // 表格列
  getColumns = () => {
    const { investSearch: { state: { filter = [] } } } = this.props;
    const { strDict } = this.state;
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'no',
        key: 'no',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: (
          <div style={{ position: 'relative', top: filter.filter(item => item.esCode === 'automatic_investment_plan.customer_level').length ? '.483rem' : '' }}>
            <div>客户姓名</div>
            {
              filter.filter(item => item.esCode === 'automatic_investment_plan.customer_level').length || filter.filter(item => item.esCode === 'automatic_investment_plan.customer_level').type === '3' ? (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                >
                  { function () {
                    if (!filter.filter(item => item.esCode === 'automatic_investment_plan.customer_level')[0].esValue.length) {
                      return '(全选)';
                    } else if (filter.filter(item => item.esCode === 'automatic_investment_plan.customer_level')[0].esValue.length === 1) {
                      return '(' + strDict[filter.filter(item => item.esCode === 'automatic_investment_plan.customer_level')[0].esValue] + ')';
                    } else {
                      return '(多选)';
                    }
                  }()}
                </div>
              ) : ''
            }
          </div>
        ),
        dataIndex: 'customer_name',
        key: 'customer_name',
        className: 'm-black',
        width: 130,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
        filterDropdown: ({ confirm }) => <FilterCustomer getInstence={(_this) => { this.filterCustomerThis = _this; }} confirm={confirm} serviceType='invest' payload={this.state.payload} filterCustomerOnChange={(checked, checkedStr, strDict) => { this.setState({ strDict }); this.filterOnChange(checked, checkedStr, 'customer_level'); }} />,
        filtered: filter.map(item => item.esCode).includes('automatic_investment_plan.customer_level'),
        onFilterDropdownVisibleChange: (visible) => { this.filterVisbleChange(visible, 'customer_name'); },
      },
      {
        title: '客户号',
        dataIndex: 'customer_no',
        key: 'customer_no',
        className: 'm-black',
        width: 129,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '上日市值(万)',
        dataIndex: 'market_value',
        key: 'market_value',
        className: 'm-black',
        sorter: true,
        width: 180,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: (
          <div style={{ position: 'relative', top: filter.filter(item => item.esCode === 'automatic_investment_plan.product_name').length ? '.483rem' : '' }}>
            <div>产品名称</div>
            {
              filter.filter(item => item.esCode === 'automatic_investment_plan.product_name').length || filter.filter(item => item.esCode === 'automatic_investment_plan.product_name').type === '3' ? (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                >
                  { function () {
                    if (!filter.filter(item => item.esCode === 'automatic_investment_plan.product_name')[0].esValue.length) {
                      return '(全选)';
                    } else if (filter.filter(item => item.esCode === 'automatic_investment_plan.product_name')[0].esValue.indexOf(',') !== -1) {
                      return '(多选)';
                    } else {
                      return '(' + filter.filter(item => item.esCode === 'automatic_investment_plan.product_name')[0].esValue + ')';
                    }
                  }()}
                </div>
              ) : ''
            }
          </div>
        ),
        width: 200,
        dataIndex: 'product_name',
        key: 'product_name',
        className: 'm-black',
        render: text => <div className='m-darkgray' title={text} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text || '--'}</div>,
        filterDropdown: ({ confirm }) => <FilterProduct getInstence={(_this) => { this.filterProductThis = _this; }} confirm={confirm} columnIndex='product_name' payload={this.state.payload} filterProductOnChange={(checked, checkedStr) => { this.filterOnChange(checked, checkedStr, 'product_name'); }} />,
        filtered: filter.map(item => item.esCode).includes('automatic_investment_plan.product_name'),
        onFilterDropdownVisibleChange: (visible) => { this.filterVisbleChange(visible, 'product_name'); },
      },
      {
        title: (
          <div style={{ position: 'relative', top: filter.filter(item => item.esCode === 'automatic_investment_plan.product_code').length ? '.483rem' : '' }}>
            <div>产品代码</div>
            {
              filter.filter(item => item.esCode === 'automatic_investment_plan.product_code').length || filter.filter(item => item.esCode === 'automatic_investment_plan.product_code').type === '3' ? (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                >
                  { function () {
                    if (!filter.filter(item => item.esCode === 'automatic_investment_plan.product_code')[0].esValue.length) {
                      return '(全选)';
                    } else if (filter.filter(item => item.esCode === 'automatic_investment_plan.product_code')[0].esValue.indexOf(',') !== -1) {
                      return '(多选)';
                    } else {
                      return '(' + filter.filter(item => item.esCode === 'automatic_investment_plan.product_code')[0].esValue + ')';
                    }
                  }()}
                </div>
              ) : ''
            }
          </div>
        ),
        dataIndex: 'product_code',
        key: 'product_code',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
        width: 130,
        filterDropdown: ({ confirm }) => <FilterProduct getInstence={(_this) => { this.filterProductThis = _this; }} confirm={confirm} columnIndex='product_code' payload={this.state.payload} filterProductOnChange={(checked, checkedStr) => { this.filterOnChange(checked, checkedStr, 'product_code'); }} />,
        filtered: filter.map(item => item.esCode).includes('automatic_investment_plan.product_code'),
        onFilterDropdownVisibleChange: (visible) => { this.filterVisbleChange(visible, 'product_code'); },
      },
      {
        title: (
          <div style={{ position: 'relative', top: filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name').length && filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name')[0].esValue.length ? '.483rem' : '' }}>
            <div>定投类型</div>
            {
              filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name').length && filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name')[0].esValue.length ? (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                >
                  { function () {
                    if (filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name')[0].esValue.length === 9) {
                      return '(全选)';
                    } else {
                      return '(' + filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name')[0].esValue + ')';
                    }
                  }()}
                </div>
              ) : ''
            }
          </div>
        ),
        dataIndex: 'investment_type_name',
        key: 'investment_type_name',
        className: 'm-black',
        width: 130,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
        filterDropdown: ({ confirm }) => <FilterDropdown confirm={confirm} type='1' onChange={this.handleInvestmentTypeName} selectData={this.state.dtlxSelectData} />,
        filtered: filter.map(item => item.esCode).includes('automatic_investment_plan.investment_type_name') && filter.filter(item => item.esCode === 'automatic_investment_plan.investment_type_name')[0].esValue,
        onFilterDropdownVisibleChange: (visible) => { this.filterVisbleSelectChange(visible, 'investment_type_name'); },
      },
      {
        title: '定投登记日期',
        dataIndex: 'investment_date',
        key: 'investment_date',
        className: 'm-black',
        wdith: 129,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: (
          <div style={{ position: 'relative', top: filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name').length && filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name')[0].esValue.length ? '.483rem' : '' }}>
            <div>协议是否有效</div>
            {
              filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name').length && filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name')[0].esValue.length ? (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                >
                  { function () {
                    if (filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name')[0].esValue.length === 5) {
                      return '(全选)';
                    } else {
                      return '(' + filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name')[0].esValue + ')';
                    }
                  }()}
                </div>
              ) : ''
            }
          </div>
        ),
        dataIndex: 'is_effective_name',
        key: 'is_effective_name',
        className: 'm-black',
        width: 150,
        filterDropdown: ({ confirm }) => <FilterDropdown confirm={confirm} onChange={this.handleIsEffectiveNameChange} type='1' selectData={this.state.xysfyxSelectData} />,
        filtered: filter.map(item => item.esCode).includes('automatic_investment_plan.is_effective_name') && filter.filter(item => item.esCode === 'automatic_investment_plan.is_effective_name')[0].esValue,
        onFilterDropdownVisibleChange: (visible) => { this.filterVisbleSelectChange(visible, 'is_effective_name'); },
        render: (text, record) => (
          record.is_effective_name === '有效' ?
            <div style={{ display: 'flex', alignItems: 'center' }} className='m-darkgray'> <div className='bg-mcolor' style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '5px' }}></div>{text}</div> :
            <div style={{ display: 'flex', alignItems: 'center' }} className='m-darkgray'><div style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '5px', backgroundColor: '#D1D5E6' }}></div>{text}</div>
        ),
        // render: (text, record) => (
        //   record.is_effective_name + '' === '1' ? (
        //     <div style={{ display: 'flex', alignItems: 'center' }} className='m-darkgray'> <div className='bg-mcolor' style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '5px' }}></div>
        //         有效</div>
        //   ) :
        //     record.is_effective_name + '' === '0' ? (
        //       <div style={{ display: 'flex', alignItems: 'center' }} className='m-darkgray'>
        //         <div style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '5px', backgroundColor: '#D1D5E6' }}></div>无效</div>
        //     ) : (
        //       <div style={{ display: 'flex', alignItems: 'center' }} className='m-darkgray'>
        //         <div style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '5px', backgroundColor: '#D1D5E6' }}></div>--</div>
        //     )
        // ),
      },
      {
        title: '定投周期',
        dataIndex: 'investment_period',
        key: 'investment_period',
        className: 'm-black',
        width: 130,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '协议金额(万)',
        dataIndex: 'plan_amount',
        key: 'plan_amount',
        className: 'm-black',
        sorter: true,
        width: 150,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '下一个扣款日',
        dataIndex: 'next_deduction_date',
        key: 'next_deduction_date',
        className: 'm-black',
        sorter: true,
        width: 150,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '成功扣款金额(万)',
        width: 180,
        dataIndex: 'succeed_deduction_amount',
        key: 'succeed_deduction_amount',
        className: 'm-black',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '扣款明细',
        fixed: 'right',
        width: 100,
        className: 'm-black',
        render: (_, record) => (
          record.protocol && <div className='fs14' style={{ color: '#244fff', cursor: 'pointer' }} onClick={() => this.props.handleCheck(record.protocol)}>查看</div>
        ),
      },
    ];
  }

  handleIsEffectiveNameChange = (p) => {
    const { investSearch, searchForm } = this.props;
    if (searchForm) {
      if (!searchForm.props.form.getFieldsValue().khlx.join()) {
        message.warning('请选择关系类型 !');
        return;
      }
    }
    const { value = [] } = p;
    const { filter = [] } = investSearch.state;
    if (filter.findIndex(item => item.esCode === `automatic_investment_plan.is_effective_name`) !== -1) {
      filter[filter.findIndex(item => item.esCode === `automatic_investment_plan.is_effective_name`)].esValue = value.join(',');
    } else {
      if (value.length) {
        filter.push({ esCode: `automatic_investment_plan.is_effective_name`, esValue: value.join(','), type: 0 });
      }
    }
    searchForm.fetchData({ filter, isSubmit: 1 });
  }

  handleInvestmentTypeName = (p) => {
    const { investSearch, searchForm } = this.props;
    if (searchForm) {
      if (!searchForm.props.form.getFieldsValue().khlx.join()) {
        message.warning('请选择关系类型 !');
        return;
      }
    }
    const { value = [] } = p;
    const { filter = [] } = investSearch.state;
    if (filter.findIndex(item => item.esCode === `automatic_investment_plan.investment_type_name`) !== -1) {
      filter[filter.findIndex(item => item.esCode === `automatic_investment_plan.investment_type_name`)].esValue = value.join(',');
    } else {
      if (value.length) {
        filter.push({ esCode: `automatic_investment_plan.investment_type_name`, esValue: value.join(','), type: 0 });
      }
    }
    searchForm.fetchData({ filter, isSubmit: 1 });
  }

  // [{ ibm: '普通定投', note: '普通定投' }, { ibm: '灵动定投', note: '灵动定投' }]
  // [{ ibm: '有效', note: '有效' }, { ibm: '无效', note: '无效' }]
  filterVisbleSelectChange = (visible, name) => {
    if (visible) {
      const { searchForm = {} } = this.props;
      if (searchForm) {
        if (!searchForm.props.form.getFieldsValue().khlx.join()) {
          message.warning('请选择关系类型 !');
          return;
        }
      }
      const payload = {
        customerType: searchForm.props.form.getFieldsValue().khlx.join(),
        queryType: parseInt(searchForm.props.form.getFieldsValue().khfw),
        pagerModel: { pageNo: 1, pageSize: 100 },
        sort: [],
        fieldsCode: [
          'automatic_investment_plan.investment_type_name',
          'automatic_investment_plan.is_effective_name',
        ],
        investPlanAggModels: [],
        attrConditionModels: [{ esCode: `automatic_investment_plan.${name}`, esValue: '', type: 4 }],
      };
      FetchQueryInvestPlanList(payload).then((res) => {
        const { data = [] } = res;
        const result = [];
        data.forEach(item => {
          result.push({ ibm: item[`automatic_investment_plan.${name}`], note: item[`automatic_investment_plan.${name}`] + '(' + item[`count`] + ')' });
        });
        if (name === 'investment_type_name') {
          this.setState({ dtlxSelectData: result });
        } else if (name === 'is_effective_name') {
          this.setState({ xysfyxSelectData: result });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  // 筛选框显隐
  filterVisbleChange = (visible, name) => {
    if (visible) {
      const payload = {
        customerType: this.props.searchForm.props.form.getFieldsValue().khlx.join(),
        queryType: parseInt(this.props.searchForm.props.form.getFieldsValue().khfw),
        productNameVisible: name === 'product_name' ? true : false,
        customerNameVisible: name === 'customer_name' ? true : false,
        productCodeVisible: name === 'product_code' ? true : false,
      };
      this.setState({ payload });
    } else {
      const payload = {
        customerType: this.props.searchForm.props.form.getFieldsValue().khlx.join(),
        queryType: parseInt(this.props.searchForm.props.form.getFieldsValue().khfw),
      };
      if (name === 'product_name') {
        payload['productNameVisible'] = false;
      } else if (name === 'customer_name') {
        payload['customerNameVisible'] = false;
      } else if (name === 'product_code') {
        payload['productCodeVisible'] = false;
      }
      this.setState({ payload });
    }
  }

  // 筛选框里选中项变化
  filterOnChange = (checked, checkedStr, name) => {
    const { investSearch = {}, searchForm = {} } = this.props;
    if (searchForm) {
      if (!searchForm.props.form.getFieldsValue().khlx.join()) {
        message.warning('请选择关系类型 !');
        return;
      }
    }
    investSearch.setState({ loading: true });
    const { state: { filter: attrConditionModels = [] } } = investSearch;
    if (attrConditionModels.findIndex(item => item.esCode === `automatic_investment_plan.${name}`) !== -1) {
      const index = attrConditionModels.findIndex(item => item.esCode === `automatic_investment_plan.${name}`);
      if (checked || checkedStr) {
        attrConditionModels[index].esValue = checkedStr;
        attrConditionModels[index].type = checked ? 3 : 0;
      } else {
        attrConditionModels.splice(index, 1);
      }
    } else {
      if (checkedStr || checked) {
        attrConditionModels.push({ esCode: `automatic_investment_plan.${name}`, esValue: checkedStr, type: checked ? 3 : 0 });
      }
    }
    const payload = {
      customerType: searchForm.props.form.getFieldsValue().khlx.join(),
      queryType: parseInt(searchForm.props.form.getFieldsValue().khfw),
      pagerModel: { pageNo: 1, pageSize: investSearch.state.pageSize },
      sort: investSearch.state.sort,
      fieldsCode: [
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
      ],
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
      ],
      attrConditionModels,
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
        automatic_investment_plan['no'] = (index + 1) + '';
        result.push(automatic_investment_plan);
      });
      investSearch.setState({
        agg_market_value,
        agg_plan_amount,
        agg_succeed_deduction_amount,
        dataSource: result,
        total: count,
        loading: false,
        current: 1,
        filter: attrConditionModels,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { getInstence } = this.props;
    if (getInstence) {
      getInstence(this.filterCustomerThis, this.filterProductThis);
    }
    const { tableProps } = this.props;
    return (
      <Row style={{ padding: '0' }}>
        <Col>
          <Table {...tableProps} columns={this.getColumns()}></Table>
        </Col>
      </Row>
    );
  }
}

export default SearchTable;
