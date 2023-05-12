import React, { Component } from 'react';
import { Col, Row, Table } from 'antd';
import styles from '../index.less';
import Filter from '../Filter';
import { FetchQueryProductType } from '$services/newProduct';

class TableTenureContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  // 表头筛选回调
  handleChange = (value, type) => {
    const { setData, fetchData , selectKey } = this.props;
    if (setData && typeof setData === 'function') {
      if (type === 'product_cpdl') {
        setData({ cpdl: value });
        fetchData({ cpdl: value , key: selectKey });
      } else {
        setData({ cpxl: value });
        fetchData({ cpxl: value , key: selectKey });
      }
    }
  }

  // 表格列
  getColumns = () => {

    const { cpdlDate = [] , cpxlDate = [] } = this.props;

    return [
      {
        title: '序号',
        dataIndex: 'no',
        width: 78,
        key: 'no',
        className: 'm-black',
        align: 'left',
        fix: 'left',
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '营业部',
        dataIndex: 'yyb',
        width: 160,
        key: 'yyb',
        className: 'm-black',
        align: 'left',
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品大类',
        dataIndex: 'cpdl',
        width: 133,
        key: 'cpdl',
        className: 'm-black',
        align: 'left',
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='product_cpdl' dateList={cpdlDate} payload={this.props.payload} api={FetchQueryProductType} onChange={(value) => { this.handleChange(value, 'product_cpdl'); }} />,
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品子类',
        dataIndex: 'cpzl',
        width: 133,
        key: 'cpzl',
        className: 'm-black',
        filterDropdown: ({ confirm }) => <Filter confirm={confirm} type='product_cpxl' dateList={cpxlDate} payload={this.props.payload} api={FetchQueryProductType} onChange={(value) => { this.handleChange(value, 'product_cpxl'); }} />,
        render: (text) => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品代码',
        dataIndex: 'cpdm',
        width: 116,
        key: 'cpdm',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },      
      {
        title: '产品名称',
        dataIndex: 'cpmc',
        width: 189,
        key: 'cpmc',
        align: 'left',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '客户名称',
        dataIndex: 'khmc',
        width: 152,
        key: 'khmc',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '客户号',
        dataIndex: 'khh',
        width: 135,
        key: 'khh',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '客户级别',
        dataIndex: 'khjb',
        key: 'khjb',
        width: 105,
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{ text ? `V${text}` : '--'}</div>,
      },
      {
        title: '销售关系',
        dataIndex: 'xsgx',
        width: 139,
        key: 'xsgx',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '开发关系',
        dataIndex: 'kfgx',
        width: 139,
        key: 'kfgx',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '服务关系',
        dataIndex: 'fwgx',
        width: 139,
        key: 'fwgx',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '统计日期',
        dataIndex: 'tjrq',
        width: 134,
        key: 'tjrq',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <span >日均保有(万)</span>,
        dataIndex: 'rjby',
        width: 140,
        key: 'rjby',
        className: 'm-black',
        // align: 'left',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: <span >日均考核保有(万)</span>,
        dataIndex: 'rjkhby',
        width: 140,
        key: 'rjkhby',
        className: 'm-black',
        // align: 'left',
        sorter: true,
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
      className: `m-table-customer`,
      loading,
      scroll: { x: 2030, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
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
export default TableTenureContent;
