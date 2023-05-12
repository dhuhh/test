import React from 'react';
import { Row, Pagination, message, Table } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import Filter from '../Filter';
// import BasicDataTable from '../../../../../../Common/BasicDataTable';
import { QueryRelationEventList } from '$services/newProduct';
import filter from '$assets/newProduct/filter.svg';
import filter_finished from '$assets/newProduct/filter_finished.svg';
import workStyles from '../../index.less';
class CustomerRelatedEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      // selectAll: false,
      // selectedRowKeys: [],
      total: 0,
      pageSize: 10,
      current: 1,
      sortRules: '1',
      height: document.body.offsetHeight < 680 ? document.body.offsetHeight - 180 : 500,
      flag: 0,
      visible: false,
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
    this.setState({ loading: true });
    const params = {
      cusNo: this.props.cusNo,
      sortRules: Number(payload.sortRules) || Number(this.state.sortRules),
      pageSize: payload.pageSize || this.state.pageSize,
      current: payload.current || this.state.current,
      paging: 1,
      total: -1,
    };
    QueryRelationEventList(params).then((response) => {
      const { records = [], total } = response;
      this.setState({ dataSource: records, loading: false, total, flag });
    }).catch((error) => {
      message.error(error.note || error.success);
    });
  }

  handleOk = () => {
    const { handleOk } = this.props;
    if (handleOk) {
      handleOk();
    }
  }

  // operateCheck = () => {
  //   return;
  // }

  _sortRulesData = [
    { key: '1', value: '最近更新' },
    { key: '2', value: '即将过期' },
  ];

  assembleColumns = () => {
    // const { dataSource = [] } = this.state;
    const columns = [{
      title: '事件标题',
      dataIndex: 'eventType',
      align: 'left',
      className: 'm-black',
      render: text => text || '--',
    },
    {
      title: '事件描述',
      dataIndex: 'describe',
      align: 'left',
      className: 'columnLine m-black',
      width: 470,
      // render: text => text || '--',
      render: text => <div style={{ letterSpacing: '1px' }}>{text || '--'}</div>,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      align: 'left',
      className: 'columnLine m-black',
      render: text => moment(text).format('YYYY-MM-DD') || '--',
      filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={this.state.sortRules !== '1' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
      filterDropdown: ({ confirm }) => <Filter visible={this.state.visible} value={this.state.sortRules} onChange={(value) => { this.setState({ sortRules: value, current: 1, visible: false }); confirm(); this.fetchData({ sortRules: value, current: 1 }); }} data={this._sortRulesData} />,
      onFilterDropdownVisibleChange: (visible) => this.setState({ visible }),
    },
    {
      title: '距离到期',
      dataIndex: 'deadline',
      align: 'left',
      className: 'columnLine m-black',
      render: text => <div>{Number(text) > 0 ? text + '天' : moment().subtract(Math.abs(Number(text)), 'days').format('YYYY-MM-DD')}</div>,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   render: (text, record) =>
    //     dataSource.length >= 1 ? (
    //       <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
    //         <Popconfirm
    //           placement="topRight"
    //           title='确定处理？'
    //           onConfirm={() => { this.operateCheck(record.gpId); }}
    //           okText="确认"
    //           cancelText="取消"
    //         >
    //           <a>处理</a>
    //         </Popconfirm>
    //       </div>
    //     ) : null,
    // },
    ];
    return columns;
  }

  // handleIgnore = () => {
  //   // return;
  //   Modal.confirm({
  //     title: '温馨提示',
  //     content: <p>忽略之后，将不再在待办中提示，可以在【工作】-【日历模式】查询历史，确定忽略选中的客户吗？</p>,
  //     okText: '确定',
  //     cancelText: '取消',
  //     onOk() {
  //       message.success('操作成功!');
  //     },
  //     onCancel() { },
  //   });
  // }

  // handleBatch = () => {
  //   return;
  // }

  // handleSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
  //   this.setState({
  //     selectedRowKeys: currentSelectedRowKeys,
  //     selectAll: currentSelectAll,
  //   });
  // }

  handleChangePage = (current, pageSize) => {
    this.setState({ current, pageSize });
    this.fetchData({ current, pageSize });
  }

  handleSortChange = (value) => {
    this.setState({ sortRules: value, current: 1 });
    this.fetchData({ sortRules: value, current: 1 });
  }

  render() {
    const { loading, dataSource, total, pageSize, current, height } = this.state;
    const tableProps = {
      className: `m-table-customer ${workStyles.table} cusRelatEvent`,
      rowKey: 'eventId',
      loading,
      columns: this.assembleColumns(),
      dataSource,
      // rowSelection: {
      //   type: 'checkbox',
      //   crossPageSelect: true, // checkbox默认开启跨页全选
      //   onChange: this.handleSelectChange, // 选择状态改变时的操作
      // },
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
    // let selectedCount = 0;
    // if (selectAll) {
    //   selectedCount = total - selectedRowKeys.length;
    // } else {
    //   selectedCount = selectedRowKeys.length;
    // }
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
          {/* <Button type="primary" htmlType="submit" className="m-btn-radius m-btn-white" onClick={this.handleIgnore}>忽略事件{selectedCount ? `(${selectedCount})` : ''}</Button>
          <Button className="m-btn-radius m-btn-white" onClick={this.handleBatch}>批量处理{selectedCount ? `(${selectedCount})` : ''}</Button> */}
          {/* <div style={{ padding: '10px' }}> */}
          <Pagination {...pagination} />
          {/* </div> */}
        </Row>
      </React.Fragment>
    );
  }
}
export default CustomerRelatedEvents;
