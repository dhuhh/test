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
    let headerName = ['单点营业部','开通潜力客户转化情况-潜力客户数','开通潜力客户转化情况-转化客户数','开通潜力客户转化情况-交易量','开通潜力客户转化情况-交易净佣金','促交易客户转化情况-潜力客户数','促交易客户转化情况-转化客户数','促交易客户转化情况-交易量','促交易客户转化情况-交易净佣金'];
    let tableHeaderCodes = ['YYB','KTQLKHS','KTZHKHS','KTJYL','KTJYJ','CJYQLKHS','CJYZHKHS','CJYJYL','CJYJYJ'];
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
        width: 65,
        render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '单点营业部',
        dataIndex: 'YYB',
        className: 'm-black',
        key: 'YYB',
        fixed: 'left',
        width: 230,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },

      {
        title: '开通潜力客户转化情况',
        children: [    
          {
            title: '潜力客户数',
            dataIndex: 'KTQLKHS',
            key: 'KTQLKHS',
            className: 'm-black',
            // width: 220,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '转化客户数',
            dataIndex: 'KTZHKHS',
            key: 'KTZHKHS',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '交易量',
            dataIndex: 'KTJYL',
            key: 'KTJYL',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '交易净佣金',
            dataIndex: 'KTJYJ',
            key: 'KTJYJ',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
        ],
      },
      {
        title: '促交易客户转化情况',
        children: [    
          {
            title: '潜力客户数',
            dataIndex: 'CJYQLKHS',
            key: 'CJYQLKHS',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '转化客户数',
            dataIndex: 'CJYZHKHS',
            key: 'CJYZHKHS',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '交易量',
            dataIndex: 'CJYJYL',
            key: 'CJYJYL',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
          },
          {
            title: '交易净佣金',
            dataIndex: 'CJYJYJ',
            key: 'CJYJYJ',
            className: 'm-black',
            // width: 117,
            render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
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
