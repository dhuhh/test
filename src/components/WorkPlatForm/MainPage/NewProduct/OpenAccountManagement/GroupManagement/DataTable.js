import React from 'react';
import { history as router } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Pagination, Spin, message, Button, Modal, Tooltip } from 'antd';
import BasicDataTable from '../../../../../Common/BasicDataTable';
import { ChannelManagementModel, GetOperateRecord } from '$services/newProduct';
import styles from './index.less';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: '',
      dataSource: [],
      selectAll: false,
      selectedRowKeys: [],
      visible: false,
      logVisible: false,
      departmentInfo: [],
      logInfo: [],
      pageSize: 10,
      current: 1,
      total: 0,
      id: {},
      loading: false,
    };
  }
  getOperateRecord = (id) => {
    this.setState({
      id,
      loading: true,
    });
    const param = {
      "pageSize": this.state.pageSize,
      "current": this.state.current,
    };
    GetOperateRecord({ ...param, ...id }).then(res => {
      this.setState({
        logInfo: res.records,
        total: res.total,
        loading: false,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handlePagerSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
      current,
    }, () => {
      this.getOperateRecord(this.state.id);
    });
  }
  handlePagerChange = (current, pageSize) => {
    this.setState({
      pageSize,
      current,
    }, () => {
      this.getOperateRecord(this.state.id);
    });

  }
  logShowModal = (id) => {

    this.setState({
      logVisible: true,
      current: 1,
    }, () => {
      this.getOperateRecord(id);
    });
  };

  logHandleOk = e => {
    this.setState({
      logVisible: false,
    });
  };

  logHandleCancel = e => {
    this.setState({
      logVisible: false,
    });
  };

  showModal = (departmentInfo) => {
    this.setState({
      visible: true,
      departmentInfo,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  isActive = (param) => {
    ChannelManagementModel(param).then(res => {
      this.props.searchInfo();
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  oprBtn(type, record) {
    switch (type) {
      case '审批中': return (
        <>
          <span className={styles.oprBtn} onClick={() => router.push({ pathname: '/newProduct/groupDetail', state: record, detail: Date.now().toString(36) })}>详情</span>
          {this.props.authorities?.indexOf('logview') > -1 ? <span className={styles.logBtn} onClick={() => this.logShowModal({ 'objId': record.grpId * 1, 'oprSc': 2 })}>日志</span> : ''}
        </>
      );
      case '审批退回': return (
        <>
          {this.props.authorities?.indexOf('edit') > -1 ? <span className={styles.oprBtn} onClick={() => router.push({ pathname: '/newProduct/changeGroup', state: record, change: Date.now().toString(36) })}>修改</span > : ''}
          {this.props.authorities?.indexOf('logview') > -1 ? <span className={styles.logBtn} onClick={() => this.logShowModal({ 'objId': record.grpId * 1, 'oprSc': 2 })}>日志</span> : ''}
        </>
      );
      case '已生效': return (
        <>
          {this.props.authorities?.indexOf('qcode') > -1 || record.grpMbrLst.filter(item => item.stfNo === JSON.parse(sessionStorage.getItem('user')).loginName)?.length > 0 ?
            <span className={styles.oprBtn} onClick={() => router.push({ pathname: '/newProduct/download', state: record, download: Date.now().toString(36) })}>下载二维码</span> : ''}
          {this.props.authorities?.indexOf('edit') > -1 ? <span className={styles.oprBtn} onClick={() => router.push({ pathname: '/newProduct/changeGroup', state: record, change: Date.now().toString(36) })}>修改</span> : ''}
          {this.props.authorities?.indexOf('logview') > -1 ? <span className={styles.logBtn} onClick={() => this.logShowModal({ 'objId': record.grpId * 1, 'oprSc': 2 })}>日志</span> : ''}
        </>

      );
      // default: return <span className={styles.logBtn}>日志</span>;
    }
  }
  oprType(type) {
    switch (type) {
      case '1': return '新增';
      case '2': return '修改';
      case '3': return '禁用';
      case '4': return '启用';
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    let param = '';
    if (sorter.order) {
      let order = sorter.order === 'ascend' ? 'asc' : 'desc';
      param = sorter.field + " " + order;
    }
    this.props.sortChange(param);
  }
  render() {
    const columns = [
      {
        title: "序号",
        width: 80,
        align: "center",
        render: (text, record, index) =>
          `${(this.props.current - 1) * this.props.pageSize + index + 1}`,
      },
      {
        title: "二维码类型",
        dataIndex: "grpTp",
        key: "二维码类型",
        width: 120,
        sorter: true,
      },
      {
        title: "业务",
        dataIndex: "busTp",
        key: "业务",
        width: 100,
        sorter: true,
      },
      {
        title: "二维码名称/小组名称",
        dataIndex: "grpNm",
        key: "二维码名称/小组名称",
        width: 180,
        ellipsis: true,
        sorter: true,
      },
      {
        title: "渠道",
        dataIndex: "chnlNm",
        key: "渠道",
        sorter: true,
        ellipsis: true,
      },
      {
        title: "开户营业部",
        dataIndex: "acctDept",
        key: "开户营业部",
        width: 180,
        ellipsis: true,
        // render: (value, record, index) => <div onClick={() => this.showModal(record.authDeptLst)}>{record.authDeptNum}</div>,
      },
      {
        title: "存管银行",
        dataIndex: "depBank",
        ellipsis: true,
        key: "存管银行",
      },
      {
        title: "场景",
        dataIndex: "applSc",
        key: "场景",
        width: 90,
      },
      {
        title: "是否银行专属",
        dataIndex: "isBank",
        key: "是否银行专属",
        render: text => (text === "1" ? "是" : "否"),
        width: 110,
      },
      {
        title: "小组成员",
        dataIndex: "grpMbrLst",
        key: "小组成员",
        width: 140,
        render: function(value) {
          let arr = [];
          if (value.length > 1) {
            arr = value.filter((item, index) => index < 2);
          } else {
            arr = value;
          }
          return (
            <Tooltip
              title={
                <div className={styles.popOver}>
                  <div>
                    <div>OA账号</div>
                    <div>姓名</div>
                    <div>比例</div>
                  </div>
                  {value.map((item, index) => (
                    <div key={index}>
                      <div>{item.stfNo}</div>
                      <div>{item.stfNm}</div>
                      <div>{item.ratio}%</div>
                    </div>
                  ))}
                </div>
              }
              overlayClassName={styles.groupTip}
            >
              {arr.map((item, index, arr) => (
                <span key={index}>
                  {item.stfNm}
                  {index < arr.length - 1 ? "，" : ""}
                </span>
              ))}
              {value.length > 2 && "..."}
            </Tooltip>
          );
        },
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 100,
        key: "状态",
      },
      {
        title: "创建时间",
        dataIndex: "crtTm",
        width: 180,
        key: "创建时间",
      },
      {
        title: "管理人",
        dataIndex: "crtUsrNm",
        key: "管理人",
        width: 150,
        ellipsis: true,
        render: (text, record, index) => text + "(" + record.crtUsrNo + ")",
      },
      {
        title: "操作",
        dataIndex: "",
        key: "操作",
        // width: 158,
        fixed: "right",
        render: (text, record, index) => this.oprBtn(record.status, record),
      },
    ];
    const logColumns = [
      {
        title: '序号',
        width: 53,
        render: (text, record, index) => `${(this.state.current - 1) * this.state.pageSize + index + 1}`,
      },
      {
        title: '操作人',
        dataIndex: 'oprNm',
        key: '操作人',
        width: 121,
        ellipsis: true,
        render: (text, record, index) => text + record.oprNo,
      },
      {
        title: '操作时间',
        dataIndex: 'oprTm',
        width: 164,
        key: '操作时间',
      },
      {
        title: '操作类型',
        dataIndex: 'type',
        width: 82,
        key: '操作类型',
        render: (text) => this.oprType(text),
      },
      {
        title: '备注',
        dataIndex: 'description',
        ellipsis: true,
        key: '备注',
      },
    ];

    const tableProps = {
      scroll: { x: 1960 },
      rowKey: 'grpId',
      className: 'm-Card-Table',
      dataSource: this.props.groupInfo,
      columns,
      pagination: false,
      onChange: this.handleTableChange,
    };
    const paginationProps = {
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      pageSize: this.props.pageSize,
      current: this.props.current,
      onChange: this.props.handlePagerChange,
      onShowSizeChange: this.props.handlePagerSizeChange,
      total: this.props.total,
    };
    const logPaginationProps = {
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      pageSize: this.state.pageSize,
      current: this.state.current,
      onChange: this.handlePagerChange,
      onShowSizeChange: this.handlePagerSizeChange,
      total: this.state.total,
    };
    const logTableProps = {
      rowKey: 'oprId',
      dataSource: this.state.logInfo,
      columns: logColumns,
      pagination: false,
      loading: this.state.loading,
    };
    // console.log(this.props.authorities);
    // console.log(JSON.parse(sessionStorage.getItem('user')));
    return (
      <React.Fragment>
        <Modal
          key={this.state.id}
          title="操作日志"
          visible={this.state.logVisible}
          onOk={this.logHandleOk}
          onCancel={this.logHandleCancel}
          className={styles.logModal}
          width='1000px'
          destroyOnClose
          forceRender
          footer={<Pagination {...logPaginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />}
        >
          <Scrollbars autoHide style={{ height: '350px' }}>
            <BasicDataTable {...logTableProps} key='log' style={{ padding: '12px 16px 0 16px' }} className={`${styles.table}`} />
          </Scrollbars>
        </Modal>
        <div className={styles.channelTable}>
          <div className={styles.tableBtn}>
            {/* <Exports /> */}
            {
              this.props.authorities?.indexOf('add') > -1 ? <Button className={`m-btn ant-btn m-btn-blue m-bss-btn ${styles.addBtn}`} type="button" onClick={() => router.push({ pathname: '/newProduct/addGroup', add: Date.now().toString(36) })}>新增</Button> : ''
            }
            {/*导出*/}
          </div>
          <Spin spinning={this.props.loading}>
            <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} key='channel' />
          </Spin>
          <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
        </div>
      </React.Fragment >
    );
  }
}
export default DataTable;