import React, { Component } from 'react';
import { Col, Row, Table } from 'antd';

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



  // 表格列
  getColumns = () => {
    const colName = [
      { title: '序号',
        dataIndex: 'no',
        key: 'no',
        width: 68,
        fixed: 'left',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div> },
      {
        title: '客户号',
        dataIndex: 'CUSTOMER',
        key: 'CUSTOMER',
        className: 'm-black',
        // width: 133,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '资金账号',
        dataIndex: 'ACCOUNT',
        key: 'ACCOUNT',
        className: 'm-black',
        // width: 133,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      { title: '营业部',
        dataIndex: 'DEPT_CODE',
        key: 'DEPT_CODE',
        className: 'm-black',
        // width: 116,
        render: (text,recods) => <div className='m-darkgray'>{recods.ORG_FULL_NAME || '--'}</div>,
      },
      { title: '交易行为',
        dataIndex: 'TRD_ID',
        key: 'TRD_ID',
        className: 'm-black',
        // width: 116,
        render: (text,recods) => <div className='m-darkgray'>{recods.TRD_NAME || '--'}</div>,
      },
      { title: '预委托状态',
        dataIndex: 'PR_ORDER_STATUS',
        key: 'PR_ORDER_STATUS',
        className: 'm-black',
        // width: 116,
        render: text => <div className='m-darkgray'>{text || '--'}</div> ,
      },
      { title: '委托时间',
        dataIndex: 'CREATE_TIME',
        key: 'CREATE_TIME',
        className: 'm-black',
        width: 189,
        render: text => <div className='m-darkgray'>{text || '--'}</div> },
      {
        title: '产品代码',
        dataIndex: 'INST_CODE',
        key: 'INST_CODE',
        className: 'm-black',
        // width: 116,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '产品名称',
        dataIndex: 'INST_SNAME',
        key: 'INST_SNAME',
        className: 'm-black',
        // width: 128,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '委托金额',
        dataIndex: 'ORDER_AMT',
        key: 'ORDER_AMT',
        className: 'm-black',
        // width: 162,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      { title: '委托份额',
        dataIndex: 'ORDER_VOL',
        key: 'ORDER_VOL',
        className: 'm-black',
        // width: 116,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '委托结果描述',
        dataIndex: 'RESULT_TEXT',
        key: 'RESULT_TEXT',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
    ];
    return colName;
  }


  render () {
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
