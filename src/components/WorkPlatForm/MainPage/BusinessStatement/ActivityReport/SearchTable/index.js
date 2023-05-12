import React, { Component } from 'react';
import { Col, Row, Table } from 'antd';

class SearchTable extends Component {

  componentDidMount() {
    const { parentThis } = this.props;
    let headerName = ['单点营业部', '活动开通客户数-首次开通', '活动开通客户数-达到费用支持1', '活动开通客户数-达到费用支持2', '活动开通客户数-开通但尚未满足活动条件', '活动开通客户交易量-首次开通', '活动开通客户交易量-达到费用支持1', '活动开通客户交易量-达到费用支持2', '活动开通客户交易量-开通但尚未满足活动条件', '活动开通客户净佣金贡献-首次开通', '活动开通客户净佣金贡献-达到费用支持1', '活动开通客户净佣金贡献-达到费用支持2','可获取费用'];
    let tableHeaderCodes = ['YYB','SCKTKHSL','DDFYZZ1KHSL','DDFYZZ2KHSL','WMZHDTJKHSL','SCKTJYL','DDFYZZ1JYL','DDFYZZ2JYL','WMZHDTJJYL','SCKTJYJ','DDFYZZ1JYJ','DDFYZZ2JYJ','KHFY'];
    if (parentThis) {
      parentThis.setState({
        headerName,
        tableHeaderCodes,
      });
    }

  }
  showData(d){
    const { parentThis } = this.props;
    if(parentThis){
      parentThis.setState({ visible: true ,protocol: d });
    }
  }
  // 表格列
  getColumns = () => {
    const { departTabel } = this.props;
    return [
      {
        title: '序号',
        fixed: 'left',
        dataIndex: 'no',
        textAlign: 'center',
        key: 'no',
        className: 'm-black',
        width: 65,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: departTabel,
        fixed: 'left',
        dataIndex: 'YYB',
        key: 'YYB',
        className: 'm-black',
        width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '活动开通客户数',
        children: [
          {
            title: '首次开通',
            dataIndex: 'SCKTKHSL',
            key: 'SCKTKHSL',
            className: 'm-black',
            width: 115,
            render: text => <div  className='m-darkgray-g' style={{ color: '#244fff', cursor: 'pointer' }}>{text || '--'}</div>,
          },
          {
            title: '达到费用支持1',
            dataIndex: 'DDFYZZ1KHSL',
            key: 'DDFYZZ1KHSL',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g' style={{ color: '#244fff', cursor: 'pointer' }}>{text || '--'}</div>,
          },
          {
            title: '达到费用支持2',
            dataIndex: 'DDFYZZ2KHSL',
            key: 'DDFYZZ2KHSL',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g' style={{ color: '#244fff', cursor: 'pointer' }}>{text || '--'}</div>,
          },
          {
            title: '开通但尚未满足活动条件',
            dataIndex: 'WMZHDTJKHSL',
            key: 'WMZHDTJKHSL',
            className: 'm-black',
            width: 185,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
        ],
      },
      {
        title: '活动开通客户交易量',
        children: [
          {
            title: '首次开通',
            dataIndex: 'SCKTJYL',
            key: 'SCKTJYL',
            className: 'm-black',
            width: 117,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
          {
            title: '达到费用支持1',
            dataIndex: 'DDFYZZ1JYL',
            key: 'DDFYZZ1JYL',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
          {
            title: '达到费用支持2',
            dataIndex: 'DDFYZZ2JYL',
            key: 'DDFYZZ2JYL',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
          {
            title: '开通但尚未满足活动条件',
            dataIndex: 'WMZHDTJJYL',
            key: 'WMZHDTJJYL',
            className: 'm-black',
            width: 185,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
        ],
      },
      {
        title: '活动开通客户净佣金贡献',
        children: [
          {
            title: '首次开通',
            dataIndex: 'SCKTJYJ',
            key: 'SCKTJYJ',
            className: 'm-black',
            width: 117,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
          {
            title: '达到费用支持1',
            dataIndex: 'DDFYZZ1JYJ',
            key: 'DDFYZZ1JYJ',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
          {
            title: '达到费用支持2',
            dataIndex: 'DDFYZZ2JYJ',
            key: 'DDFYZZ2JYJ',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
          },
        ],
      },
      {
        title: '可获费用',
        dataIndex: 'KHFY',
        key: 'KHFY',
        className: 'm-black',
        // width: 110,
        render: text => <div className='m-darkgray-g'>{text || '--'}</div>,
      },
      {
        title: '明细',
        dataIndex: 'DATEIL',
        fixed: 'right',
        key: 'DATEIL',
        className: 'm-black',
        width: 60,
        render: (_, record) => <div className='fs14' style={{ color: '#244fff', cursor: 'pointer' }}  onClick={()=>this.showData(record)} >查看</div>,
      },
    ];
  }

  render() {
    const { tableProps } = this.props;
    return (
      <Row style={{ padding: '0' }}>
        <Col>
          <Table  {...tableProps} columns={this.getColumns()}></Table>
        </Col>
      </Row>
    );
  }
}

export default SearchTable;
