import React, { Component } from 'react';
import { Col, Row, Table } from 'antd';
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
    const { parentThis } = this.props;
    let headerName = ['客户','客户号','开通港股通日期','期间港股通月日保有量','期间港股通交易量','期间港股通净佣金贡献','客户所属机构','当年港股通交易量','当年港股通净佣金贡献'];
    let tableHeaderCodes = ['cusName','cusCode','KTGGTRQ','QJGGTYRBYL','QJGGTJYL','QJGGTJYJ','YYB','DNGGTJYL','DNGGTJYJ'];
    if (parentThis) {
      parentThis.setState({
        headerName,
        tableHeaderCodes,
      });
    }

  }
  // 表格列
  getColumns = () => {
    //  
    return [
      {
        title: '序号',
        dataIndex: 'no',
        className: 'm-black',
        key: 'no',
        fixed: 'left',
        width: 80,
        render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '客户',
        dataIndex: 'cusName',
        className: `columnLine m-black`,
        key: 'cusName',
        fixed: 'left',
        // width: 100,
        render: text => <div className='m-darkgray-g'  >{text || '--'}</div>,
      },
      {
        title: '客户号',
        dataIndex: 'cusCode',
        className: `columnLine m-black`,
        key: 'cusCode',
        // width: 180,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '开通港股通日期',
        className: `columnLine m-black`,
        dataIndex: 'KTGGTRQ',
        key: 'KTGGTRQ',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '期间港股通月日保有量',
        className: 'columnLine m-black',
        dataIndex: 'QJGGTYRBYL',
        key: 'QJGGTYRBYL',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '期间港股通交易量',
        className: 'columnLine m-black',
        dataIndex: 'QJGGTJYL',
        key: 'QJGGTJYL',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '期间港股通净佣金贡献',
        className: 'columnLine m-black',
        dataIndex: 'QJGGTJYJ',
        key: 'QJGGTJYJ',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '客户所属机构',
        className: 'columnLine m-black',
        dataIndex: 'YYB',
        key: 'YYB',
        width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '当年港股通交易量',
        className: 'columnLine m-black',
        dataIndex: 'DNGGTJYL',
        key: 'DNGGTJYL',
        // width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '当年港股通净佣金贡献',
        className: 'columnLine m-black',
        dataIndex: 'DNGGTJYJ',
        key: 'DNGGTJYJ',
        // width: '30rem',
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
    ];
  }

  render() {

    const { tableProps } = this.props;
    return (
      <Row style={{ padding: '0' }}>
        <Col>
          <Table  {...tableProps} columns={this.getColumns()} ></Table>
        </Col>
      </Row>
    );
  }
}

export default SearchTable;
