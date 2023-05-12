import React, { Component } from 'react';
import { Col, Row, Table, message, Popover } from 'antd';
import lodash from 'lodash';
import FilterCustomer from '../../Common/FilterCustomer';
import { FetchQueryFinancailCusList, QueryOtherListDisplayColumn } from '$services/newProduct';
import styles from '../../index.less';

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: {},
      colName: [],
      columnExtraTitle: {}, // 红色小字
      strDict: {},
    };
  }

  componentDidMount() {
    this.queryOtherListDisplayColumn();
  }

  queryOtherListDisplayColumn = () => {
    QueryOtherListDisplayColumn({
      srchScene: 3, // 2|产品详情列表;3|理财客户列表;4|理财客户列表弹窗
    }).then((res) => {
      const { records = [] } = res;
      let result = [];
      records.forEach((item) => {
        result.push(item.dispCol);
      });
      const { handleHeaderName } = this.props;
      if (handleHeaderName) {
        const temp = JSON.parse(JSON.stringify(result));
        const title = temp[4];
        temp.splice(4, 1);
        temp.splice(2, 0, title);
        handleHeaderName(temp);
      }
      this.setState({ colName: result });
    }).catch((err) => {
      message.error(err.note || err.message);
    });
  }

  // handleSetPayload = (payload) => {
  //   this.setState(payload);
  // }

  renderColumns = (text) => {
    text = text || '';
    if(text.includes('.')) { //如果是浮点数
      let textArr = text.split('.');
      let textOne = textArr[0];
      let textSecond = text.substring(text.indexOf('.') + 1, text.indexOf('.') + 3);
      return <Popover content={<span className='m-darkgray'>{text}</span>}><span className='m-darkgray'>{textOne + '.' + textSecond}</span></Popover>;
    } else {
      return <div className='m-darkgray'>{text || '--'}</div>;
    }

  }

  // 表格列
  getColumns = () => {
    const { wealthCusList: { state: { filter = [] } }, searchForm = {} } = this.props;
    const { colName = [], columnExtraTitle = {} } = this.state;
    const { strDict } = this.state;
    return [
      {
        title: '序号',
        dataIndex: 'no',
        width: 80,
        key: 'no',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        //title: lodash.get(colName, '[0]', '--'),
        title: (
          <div style={{ position: 'relative', top: filter.filter(item => item.esCode === 'customer_level').length ? '.483rem' : '' }}>
            <div>{lodash.get(colName, '[0]', '--')}</div>
            {
              filter.filter(item => item.esCode === 'customer_level').length || filter.filter(item => item.esCode === 'customer_level').type === '3' ? (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                >
                  { function () {
                    if (!filter.filter(item => item.esCode === 'customer_level')[0].esValue.length) {
                      return '(全选)';
                    } else if (filter.filter(item => item.esCode === 'customer_level')[0].esValue.length === 1) {
                      return '(' + strDict[filter.filter(item => item.esCode === 'customer_level')[0].esValue] + ')';
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
        onHeaderCell: () => ({ style: { minWidth: 202, maxWidth: 260 } }),
        onCell: () => ({ style: { minWidth: 202, maxWidth: 260 } }),
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
        filterDropdown: ({ confirm }) => <FilterCustomer getInstence={(_this) => { this.filterCustomerThis = _this; }} handleFormChange={this.props.handleFormChange} columnExtraTitle={columnExtraTitle} handleSetPayload={this.handleSetPayload} confirm={confirm} serviceType='wealth' payload={this.state.payload} filterCustomerOnChange={(checked, checkedStr, strDict) => { this.setState({ strDict }); this.filterOnChange(checked, checkedStr, 'customer_level'); }} />,
        filtered: filter.map(item => item.esCode).includes('customer_level'),
        onFilterDropdownVisibleChange: (visible) => { this.filterVisbleChange(visible, 'customer_name'); },
      },
      {
        title: lodash.get(colName, '[1]', '--'),
        dataIndex: 'customer_no',
        key: 'customer_no',
        className: 'm-black',
        onHeaderCell: () => ({ style: { minWidth: 126, maxWidth: 260 } }),
        onCell: () => ({ style: { minWidth: 126, maxWidth: 260 } }),
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: lodash.get(searchForm, 'props.form', '') && searchForm.props.form.getFieldsValue().khlx.join() === '12' ? '销售金额(万)' : lodash.get(colName, '[4]', '--'),
        dataIndex: 'transactionAmount',
        key: 'transaction_amount',
        className: 'm-black',
        onHeaderCell: () => ({ style: { minWidth: 148, maxWidth: 261 } }),
        onCell: () => ({ style: { minWidth: 148, maxWidth: 261 } }),
        sorter: true,
        render: text => this.renderColumns(text),
      },
      {
        title: lodash.get(colName, '[2]', '--'),
        dataIndex: 'market_value.merge',
        key: 'market_value.merge',
        className: 'm-black',
        onHeaderCell: () => ({ style: { minWidth: 148, maxWidth: 259 } }),
        onCell: () => ({ style: { minWidth: 148, maxWidth: 259 } }),
        sorter: true,
        render: text => this.renderColumns(text),
      },
      {
        title: lodash.get(colName, '[3]', '--'),
        dataIndex: 'holding_product_number',
        key: 'holding_product_number',
        className: 'm-black',
        onHeaderCell: () => ({ style: { minWidth: 148, maxWidth: 260 } }),
        onCell: () => ({ style: { minWidth: 148, maxWidth: 260 } }),
        sorter: true,
        render: (text, record) => <div className='m-darkgray'>{lodash.get(record, 'holding_product_number', '--')}</div>,
      },
      {
        title: lodash.get(colName, '[5]', '--'),
        dataIndex: 'averageMarketValue',
        key: 'average_market_value',
        className: 'm-black',
        onHeaderCell: () => ({ style: { minWidth: 148 } }),
        onCell: () => ({ style: { minWidth: 148 } }),
        sorter: true,
        render: text => this.renderColumns(text),
      },
      {
        title: '期末保有(万)',
        dataIndex: 'final_market_value',
        key: 'final_market_value',
        className: 'm-black',
        sorter: true,
        render: text => this.renderColumns(text),
      },
      {
        title: '客户明细',
        fixed: 'right',
        width: 97,
        className: 'm-black',
        render: (_, record) => (
          <div className='fs14' style={{ color: '#244fff', cursor: 'pointer' }} onClick={() => this.props.handleCheck(record)}>查看</div>
        ),
      },
    ];
  }

  // 筛选框显隐
  filterVisbleChange = (visible, name) => {
    if (visible) {
      const payload = {
        customerType: this.props.searchForm.props.form.getFieldsValue().khlx.join(),
        queryType: parseInt(this.props.searchForm.props.form.getFieldsValue().khfw),
        customerNameVisible: name === 'customer_name' ? true : false,
        timePeriod: this.props.searchForm.props.form.getFieldsValue().tjsj,
      };
      this.setState({ payload: { ...payload } });
    } else {
      const payload = {
        customerType: this.props.searchForm.props.form.getFieldsValue().khlx.join(),
        queryType: parseInt(this.props.searchForm.props.form.getFieldsValue().khfw),
      };
      if (name === 'customer_name') {
        payload['customerNameVisible'] = false;
      }
      this.setState({ payload: { ...payload } });
    }
  }

  // 筛选框里选中项变化
  filterOnChange = (checked, checkedStr, name) => {
    const { wealthCusList = {}, searchForm = {} } = this.props;
    if (searchForm) {
      if (!searchForm.props.form.getFieldsValue().khlx.join()) {
        message.warning('请选择关系类型 !');
        return;
      }
    }
    wealthCusList.setState({ loading: true });
    const timePeriod = searchForm.props.form.getFieldsValue().tjsj;
    const { state: { filter: attrConditionModels = [] } } = wealthCusList;
    if (attrConditionModels.findIndex(item => item.esCode === `${name}`) !== -1) {
      const index = attrConditionModels.findIndex(item => item.esCode === `${name}`);
      if (checked || checkedStr) {
        attrConditionModels[index].esValue = checkedStr;
        attrConditionModels[index].type = checked ? 3 : 0;
      } else {
        attrConditionModels.splice(index, 1);
      }
    } else {
      if (checkedStr || checked) {
        attrConditionModels.push({ esCode: `${name}`, esValue: checkedStr, type: checked ? 3 : 0 });
      }
    }
    const payload = {
      timePeriod,
      customerType: searchForm.props.form.getFieldsValue().khlx.join(),
      queryType: parseInt(searchForm.props.form.getFieldsValue().khfw),
      pagerModel: { pageNo: 1, pageSize: wealthCusList.state.pageSize },
      sort: wealthCusList.state.sort,
      fieldsCode: [
        'customer_name',
        'customer_no',
        'customer_id',
        'market_value',
        'holding_product_number',
        'transaction_amount',
        'average_market_value',
      ],
      financialCusListAggModelList: [{
        code: 'market_value_merge',
        type: '1',
      }],
      financialCusListAggSunModelList: [
        {
          code: `sale_relation.transaction_amount.${timePeriod}`,
          type: '1',
        },
        {
          code: `sale_relation.average_market_value.${timePeriod}`,
          type: '1',
        },
      ],
      attrConditionModels,
    };
    this.props.handleFilter(payload.attrConditionModels);
    FetchQueryFinancailCusList(payload).then((res) => {
      const { count = 0, data = [], agg = {}, aggSun = {} } = res;
      const { 'market_value_merge': market_value = '--' } = agg;
      const average_market_value = lodash.get(aggSun, `sale_relation.average_market_value.${timePeriod}`, '--');
      const transaction_amount = lodash.get(aggSun, `sale_relation.transaction_amount.${timePeriod}`, '--');
      const statistics = { market_value, average_market_value, transaction_amount };
      let result = [];
      data.forEach((item, index) => {
        const temp = JSON.parse(JSON.stringify(item));
        temp['no'] = (index + 1) + '';
        result.push(temp);
      });
      wealthCusList.setState({
        statistics,
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
      getInstence(this.filterCustomerThis);
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
