import React, { Component } from 'react';
import { Col, Icon, Row, Table, Tooltip } from 'antd';
import styles from '../index.less';
import Filter from '../../SalesRevenue/Common/Filter';
import { FetchQueryIncomeAndRewardList } from '$services/newProduct';

class TableDetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  // 重写部分表格头
  reWriteTitle = (title) => {
    const { sortOrder } = this.state;
    let tip = '排序';
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', marginLeft: 20 }}>{title}</span>
          <Tooltip title={tip}>
            <span style={{ cursor: 'pointer' }} className='ant-table-column-sorter'>
              <div className='ant-table-column-sorter-inner ant-table-column-sorter-inner-full'>
                <Icon type="caret-up" className={`ant-table-column-sorter-up ${sortOrder === 'ascend' ? 'on' : 'off'}`} />
                <Icon type="caret-down" className={`ant-table-column-sorter-down ${sortOrder === 'descend' ? 'on' : 'off'}`} />
              </div>
            </span>
          </Tooltip>
        </div>
        <span style={{ marginRight: 34 }}>占比</span>
      </div>
    );
  }

  // 点击重写的表格头
  handleClickHeader = () => {
    const { sortOrder } = this.state;
    const { data, totalData } = this.props;
    return {
      onClick: () => {
        let sort = '';
        let ret = [...data.records];
        if (sortOrder === '') {
          sort = 'ascend';
          ret = ret.sort((a, b) => parseFloat(a.zhl) > parseFloat(b.zhl) ? 1 : -1);
          this.getDataSource(ret, totalData);
        } else if (sortOrder === 'ascend') {
          sort = 'descend';
          ret = ret.sort((a, b) => parseFloat(a.zhl) > parseFloat(b.zhl) ? -1 : 1);
          this.getDataSource(ret, totalData);
        } else {
          this.getDataSource(data.records, totalData);
        }
        this.setState({
          sortOrder: sort,
        });
      },
    };
  }

  // 表头筛选回调
  handleChange = (value, type) => {
    const { setData, fetchData } = this.props;
    if (setData && typeof setData === 'function') {
      if (type === 'product_major_type_name') {
        setData({ productMajorType: value, productSubType: '', transactionBehavior: '' });
        fetchData({ productMajorType: value, productSubType: '', transactionBehavior: '' });
      } else if (type === 'product_sub_type_name') {
        setData({ productSubType: value, transactionBehavior: '' });
        fetchData({ productSubType: value, transactionBehavior: '' });
      } else {
        setData({ transactionBehavior: value });
        fetchData({ transactionBehavior: value });
      }
    }
  }

  // 表格列
  getColumns = () => {
    const { incomeAndRewardListModel: { productMajorType = '', productSubType = '', transactionBehavior = '' } } = this.props;
    const jyxw = '部分销售创收由查询时间期间内产品保有量计算生成，例如销售服务费、销售管理费等';
    return [
      {
        title: '序号',
        dataIndex: 'no',
        width: 68,
        key: 'no',
        className: 'm-black',
        align: 'left',
        fix: 'left',
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '营业部',
        dataIndex: 'customer_department',
        width: 200,
        key: 'customer_department',
        className: 'm-black',
        align: 'left',
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品大类',
        dataIndex: 'product_major_type_name',
        width: 133,
        key: 'product_major_type_name',
        className: 'm-black',
        align: 'left',
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='product_major_type_name' saleAndIncomeListModel={this.props.incomeAndRewardListModel} api={FetchQueryIncomeAndRewardList} onChange={(value) => { this.handleChange(value, 'product_major_type_name'); }} />,
        filtered: productMajorType, 
        // render: text => <div className='m-darkgray'>{text || '--'}</div>,
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品子类',
        dataIndex: 'product_sub_type_name',
        width: 133,
        key: 'product_sub_type_name',
        className: 'm-black',
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='product_sub_type_name' saleAndIncomeListModel={this.props.incomeAndRewardListModel} api={FetchQueryIncomeAndRewardList} onChange={(value) => { this.handleChange(value, 'product_sub_type_name'); }} />,
        filtered: productSubType,
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <span>交易行为
          <Tooltip title={jyxw}>
            <Icon style={{ marginLeft: 5, color: '#959cba' }} type="question-circle" />
          </Tooltip>
        </span>,
        dataIndex: 'transaction_behavior',
        width: 133,
        key: 'transaction_behavior',
        className: 'm-black',
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='transaction_behavior' saleAndIncomeListModel={this.props.incomeAndRewardListModel} api={FetchQueryIncomeAndRewardList} onChange={(value) => { this.handleChange(value, 'transaction_behavior'); }} />,
        filtered: transactionBehavior,
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '交易日期',
        dataIndex: 'transaction_date',
        width: 116,
        key: 'transaction_date',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品代码',
        dataIndex: 'product_code',
        width: 116,
        key: 'product_code',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        width: 189,
        key: 'product_name',
        align: 'left',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售额(万)',
        dataIndex: 'sales_volume',
        width: 128,
        key: 'sales_volume',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '客户名称',
        dataIndex: 'customer_name',
        width: 152,
        key: 'customer_name',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '客户号',
        dataIndex: 'customer_no',
        width: 135,
        key: 'customer_no',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '客户级别',
        dataIndex: 'customer_level_name',
        key: 'customer_level_name',
        width: 105,
        className: 'm-black',
        align: 'left',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售关系',
        dataIndex: 'sales_staff_name',
        width: 139,
        key: 'sales_staff_name',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '开发关系',
        dataIndex: 'development_staff_name',
        width: 139,
        key: 'development_staff_name',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '服务关系',
        dataIndex: 'service_staff_name',
        width: 139,
        key: 'service_staff_name',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核销量(万)</span>,
        dataIndex: 'evaluate_sales_volume',
        width: 128,
        key: 'evaluate_sales_volume',
        className: 'm-black',
        align: 'left',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <div style={{ position: 'relative', top: '0.483rem' }}>
          <span style={{ fontWeight: 'bold' }}>销售创收(元)<Tooltip title='仅包含考核比例 > 0 的科目'><Icon type="question-circle" style={{ cursor: 'pointer', color: '#959CBA' }} /></Tooltip></span>
          <div style={{ color: '#f3a100', lineHeight: '1', fontSize: 12 }}>
            总和
          </div>
        </div>,
        dataIndex: 'sales_revenue',
        width: 164,
        key: 'sales_revenue',
        className: 'm-black',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '手续费收入(元)',
        dataIndex: 'fee_income',
        width: 134,
        key: 'fee_income',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '佣金收入(元)',
        dataIndex: 'commission_income',
        width: 134,
        key: 'commission_income',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售服务费收入(元)',
        dataIndex: 'sales_service_income',
        width: 162,
        key: 'sales_service_income',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '其他收入(元)',
        dataIndex: 'others_income',
        width: 134,
        key: 'others_income',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <div style={{ position: 'relative', top: '0.483rem' }}>
          <span style={{ fontWeight: 'bold' }}>销售奖励(元)</span>
          <div style={{ color: '#2395ff', lineHeight: '1', fontSize: 12 }}>
            总和
          </div>
        </div>,
        dataIndex: 'sales_reward',
        width: 134,
        key: 'sales_reward',
        sorter: true,
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '手续费奖励(元)',
        dataIndex: 'fee_reward',
        width: 134,
        key: 'fee_reward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '佣金奖励(元)',
        dataIndex: 'commission_reward',
        width: 134,
        key: 'commission_reward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售服务费奖励(元)',
        dataIndex: 'sales_service_reward',
        width: 162,
        key: 'sales_service_reward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '其他奖励(元)',
        dataIndex: 'others_reward',
        width: 134,
        key: 'others_reward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '更新日期',
        dataIndex: 'date',
        width: 116,
        key: 'date',
        className: 'm-black',
        align: 'left',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        width: 162,
        key: 'remarks',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
    ];
  }

  // 分页、筛选、排序发生变化
  onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { handleTableChange } = this.props;
    const { columnKey, order = 'desc' } = sorter;
    const key = columnKey;
    const val = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    const sort = [{}];
    if (key && val) {
      sort[0][key] = val;
    }
    if (handleTableChange) {
      handleTableChange(current, pageSize, sort);
    }
    this.setState({ current, pageSize, sort });
  }

  render () {
    const { current = 1, pageSize = 20 } = this.state;
    const { dataSource = [], count = 0, loading } = this.props;
    const maxCount = count > 10000 ? 10000 : count;
    const tableProps = {
      className: `${styles.detailTipLine} m-table-customer`,
      loading,
      scroll: { x: 3930, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
      dataSource,
      columns: this.getColumns(),
      bordered: true,
      onChange: this.onTableChange,
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${count}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        total: maxCount,
        current,
        pageSize,
      },
    };
    return (
      <Row style={{ padding: '0' }}>
        <Col>
          <Table {...tableProps} columns={this.getColumns()}></Table>
        </Col>
      </Row>
    );
  }
}
export default TableDetailContent;
