import React from 'react';
import { Row, Pagination, message, Table } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { QueryRelEventList } from '$services/ecifEvent';
import workStyles from '../../index.less';
class EcifRelatedEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      total: 0,
      pageSize: 10,
      current: 1,
      sortRules: '1',
      height: document.body.offsetHeight < 680 ? document.body.offsetHeight - 180 : 500,
      flag: 0,
    };
  }

  componentDidMount() {
    this.fetchData({}, 1);
  }

  componentDidUpdate() {
    if (this.state.flag) {
      let d = document.getElementsByClassName('cusRelatEvent')[0];
      if (d && d.offsetHeight < this.state.height) {
        this.setState({ height: d.offsetHeight });
      }
      this.setState({ flag: 0 });
      d = null;
    }
  }

  fetchData = (payload = {}, flag = 0) => {
    const { current , pageSize } = this.state;
    this.setState({ loading: true });
    const params = {
      current: 1,
      custCode: this.props.custCode,
      eventId: this.props.ecifEventType,
      motId: this.props.motId,
      pageLength: 0,
      pageNo: current,
      pageSize,
      paging: 1,
      sort: "",
      sortRules: 0,
      total: -1,
      totalRows: 0 ,
      isTreatment: 0, // 是否查询处理  1 处理  0 否
    };
    QueryRelEventList(params).then((response) => {
      const { records = [], total } = response;
      this.setState({ dataSource: records, loading: false, total, flag });
    }).catch((error) => {
      message.error(error.note || error.success);
    });
  }


  assembleColumns = () => {
    const columns = [
      {
        title: '客户账户不规范情形',
        dataIndex: 'disorderlyName',
        key: 'disorderlyName',
        fixed: 'left',
        width: 240,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '事件描述',
        dataIndex: 'describe',
        key: 'describe',
        className:'columnLine',
        width: 390,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '重要程度',
        dataIndex: 'importance',
        key: 'importance',
        className:'columnLine',
        // width: 150,
        render: (text) => <div >{text}</div>,
      },
      {
        title: '处理方式',
        dataIndex: 'treatmentWay',
        key: 'treatmentWay',
        className:'columnLine',
        // width: 150,
        render: (text) => <div >{text === '1' ? '尽职调查' : text === '2' ? '通知' : '账户核查'}</div>,
      },
      {
        title: '审核状态',
        dataIndex: 'auditingStatus',
        key: 'auditingStatus',
        className:'columnLine',
        // width: 150,
        render: (text) => <div style={{ cursor: 'pointer' }}>{text}</div>,
      },
      {
        title: '分配日期',
        dataIndex: 'distributionTime',
        key: 'distributionTime',
        className:'columnLine',
        // width: 150,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },

    ];
    return columns;
  }


  handleChangePage = (current, pageSize) => {
    this.setState({ current, pageSize });
    this.fetchData({ current, pageSize });
  }

  render() {
    const { loading, dataSource, total, pageSize, current, height } = this.state;
    const tableProps = {
      className: `m-table-customer ${workStyles.table} cusRelatEvent`,
      rowKey: 'eventId',
      loading,
      columns: this.assembleColumns(),
      dataSource,
      pagination: false,
    };
    const pagination = {
      size: 'small',
      className: `${workStyles.pagination}`,
      showTotal: () => `总共${total}条`,
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '20'],
      total,
      pageSize,
      current,
      onChange: this.handleChangePage,
      onShowSizeChange: (_, pageSize) => { this.handleChangePage(1, pageSize); },
    };
    return (
      <React.Fragment>
        <Row style={{ marginTop: 13 }}>
          <Scrollbars autoHide style={{ width: '100%', height: height }}>
            <Row style={{ padding: '0 25px' }}>
              <Table {...tableProps} />
            </Row>
          </Scrollbars>
        </Row>
        <Row style={{ padding: '20px 25px', textAlign: 'right' }}>
          <Pagination {...pagination} />
        </Row>
      </React.Fragment>
    );
  }
}
export default EcifRelatedEvents;
