import React from 'react';
import { history as router } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Pagination, Tooltip, Icon, Button, Modal, message, Spin } from 'antd';
import BasicDataTable from '../../../../../Common/BasicDataTable';
import Exports from '../Common/Exports';
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
      if (res.code === 1) {
        this.props.searchInfo();
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  batchBan = () => {
    let param = {};
    if (this.state.selectAll) {
      if (this.state.selectedRowKeys.join(',')) {
        param = { 'chnlId': this.state.selectedRowKeys.join(','), 'oprTp': 3, 'srcId': 1 };
      } else {
        param = { 'oprTp': 3, 'srcId': 1 };
      }
    } else {
      param = { 'chnlId': this.state.selectedRowKeys.join(','), 'oprTp': 3, 'srcId': 2 };
    }
    ChannelManagementModel(param).then(res => {
      if (res.code === 1) {
        this.props.searchInfo();
        this.setState({
          selectedRowKeys: [],
          selectAll: false,
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
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
    // console.log(sorter);
    if (sorter.order) {
      let order = sorter.order === 'ascend' ? 'asc' : 'desc';
      param = sorter.field + " " + order;
    }
    // console.log(filters['是否禁用']);
    if (filters['是否禁用']) {
      this.props.filterIsActive(filters['是否禁用'][0]);
    }
    this.props.sortChange(param);
  }
  render() {
    let srvcFeeDtl = this.props.channelInfo[0]?.srvcFeeDtl || [];
    srvcFeeDtl = srvcFeeDtl.filter(item => item.name !== '计提比例');
    srvcFeeDtl.push(this.props.channelInfo[0]?.srvcFeeDtl[0]);
    const arr = ((srvcFeeDtl || []).map((item, index) => {
      return {
        title: item?.name,
        dataIndex: `srvcFeeDtl${index + 1}`,
        width: 90,
        ellipsis: true,
        render: (text, record) => {
          if (item?.name === '计提比例') {
            return record.srvcFeeDtl.find(item1 => item1.name === item.name)?.fee + '%';
          } else {
            return record.srvcFeeDtl.find(item1 => item1.name === item.name)?.fee;
          }
        },
      };
    }));
    let columns = [
      {
        title: '序号',
        width: 72,
        render: (text, record, index) => `${(this.props.current - 1) * this.props.pageSize + index + 1}`,
      },
      {
        title: '渠道代码',
        dataIndex: 'chnlCode',
        width: 120,
        ellipsis: true,
        key: '渠道代码',
        sorter: true,
      },
      {
        title: '渠道名称',
        dataIndex: 'chnlNm',
        key: '渠道名称',
        sorter: true,
        width: 150,
        ellipsis: true,
      },
      {
        title: '佣金协议',
        dataIndex: 'cmsnAgr',
        width: 140,
        ellipsis: true,
        key: '佣金协议',
      },
      {
        title: '授权营业部',
        dataIndex: 'authDeptNum',
        key: '授权营业部',
        width: 120,
        sorter: true,
        render: (value, record, index) => <div onClick={() => this.showModal(record.authDeptLst)} style={{ cursor: 'pointer', color: '#244FFF' }}>{record.authDeptNum}</div>
        ,
      },
      {
        title: '分类',
        dataIndex: 'chnlTp',
        width: 70,
        key: '分类',
      },
      {
        title: (<div>创建小组<br />总部审批</div>),
        dataIndex: 'crtGrpAdt',
        key: '创建小组总部审批',
      },
      {
        title: (<div>允许个人<br />开发关系</div>),
        dataIndex: 'pmsnPersRlt',
        key: '允许个人开发关系',
      },
      /* {
        title: '服务费1',
        dataIndex: 'srvcFeeDtl1',
        width: 90,
        ellipsis: true,
        key: '服务费1',
      },
      {
        title: '服务费2',
        dataIndex: 'srvcFeeDtl2',
        width: 90,
        ellipsis: true,
        key: '服务费2',
      },
      {
        title: '计提比例',
        dataIndex: 'srvcFeeDtl0',
        width: 90,
        // ellipsis: true,
        key: '计提比例',
      } */
      ...arr,
      {
        title: '是否禁用',
        dataIndex: 'statusNm',
        key: '是否禁用',
        filterMultiple: false,
        width: 120,
        filters: [
          {
            text: '是',
            value: '2',
          },
          {
            text: '否',
            value: '1',
          }],
      },
      {
        title: '创建时间',
        dataIndex: 'crtTm',
        key: '创建时间',
        sorter: true,
        width: 170,
      },
      {
        title: '管理人',
        dataIndex: 'mngUsrNm',
        width: 150,
        key: '管理人',
        ellipsis: true,
        render: (text, record, index) => text + '(' + record.mngUsrNo + ')',
      },
      {
        title: '操作',
        dataIndex: '',
        key: '操作',
        width: 150,
        fixed: 'right',
        render: (text, record, index) => (
          <div>
            {
              this.props.authorities.channelManagement?.indexOf("forbid") > -1 ? (
                record.status === 2 ?
                  <span style={{ marginRight: '16px', cursor: 'pointer' }} onClick={() => this.isActive({ 'oprTp': 4, 'chnlId': record.chnlId, 'chnlCode': record.chnlCode })}>启用</span> :
                  <span style={{ marginRight: '16px', cursor: 'pointer', color: '#E81818' }} onClick={() => this.isActive({ 'oprTp': 3, 'chnlId': record.chnlId, 'chnlCode': record.chnlCode, srcId: 2 })}>禁用</span>
              ) : ''
            }
            {
              this.props.authorities.channelManagement?.indexOf("edit") > -1 ? (record.status === 2 ? '' : <span style={{ marginRight: '16px', color: '#244FFF', cursor: 'pointer' }} onClick={() => router.push({ pathname: '/newProduct/changeChannel', state: record, change: Date.now().toString(36) })}>修改</span>) : ''
            }
            {
              this.props.authorities.channelManagement?.indexOf("logview") > -1 ? (<span style={{ marginRight: '16px', color: '#0E8AFF', cursor: 'pointer' }} onClick={() => this.logShowModal({ 'objId': record.chnlId * 1, 'oprSc': 1 })}>日志</span>) : ''
            }

          </div>
        ),
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
        key: '操作类型',
        width: 82,
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
      scroll: { x: 1790 },
      rowKey: 'chnlId',
      dataSource: this.props.channelInfo,
      columns,
      className: 'm-Card-Table',
      pagination: false,
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: true, // checkbox默认开启跨页全选
        selectAll: this.state.selectAll,
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
          // console.log(currentSelectedRowKeys, selectedRows, currentSelectAll);
          this.setState({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys });
        },
        getCheckboxProps: record => ({
          disabled: record.status === 0, // Column configuration not to be checked
          name: record.status,
        }),
        fixed: true,
      },
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

    const queryParameter = {
      chnlTp: this.props.typeValue * 1,
      bgnDt: this.props.dateValue[0]?.format('YYYYMMDD'),
      endDt: this.props.dateValue[1]?.format('YYYYMMDD'),
      chnlId: this.props.channelValue,
      chnlInf: "",
      status: this.props.filter * 1,
      sort: this.props.sorter,
    };

    const btnStatus = this.state.selectAll || this.state.selectedRowKeys.length !== 0;
    // console.log(this.props.authorities);
    return (
      <React.Fragment>
        <Modal
          title={`授权营业部(${this.state.departmentInfo.length})`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.departmentModal}
        >
          {this.state.departmentInfo.map((item, index, arr) => <span key={item.deptId} style={{ color: '#61698C' }}>{item.deptName}{index === arr.length - 1 ? '' : ', '}</span>)}
        </Modal>
        <Modal
          title="操作日志"
          visible={this.state.logVisible}
          destroyOnClose
          onOk={this.logHandleOk}
          onCancel={this.logHandleCancel}
          className={styles.logModal}
          width='1000px'
          footer={<Pagination {...logPaginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />}
        >
          <Scrollbars autoHide style={{ height: '300px' }}>
            <BasicDataTable {...logTableProps} style={{ padding: '12px 16px 0 16px' }} className={`${styles.table}`} />
          </Scrollbars>
        </Modal>
        <div className={styles.channelTable}>
          <div className={styles.tableBtn}>
            {
              this.props.authorities.channelManagement?.indexOf("export") > -1 ?
                <Exports displayColumns={columns} exportsType='channelManagement' selectedCount={this.props.total} queryParameter={queryParameter} /> : ''
            }
            {
              this.props.authorities.channelManagement?.indexOf('add') > -1 ?
                <Button className={`m-btn ant-btn m-btn-blue m-bss-btn ${styles.addBtn}`} type="button" onClick={() => router.push({ pathname: '/newProduct/addChannel', add: Date.now().toString(36) })}>新增</Button> : ''
            }
            {/*导出*/}
          </div>
          <Spin spinning={this.props.loading}>
            <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} />
          </Spin>
          <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
        </div>
        <div className={styles.tableBottom}>
          <div className={styles.btnBox}>
            {this.props.authorities.channelManagement?.indexOf("forbid") > -1 ? <Button disabled={btnStatus ? false : true} className={`${styles.bannedBtn} ${btnStatus ? styles.activeBtn : styles.deactiveBtn}`} onClick={this.batchBan}>批量禁用</Button> : ''}
          </div>
        </div>
      </React.Fragment >
    );
  }
}
export default DataTable;