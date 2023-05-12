import React, { Component } from 'react';
import { Col, Row, Table } from 'antd';
import styles from '../index.less';
import Filter from '../../SalesRevenue/Common/Filter';
import { FetchQueryIncomeAndRewardList } from '$services/newProduct';
class TableContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  // 表头筛选回调
  handleChange = (value, type) => {
    const { setData, fetchData } = this.props;
    if (setData && typeof setData === 'function') {
      if (type === 'product_major_type_name') {
        setData({ productMajorType: value, productSubType: '' });
        fetchData({ productMajorType: value, productSubType: '' });
      } else {
        setData({ productSubType: value });
        fetchData({ productSubType: value });
      }
    }
  }

  // 表格列
  getColumns = () => {
    const { incomeAndRewardListModel: { productMajorType = '', productSubType = '' } } = this.props;
    return [
      {
        title: '序号',
        dataIndex: 'no',
        width: 68,
        key: 'no',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
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
        title: '产品代码',
        dataIndex: 'product_code',
        width: 116,
        key: 'product_code',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        width: 189,
        key: 'product_name',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售额(万)',
        dataIndex: 'salesVolume',
        width: 128,
        key: 'salesVolume',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核销量(万)</span>,
        dataIndex: 'evaluateSalesVolume',
        width: 128,
        key: 'evaluateSalesVolume',
        className: 'm-black',
        align: 'left',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '日均考核保有(万)',
        dataIndex: 'evaluateHoldings',
        width: 146,
        key: 'evaluateHoldings',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <div>
          <span style={{ fontWeight: 'bold' }}>销售创收(元)</span>
          <div style={{ color: '#f3a100', lineHeight: '1', fontSize: 12 }}>
            总和
          </div>
        </div>,
        dataIndex: 'salesRevenue',
        width: 134,
        key: 'salesRevenue',
        className: 'm-black',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '手续费收入(元)',
        dataIndex: 'feeIncome',
        width: 134,
        key: 'feeIncome',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '佣金收入(元)',
        dataIndex: 'commissionIncome',
        width: 134,
        key: 'commissionIncome',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售服务费收入(元)',
        dataIndex: 'salesServiceIncome',
        width: 162,
        key: 'salesServiceIncome',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '其他收入(元)',
        dataIndex: 'othersIncome',
        width: 134,
        key: 'othersIncome',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <div>
          <span style={{ fontWeight: 'bold' }}>销售奖励(元)</span>
          <div style={{ color: '#2395ff', lineHeight: '1', fontSize: 12 }}>
            总和
          </div>
        </div>,
        dataIndex: 'salesReward',
        width: 134,
        key: 'salesReward',
        sorter: true,
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '手续费奖励(元)',
        dataIndex: 'feeReward',
        width: 134,
        key: 'feeReward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '佣金奖励(元)',
        dataIndex: 'commissionReward',
        width: 134,
        key: 'commissionReward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '销售服务费奖励(元)',
        dataIndex: 'salesServiceReward',
        width: 162,
        key: 'salesServiceReward',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '其他奖励(元)',
        dataIndex: 'othersReward',
        width: 134,
        key: 'othersReward',
        className: 'm-black',
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
      className: `${styles.hasTipLine} m-table-customer`,
      loading,
      scroll: { x: 2438, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
      dataSource,
      bordered: true,
      onChange: this.onTableChange,
      sortDirections: ['descend', 'ascend'],
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
          {/* <Pagination {...paginationProps} /> */}
        </Col>
      </Row>
    );
  }
}
export default TableContent;
