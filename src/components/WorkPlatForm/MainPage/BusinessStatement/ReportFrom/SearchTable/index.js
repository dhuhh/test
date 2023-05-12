import React, { Component } from 'react';
import { Col, Row, Table } from 'antd';

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  componentDidMount() {
    const { parentThis } = this.props;
    let headerName = ['单点营业部','业绩总览-开通客户数','业绩总览-交易客户数','业绩总览-日均总资产','业绩总览-港股通月日均保有量（万）','业绩总览-港股通交易量（万）','业绩总览-港股通净佣金贡献',
      '新开通客户业绩情况-开通客户数','新开通客户业绩情况-交易客户数','新开通客户业绩情况-日均总资产','新开通客户业绩情况-港股通月日均保有量（万）','新开通客户业绩情况-港股通交易量（万）','新开通客户业绩情况-港股通净佣金贡献',       
    ];
    let tableHeaderCodes = ['YYB','YJZLKTKHS','YJZLJYKHS','YJZLRJZZC','YJZLYRJBYL','YJZLJYL','YJZLJYJ','XKTKHS','XKTJYKHS','XKTRJZZC','XKTYRJBYL','XKTJYL','XKTJYJ'];
    if (parentThis) {
      parentThis.setState({
        headerName,
        tableHeaderCodes,
      });
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
        key: 'no',
        className: 'm-black',
        width: 65,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: departTabel,
        fixed: 'left',
        dataIndex: 'YYB',
        key: 'YYB2',
        className: 'm-black',
        width: 230,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '业绩总览',
        children: [
          {
            title: '开通客户数',
            dataIndex: 'YJZLKTKHS',
            key: 'YJZLKTKHS',
            className: 'm-black',
            width: 110,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '交易客户数',
            dataIndex: 'YJZLJYKHS',
            key: 'YJZLJYKHS',
            className: 'm-black',
            // width: 130,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '日均总资产',
            dataIndex: 'YJZLRJZZC',
            key: 'YJZLRJZZC',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '港股通月日均保有量',
            dataIndex: 'YJZLYRJBYL',
            key: 'YJZLYRJBYL',
            className: 'm-black',
            width: 200,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '港股通交易量',
            dataIndex: 'YJZLJYL',
            key: 'YJZLJYL',
            className: 'm-black',
            width: 160,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '港股通净佣金贡献',
            dataIndex: 'YJZLJYJ',
            key: 'YJZLJYJ',
            className: 'm-black',
            width: 150,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
        ],
      },
      {
        title: '新开通客户业绩情况',
        children: [
          {
            title: '开通客户数',
            dataIndex: 'XKTKHS',
            key: 'XKTKHS',
            className: 'm-black',
            width: 110,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '交易客户数',
            dataIndex: 'XKTJYKHS',
            key: 'XKTJYKHS',
            className: 'm-black',
            // width: 130,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '日均总资产',
            dataIndex: 'XKTRJZZC',
            key: 'XKTRJZZC',
            className: 'm-black',
            width: 130,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '港股通月日均保有量',
            dataIndex: 'XKTYRJBYL',
            key: 'XKTYRJBYL',
            className: 'm-black',
            width: 200,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '港股通交易量',
            dataIndex: 'XKTJYL',
            key: 'XKTJYL',
            className: 'm-black',
            width: 160,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '港股通净佣金贡献',
            dataIndex: 'XKTJYJ',
            key: 'XKTJYJ',
            className: 'm-black',
            width: 150,
            render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
          },
        ],
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
