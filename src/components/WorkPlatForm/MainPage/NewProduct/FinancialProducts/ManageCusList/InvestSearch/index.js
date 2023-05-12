import React, { Component } from 'react';
import { Divider, message } from 'antd';
import lodash from 'lodash';
import BasicModal from '../../../../../../Common/BasicModal';
import DataTable from './DataTable';
import SearchForm from './SearchForm';
import Statistics from './Statistics';
import SearchTable from './SearchTable';
import styles from '../index.less';

class InvestSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 分页
      current: 1,
      pageSize: 20,
      total: 0,
      sort: [{ 'automatic_investment_plan.customer_no': 'desc' }],
      filter: [],
      agg_market_value: '',
      agg_plan_amount: '',
      agg_succeed_deduction_amount: '',
      loading: true,  // 列表加载状态
      dataSource: [],  // 列表数据
      visible: false, // 查看明细弹窗
      product_id: '', // 产品id
      customer_id: '', // 客户id
      customerType: null, //客户类型
      headerName: [], // 导出头名称
      pageNo: null, // 当前页数
      queryType: null,
      protocol: null,
      searchTotal: 0, //模糊搜索显示总条数
    };
  }

  componentDidMount = () => {
    this.childrenSearchFormThis.handleSubmit();
  }

  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    if (this.childrenSearchFormThis) {
      if (!this.childrenSearchFormThis.props.form.getFieldsValue().khlx.join()) {
        message.warning('请选择关系类型 !');
        return;
      }
    }
    const { current, pageSize } = pagination;
    const { columnKey = 'customer_no', order = 'desc' } = sorter;
    const key = 'automatic_investment_plan.' + columnKey;
    const val = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    const sort = [{}];
    if (key && val) {
      sort[0][key] = val;
    }
    this.childrenSearchFormThis.fetchData({ current, pageSize, sort, isSubmit: 1 });
    this.setState({ current, pageSize, sort });
  }

  handleCheck = (protocol) => {
    this.setState({
      protocol,
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleHeaderName = (headerName) => {
    this.setState({
      headerName,
    });
  }

  render() {
    const { loading = true, current = 1, pageSize = 20, total = 0, dataSource = [], visible, protocol, customerType, headerName, queryType, pageNo, sort, agg_market_value = '',
      agg_plan_amount = '', agg_succeed_deduction_amount = '', filter = [], searchTotal = 0 } = this.state;
    const maxCount = total > 10000 ? 10000 : total;
    const { authorities = {}, teamPmsn = '0' } = this.props;
    const tableProps = {
      className: styles.m_table,
      scroll: { x: 1980, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
      loading,
      dataSource,
      bordered: true,
      onChange: this.handleTableChange,
      sortDirections: ['descend', 'ascend'],
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        total: maxCount,
        current,
        pageSize,
      },
    };
    const modalProps = {
      width: '90rem',
      isAllWindow: 1,
      title: '扣款明细',
      style: { top: '5rem', borderRadius: '2px' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
      // defaultFullScreen: true,
      className: styles.modal,
      // allowFullScreen: true,
    };
    const statistics = { agg_market_value, agg_plan_amount, agg_succeed_deduction_amount };
    return (
      <React.Fragment>
        <SearchForm searchTotal={searchTotal} filterCustomerThis={this.filterCustomerThis} filterProductThis={this.filterProductThis} teamPmsn={teamPmsn} authorities={authorities} parentThis={this} getInstence={(childrenSearchFormThis) => { this.childrenSearchFormThis = childrenSearchFormThis; }} scene={this.props.scene} />
        <Divider style={{ marginTop: 0 }} />
        <Statistics filter={filter} customerType={customerType} headerName={headerName} total={total} queryType={queryType} sort={sort} pageNo={pageNo} statistics={statistics} />
        <SearchTable getInstence={(_this, _filterProductThis) => { this.filterCustomerThis = _this; this.filterProductThis = _filterProductThis; }} tableProps={tableProps} handleCheck={this.handleCheck} handleHeaderName={this.handleHeaderName} investSearch={this} searchForm={lodash.get(this, 'childrenSearchFormThis', {})} />
        <BasicModal {...modalProps}>
          <DataTable protocol={protocol} />
        </BasicModal>
      </React.Fragment>
    );
  }
}
export default InvestSearch;
