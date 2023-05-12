import { Button, Col, message, Pagination, Row, Table } from 'antd';
import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { DepPerfermReportBegin } from '$services/incidentialServices';
import ExportButton from '../../Common/Exports';
import styles from './CustomerModal.less';

class CustomerModal extends Component {
  state = {
    height: document.body.offsetHeight < 680 ? document.body.offsetHeight - 180 : 500,
    modalCurrent: 1,
    modalPageSize: 20,
    modalTotal: 0,
    modalLoading: false,
    modalDataSource: [],
  };

  componentDidMount() {
    this.fetchModalData();
  }

  modalColumns = [
    {
      title: '分配时间',
      key: '分配时间',
      dataIndex: 'allocatedDate',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '执行部门',
      key: '执行部门',
      dataIndex: 'dept',
    },
    {
      title: '中断步骤',
      key: '中断步骤',
      dataIndex: 'step',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '中断时间',
      key: '中断时间',
      dataIndex: 'intrptDrtn',
      render: (text, record) => <div>{text.split(' ')[0]}<br />{text.split(' ')[1]}</div>,
    },
    {
      title: '开户手机',
      key: '开户手机',
      dataIndex: 'phone',
      render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户号',
      key: '客户号',
      dataIndex: 'khh',
    },
    {
      title: '开户日期',
      key: '开户日期',
      dataIndex: 'openDate',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '是否入金',
      key: '是否入金',
      dataIndex: 'isMoney',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '首次入金时间',
      key: '首次入金时间',
      dataIndex: 'moneyDate',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '当前净资产',
      key: '当前净资产',
      dataIndex: 'assets',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '当前理财产品市值',
      key: '当前理财产品市值',
      dataIndex: 'wealth',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '当前股票市值',
      key: '当前股票市值',
      dataIndex: 'marketValue',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '近一年资产峰值',
      key: '近一年资产峰值',
      dataIndex: 'peakAsset',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '累计总交易量',
      key: '累计总交易量',
      dataIndex: 'volume',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '累计总贡献',
      key: '累计总贡献',
      dataIndex: 'contribute',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '有效户',
      key: '有效户',
      dataIndex: 'validAccount',
    },
    {
      title: '中端富裕客户',
      key: '中端富裕客户',
      dataIndex: 'midRange',
    },
    {
      title: '开发关系',
      key: '开发关系',
      dataIndex: 'development',
    },
    {
      title: '服务关系',
      key: '服务关系',
      dataIndex: 'service',
    },
    {
      title: '两融户',
      key: '两融户',
      dataIndex: 'financial',
    },
    {
      title: '期权户',
      key: '期权户',
      dataIndex: 'optionAccount',
    },
    {
      title: '开通科创板',
      key: '开通科创板',
      dataIndex: 'innovationBoard',
    },
    {
      title: '开通创业板',
      key: '开通创业板',
      dataIndex: 'gemOpened',
    },
    {
      title: '开通新三板',
      key: '开通新三板',
      dataIndex: 'thirdBoard',
    },
  ];

  modalColumnsPrd = [
    {
      title: '分配时间',
      key: '分配时间',
      dataIndex: 'allocatedDate',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '场景名称',
      key: '场景名称',
      dataIndex: 'zdlx',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '执行部门',
      key: '执行部门',
      dataIndex: 'dept',
    },
    {
      title: '中断步骤',
      key: '中断步骤',
      dataIndex: 'step',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户号',
      key: '客户号',
      dataIndex: 'khh',
    },
    {
      title: '中断日期',
      key: '中断日期',
      dataIndex: 'intrptDrtn',
      render: (text, record) => <div>{text.split(' ')[0]}<br />{text.split(' ')[1]}</div>,
    },
    {
      title: '执行后再签约时间',
      key: '执行后再签约时间',
      dataIndex: 'gmsj',
    },
    {
      title: '当前净资产',
      key: '当前净资产',
      dataIndex: 'assets',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '当前股票市值',
      key: '当前股票市值',
      dataIndex: 'marketValue',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '累计交易总量',
      key: '累计交易总量',
      dataIndex: 'volume',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '累计总贡献',
      key: '累计总贡献',
      dataIndex: 'contribute',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '是否有效户',
      key: '是否有效户',
      dataIndex: 'validAccount',
    },
    {
      title: '是否中端富裕客户',
      key: '是否中端富裕客户',
      dataIndex: 'midRange',
    },
    {
      title: '开发关系',
      key: '开发关系',
      dataIndex: 'development',
    },
    {
      title: '服务关系',
      key: '服务关系',
      dataIndex: 'service',
    },
  ];

  getYwColumns = (type)=>{
    let columns1 = [
      {
        title: '分配时间',
        key: '分配时间',
        dataIndex: 'allocatedDate',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '中断原因',
        key: '中断原因',
        dataIndex: 'step',
      },
      {
        title: '执行部门',
        key: '执行部门',
        dataIndex: 'dept',
      },
      // {
      //   title: '执行人员',
      //   key: '执行人员',
      //   dataIndex: 'dept',
      // },
      {
        title: '中断时间',
        key: '中断时间',
        dataIndex: 'intrptDrtn',
        render: (text, record) => <div>{text.split(' ')[0]}<br />{text.split(' ')[1]}</div>,
      },
      {
        title: '开户手机',
        key: '开户手机',
        dataIndex: 'phone',
        render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '客户号',
        key: '客户号',
        dataIndex: 'khh',
      },
      {
        title: '开户日期',
        key: '开户日期',
        dataIndex: 'openDate',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '首次入金时间',
        key: '首次入金时间',
        dataIndex: 'moneyDate',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '当前净资产',
        key: '当前净资产',
        dataIndex: 'assets',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '当前理财产品',
        key: '当前理财产品',
        dataIndex: 'wealth',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '当前股票市值',
        key: '当前股票市值',
        dataIndex: 'marketValue',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '近一年资产峰值',
        key: '近一年资产峰值',
        dataIndex: 'peakAsset',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '平均交易量',
        key: '平均交易量',
        dataIndex: 'pjjyl',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '平均贡献',
        key: '平均贡献',
        dataIndex: 'pjgx',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '入金交易量',
        key: '入金交易量',
        dataIndex: 'evalue',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '服务贡献',
        key: '服务贡献',
        dataIndex: 'rvalue',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '是否有效户',
        key: '是否有效户',
        dataIndex: 'validAccount',
      },
      {
        title: '是否中端富裕客户',
        key: '是否中端富裕客户',
        dataIndex: 'midRange',
      },
      {
        title: '开发关系',
        key: '开发关系',
        dataIndex: 'development',
      },
      {
        title: '服务关系',
        key: '服务关系',
        dataIndex: 'service',
      },
    ];
    let columns2 = [
      {
        title: '分配时间',
        key: '分配时间',
        dataIndex: 'allocatedDate',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '执行部门',
        key: '执行部门',
        dataIndex: 'dept',
      },
      // {
      //   title: '执行人员',
      //   key: '执行人员',
      //   dataIndex: 'dept',
      // },
      {
        title: '中断步骤',
        key: '中断步骤',
        dataIndex: 'step',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '中断时间',
        key: '中断时间',
        dataIndex: 'intrptDrtn',
        render: (text, record) => <div>{text.split(' ')[0]}<br />{text.split(' ')[1]}</div>,
      },
      {
        title: '开户手机',
        key: '开户手机',
        dataIndex: 'phone',
        render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '客户号',
        key: '客户号',
        dataIndex: 'khh',
      },
      {
        title: '开户日期',
        key: '开户日期',
        dataIndex: 'openDate',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '当前净资产',
        key: '当前净资产',
        dataIndex: 'assets',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '近一年资产峰值',
        key: '近一年资产峰值',
        dataIndex: 'peakAsset',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '召回业务交易量',
        key: '召回业务交易量',
        dataIndex: 'zhywjyl',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '召回业务贡献',
        key: '召回业务贡献',
        dataIndex: 'zhywgx',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '是否有效户',
        key: '是否有效户',
        dataIndex: 'validAccount',
      },
      {
        title: '是否中端富裕客户',
        key: '是否中端富裕客户',
        dataIndex: 'midRange',
      },
      {
        title: '开发关系',
        key: '开发关系',
        dataIndex: 'development',
      },
      {
        title: '服务关系',
        key: '服务关系',
        dataIndex: 'service',
      },
    ];
    return type === '6' ? columns1 : columns2;
  }

  handleModalPageChange = (modalCurrent, modalPageSize) => {
    this.setState({ modalCurrent, modalPageSize }, () => this.fetchModalData());
  }

  fetchModalData = () => {
    this.setState({ modalLoading: true });
    const { modalCurrent, modalPageSize } = this.state;
    const { payload = {}, record = {} } = this.props;
    const { tjzq = '' } = payload;
    let tjzqArr = tjzq.split(',');
    if (tjzqArr.length < 2) {
      tjzqArr = ['', ''];
    }
    const param = {
      "beginDate": tjzqArr[0],
      "child": payload.chnl,
      "allocatedept": record.zxbm === '总计' ? payload.zxbm : record.deptId,
      "dept": payload.dept,
      "endDate": tjzqArr[1],
      "type": "1",
      "staff": "",
      "paging": 1,
      "total": -1,
      "current": modalCurrent,
      "pageSize": modalPageSize,
      "zdlx": payload.zdlx,
      zdyy: payload.zdyy,
      ywlx: payload.ywlx,
    };
    DepPerfermReportBegin(param).then(res => {
      let { records = [], total = 0 } = res;
      records = records.map((item, index) => ({ ...item, key: index }));
      this.setState({ modalDataSource: records, modalTotal: total, modalLoading: false });
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }

  render() {
    const { payload = {}, record = {} } = this.props;
    const { tjzq = '' } = payload;
    let tjzqArr = tjzq.split(',');
    if (tjzqArr.length < 2) {
      tjzqArr = ['', ''];
    }
    const param = {
      "beginDate": tjzqArr[0],
      "child": payload.chnl,
      "allocatedept": record.deptId,
      "dept": payload.dept,
      "endDate": tjzqArr[1],
      "type": "1",
      "staff": "",
      "zdlx": payload.zdlx,
      zdyy: payload.zdyy,
      ywlx: payload.ywlx,
    };
    return (
      <div style={{ position: 'relative' }}>
        <Scrollbars autoHide style={{ width: '100%', height: this.state.height }}>
          <Row style={{ padding: '0 16px' }}>
            <Row type='flex' justify='space-between' style={{ overflow: 'hidden', padding: '12px 0' }}>
              <Col></Col>
              <Col>
                <ExportButton exportsType='depPerfermReportBegin' displayColumns={['3','4'].includes(payload.zdlx) ? this.modalColumnsPrd : ['6','7'].includes(payload.zdlx) ? this.getYwColumns(payload.zdlx) : this.modalColumns} queryParameter={param} selectedCount={this.state.modalTotal} />
              </Col>
            </Row>
            <Table rowKey='key' loading={this.state.modalLoading} columns={['3','4'].includes(payload.zdlx) ? this.modalColumnsPrd : ['6','7'].includes(payload.zdlx) ? this.getYwColumns(payload.zdlx) : this.modalColumns} dataSource={this.state.modalDataSource} className={`m-table-customer ${styles.table}`} pagination={false} scroll={{ x: 2940, y: this.state.modalDataSource.length > 0 ? this.state.height - 116 : 0 }} />
          </Row>
        </Scrollbars>
        <div style={{ height: 44 }}></div>
        <div style={{ padding: '10px 16px', width: '100%', textAlign: 'right', height: 44, position: 'absolute', bottom: '0', right: '0', boxShadow: '0 0 12px 0 rgba(5, 14, 28, 0.12)' }}>
          <Pagination
            size='small'
            showLessItems
            showQuickJumper
            showSizeChanger
            showTotal={(total) => <div style={{ fontSize: 12 }}>{`总共${total}条`}</div>}
            pageSizeOptions={['20', '50', '100', '200']}
            className={`${styles.pagination}  ${styles.smallPagination}`}
            pageSize={this.state.modalPageSize}
            current={this.state.modalCurrent}
            total={this.state.modalTotal}
            onChange={this.handleModalPageChange}
            onShowSizeChange={(current, pageSize) => this.handleModalPageChange(1, pageSize)}
          />
        </div>
      </div>
    );
  }
}

export default CustomerModal;