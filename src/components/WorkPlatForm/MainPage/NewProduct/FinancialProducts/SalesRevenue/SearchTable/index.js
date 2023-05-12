import React, { Component } from 'react';
import { Col, Row, Table, message, Popover, Icon, Tooltip } from 'antd';
import lodash from 'lodash';
import Filter from '../Common/Filter';
import { FetchSaleAndIncomeList } from '$services/newProduct';
import styles from '../index.less';

class SearchTable extends Component {
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
    const { saleAndIncomeListModel: { productMajorType = '', productSubType = '' } } = this.props;
    const colName = [
      { title: '序号', dataIndex: 'no', key: 'no', width: 68, fixed: 'left', className: 'm-black', render: text => <div className='m-darkgray'>{text || '--'}</div> },
      {
        title: '产品大类',
        dataIndex: 'product_major_type_name',
        key: 'product_major_type_name',
        className: 'm-black',
        width: 133,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='product_major_type_name' saleAndIncomeListModel={this.props.saleAndIncomeListModel} api={FetchSaleAndIncomeList} onChange={(value) => { this.handleChange(value, 'product_major_type_name'); }} />,
        filtered: productMajorType,
      },
      { title: '产品子类',
        dataIndex: 'product_sub_type_name',
        key: 'product_sub_type_name',
        className: 'm-black',
        width: 133,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='product_sub_type_name' saleAndIncomeListModel={this.props.saleAndIncomeListModel} api={FetchSaleAndIncomeList} onChange={(value) => { this.handleChange(value, 'product_sub_type_name'); }} />,
        filtered: productSubType,
      },
      { title: '交易行为', dataIndex: 'transaction_behavior', key: 'transaction_behavior', className: 'm-black', width: 116, render: text => <div className='m-darkgray'>{text || '--'}</div> },
      { title: '交易日期', dataIndex: 'transaction_date', key: 'transaction_date', className: 'm-black', width: 116, render: text => <div className='m-darkgray'>{text || '--'}</div> },
      { title: '产品代码', dataIndex: 'product_code', key: 'product_code', className: 'm-black', width: 116, render: text => <div className='m-darkgray'>{text || '--'}</div> },
      { title: '产品名称', dataIndex: 'product_name', key: 'product_name', className: 'm-black', width: 189, render: text => <div className='m-darkgray'>{text || '--'}</div> },
      {
        title: <div style={{ fontWeight: 600 }}>销售额(万)</div>,
        dataIndex: 'sales_volume',
        key: 'sales_volume',
        className: 'm-black',
        width: 116,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: (
          <div>
            <span style={{ fontWeight: 600, paddingRight: 5  }}>考核销量(万)</span>
            <Tooltip title='考核销量=确认金额*考核系数'><Icon type="question-circle" style={{ cursor: 'pointer', color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        dataIndex: 'evaluate_sales_volume',
        key: 'evaluate_sales_volume',
        className: 'm-black',
        width: 128,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: (
          <div>
            <span style={{ fontWeight: 600, paddingRight: 5  }}>销售创收(元)</span>
            <Tooltip title='销售收入包含认申购手续费收入、佣金收入等。其中认申购手续费每日系统更新，部分产品类型的销售服务费收入和其他收入会延迟到次月更新。'><Icon type="question-circle" style={{ cursor: 'pointer', color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        dataIndex: 'sales_revenue',
        key: 'sales_revenue',
        className: 'm-black',
        width: 162,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      { title: '客户姓名', dataIndex: 'customer_name', key: 'customer_name', className: 'm-black', width: 116, render: text => <div className='m-darkgray'>{text || '--'}</div> },
      { title: '客户号', dataIndex: 'customer_no', key: 'customer_no', className: 'm-black', width: 116, render: text => <div className='m-darkgray'>{text || '--'}</div> },
      {
        title: (
          <div>
            <span style={{ fontWeight: 600, paddingRight: 5 }}>客户所在营业部</span>
            <Tooltip title='跨分支机构的理财产品销售需要在OA发起签报流程，总部核算的收入和奖励才会进行对应调整。'><Icon type="question-circle" style={{ cursor: 'pointer', color: '#959CBA'  }} /></Tooltip>
          </div>
        ),
        dataIndex: 'customer_department',
        key: 'customer_department',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
    ];
    return colName;
  }

  // 筛选框显隐
  filterVisbleChange = (visible, name) => {
  }

  // 筛选框里选中项变化
  filterOnChange = (checked, checkedStr, name) => {
  }

  render() {
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
