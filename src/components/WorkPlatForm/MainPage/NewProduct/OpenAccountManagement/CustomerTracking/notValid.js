import React, { Component } from 'react';
import { Button, Col, DatePicker, Input, message, Pagination, Row, TreeSelect, Form, Icon , Select } from 'antd';
import { connect } from 'dva';
import { history } from 'umi';
import moment from 'moment';
import BasicDataTable from '$common/BasicDataTable';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import SingleSelect from '../Common/SingleSelect';
import { QueryChannelAuthorityDepartment, GetTracksCustInfoList, SaveChnnlAccnBreakCust } from '$services/newProduct';
import TreeUtils from '$utils/treeUtils';
import Distribution from './Common/Distribution';
import OtherOperate from './Common/OtherOperate';
import Execute from './Common/Execute';
import styles from './index.less';



class interruptAccount extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    channelValue: [], // 渠道
    groupValue: [], // 小组
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    department: undefined, // 营业部
    khDate: [null, null], // 开户时间周期
    statcDim: '', 
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    dataSource: [],
    searchValue: '',
    staff: '',
    selectAll: false,
    selectedRowKeys: [],
    customerTotal: 0,
    selectedRows: [],
    note: '',
  };
  componentDidMount() {
    this.getDepartments();
    this.fetchData();
  }
  fetchData = () => {
    this.setState({
      loading: true,
    });
    GetTracksCustInfoList({
      paging: 1,
      total: -1,
      proType: 3,
      current: this.state.current,
      pageSize: this.state.pageSize,
      beignDate: this.state.khDate[0]?.format('YYYYMMDD'),
      endDate: this.state.khDate[1]?.format('YYYYMMDD'),
      custType: this.state.statcDim * 1,
      dept: this.state.department,
      chnnlId: this.state.channelValue.join(','),
      grpId: this.state.groupValue.join(','),
      staff: this.state.staff,
    }).then(res => {
      this.setState({
        dataSource: res.records,
        total: res.total,
        loading: false,
        note: res.note,
      });
      this.props.getChnnlAccnBreakCust();
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }


  // 获取管辖营业部的数据
  getDepartments = () => {
    QueryChannelAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      this.setState({ departments, allYyb: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 渠道选择
  channelChange = (value) => {
    this.setState({
      channelValue: value,
    });
  }
  // 小组选择
  groupChange = (value) => {
    this.setState({
      groupValue: value,
    });
  }

  // 营业部选择
  departmentChange = (value) => {
    this.setState({
      department: value,
    });
  }
  staffChange = (e) => {
    this.setState({
      staff: e.target.value,
    });
  }



  // 点击维度按钮
  // handleStatcDimClick = (activeKey) => {
  //   this.setState({ statcDim: activeKey });
  // }

  // 获取columns
  getColumns = () => {
    let columns = [
      {
        title: '序号',
        width: 72,
        fixed: 'left',
        render: (text, record, index) => `${(this.state.current - 1) * this.state.pageSize + index + 1}`,
      },
      {
        title: '客户手机',
        key: '客户手机',
        width: 130,
        dataIndex: 'custPhone',
      },
      {
        title: '姓名',
        key: '姓名',
        dataIndex: 'custName',
      },
      {
        title: '证件号码',
        key: '证件号码',
        width: 190,
        dataIndex: 'custCert',
      },
      {
        title: '开户12个月累计股基成交金额',
        key: '开户12个月累计股基成交金额',
        width: 230,
        ellipsis: true,
        dataIndex: 'femoral',
      },
      {
        title: '本月日均总资产',
        key: '本月日均总资产',
        width: 160,
        dataIndex: 'talAssets',
      },
      {
        title: '外部市值',
        key: '外部市值',
        dataIndex: 'market',
      },
      {
        title: '开户营业部',
        key: '开户营业部',
        width: 180,
        ellipsis: true,
        dataIndex: 'accnDept',
      },
      {
        title: '二维码类型',
        key: '二维码类型',
        dataIndex: 'grpTp',
      },
      {
        title: '渠道',
        key: '渠道',
        width: 150,
        ellipsis: true,
        dataIndex: 'chnnlName',
      },
      {
        title: '二维码名称',
        key: '二维码名称',
        width: 150,
        ellipsis: true,
        dataIndex: 'chnnlGrup',
      },
      {
        title: '推荐人',
        key: '推荐人',
        dataIndex: 'deploy',
      },
      {
        title: '状态',
        key: '状态',
        dataIndex: 'statusNm',
      },
      {
        title: '跟进部门',
        key: '跟进部门',
        width: 180,
        ellipsis: true,
        dataIndex: 'follDept',
      },
      {
        title: '跟进人',
        key: '跟进人',
        dataIndex: 'follPon',
      },
      {
        title: '过期时间',
        key: '过期时间',
        width: 180,
        dataIndex: 'expieTm',
        render: (text, record) => <span className={moment(record.expieTm).diff(moment(), 'day') <= 1 ? styles.expiredDate : ''}>{text}</span>,
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: '操作',
        align: 'center',
        width: 120,
        fixed: 'right',
        render: (text, record) => <div className='m-black' onClick={() => this.setInfo(record)}>详情<Icon type="right" />{record.info === '0' && <span style={{ width: 6, height: 6, background: 'red', borderRadius: '50%', display: 'inline-block', transform: 'translateY(-10px)' }} />}</div>,
      },
    ];
    return columns;
  }
  setInfo = (record) => {
    window.open(`${window.location.href.substring(0, window.location.href.indexOf('#') + 1)}/customerPanorama/customerInfo?customerCode=${record.custNm}`);
    let param = {
      proType: 3,
      srcType: 7,
      beignDate: this.state.khDate[0]?.format('YYYYMMDD'),
      endDate: this.state.khDate[1]?.format('YYYYMMDD'),
      custType: this.state.statcDim * 1,
      dept: this.state.department,
      chnnlId: this.state.channelValue.join(','),
      grpId: this.state.groupValue.join(','),
      staff: this.state.staff,
      isAll: 2,
      accnId: record.processid,
    };
    SaveChnnlAccnBreakCust(param).then(res => {
      if (res.code > 0) {
        this.fetchData();
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 分页器
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };


  // 重置
  reset = () => {
    this.setState({
      channelValue: [], // 渠道
      groupValue: [], // 小组
      department: undefined, // 营业部
      staff: '',
      searchValue: '',
      khDate: [null, null], // 开户时间周期
      statcDim: '',

    });
  }


  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYyb = [] } = this.props;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
  }

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.props;
    const util = (fid, title) => {
      if (fid === '0') return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  }

  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let { department } = this.state;
    if (value.length) {
      department = department ? department.split(',') : [];
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (department.indexOf(item) === -1) department.push(item);
        });
      } else {
        array.forEach(item => {
          if (department.indexOf(item) > -1) department.splice(department.indexOf(item), 1);
        });
      }
    } else {
      department = [];
    }
    this.setState({ searchValue: this.state.searchValue, department: department.join(',') });
  }

  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  }

  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }
  resetTable = () => {
    this.setState({
      selectAll: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
  }
  // 选中二维码类型
  codeChange = (value) => {
    this.setState({
      statcDim: value,
    });
  }
  render() {
    const { dataSource = [], current, pageSize, selectAll, selectedRowKeys, channelVisible, groupVisible, loading, total, customerTotal, selectedRows, note , statcDim } = this.state;
    // const btnStatus = selectAll || selectedRowKeys.length !== 0;
    const columns = this.getColumns() || [];
    columns.forEach(item => {
      if (item.dataIndex !== 'cz' && item.title !== '序号') {
        item['ellipsis'] = true;
      }
    });
    const tableProps = {
      scroll: { x: 2380 },
      rowKey: 'processid',
      dataSource: dataSource,
      columns,
      loading,
      pagination: false,
      // rowSelection: {
      //   type: 'checkbox',
      //   crossPageSelect: true, // checkbox默认开启跨页全选
      //   selectAll: this.state.selectAll,
      //   selectedRowKeys: this.state.selectedRowKeys,
      //   onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      //     this.setState({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys });
      //     if (currentSelectAll) {
      //       this.setState({
      //         customerTotal: total - currentSelectedRowKeys.length,
      //       });
      //     } else {
      //       this.setState({
      //         customerTotal: currentSelectedRowKeys.length,
      //       });
      //     }
      //   },
      //   getCheckboxProps: record => ({
      //     disabled: record.status === 0,
      //     name: record.status,
      //   }),
      //   fixed: true,
      // },
      onChange: this.handleTableChange,
    };

    // const oprProp = {
    //   selectedRows,
    //   note,
    //   btnStatus,
    //   customerTotal,
    //   selectAll,
    //   selectedRowKeys,
    //   tableType: 3,
    //   fetchData: this.fetchData,
    //   resetTable: this.resetTable,
    //   beignDate: this.state.khDate[0]?.format('YYYYMMDD'),
    //   endDate: this.state.khDate[1]?.format('YYYYMMDD'),
    //   custType: this.state.statcDim,
    //   dept: this.state.department,
    //   chnnlId: this.state.channelValue.join(','),
    //   grpId: this.state.groupValue.join(','),
    //   staff: this.state.staff,
    //   isAll: this.state.selectAll ? 1 : 2,
    //   accnId: this.state.selectedRowKeys.join(','),
    // };
    // const { customerTracking } = this.props.authorities;
    const { dictionary = {} } = this.props;
    const groupTypeInfo = dictionary['CHNL_EWMLX'] || [];
    return (
      <div style={{ fontSize: 14, color: '#1A2243', background: '#FFF', overflow: 'auto' }} onClick={() => this.setState({ channelVisible: false, groupVisible: false })}>
        <Row style={{ margin: '0 0 12px 16px' }}>
          <Row style={{ display: 'flex' }}>
            <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>开户时间</span>
              <DatePicker.RangePicker
                value={this.state.khDate}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                style={{ width: '264px' }}
                placeholder={['开始日期', '结束日期']}
                format="YYYY-MM-DD"
                separator='至'
                disabledDate={(current) => current && current > moment().endOf('day')}
                onChange={khDate => this.setState({ khDate })}
              />
            </Col>
            <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }}>
              <span style={{ marginRight: 8 }}>二维码类型</span>
              <SingleSelect selectChange={this.codeChange} selectValue={statcDim}/>
            </Col>
            <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }} className={styles.formItem}>
              <div className={styles.formItemLabel}>开户营业部</div>
              <TreeSelect
                showSearch
                className={styles.treeSelect}
                style={{ width: '160px' }}
                value={this.formatValue(this.state.department)}
                treeData={this.state.departments}
                // dropdownMatchSelectWidth={false}
                dropdownClassName='m-bss-treeSelect'
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                filterTreeNode={this.filterTreeNode}
                placeholder="营业部"
                allowClear
                multiple
                // searchValue={this.state.searchValue}
                treeDefaultExpandAll
                maxTagCount={3}
                maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                maxTagTextLength={5}
                treeCheckable={true}
                onChange={this.handleYybChange}
                onSearch={this.handleYybSearch}
                treeCheckStrictly={true}
              // showCheckedStrategy={TreeSelect.SHOW_ALL}
              />
            </Col>
          </Row>
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ channelVisible: true, groupVisible: false }); }}>
              <span style={{ marginRight: 8 }}>渠道</span>
              <MultipleSearchInput channelValue={this.state.channelValue} channelChange={this.channelChange} source='query' visible={channelVisible} />
            </Col>
            <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ groupVisible: true, channelVisible: false }); }}>
              <span style={{ marginRight: 8 }}>二维码名称</span>
              <MultipleSearchInput channelValue={this.state.groupValue} channelChange={this.groupChange} api='GetGroupInfoModel' source='query' visible={groupVisible} />
            </Col>
            <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 24px 8px 0' }}>
              <span style={{ marginRight: 8 }}>客户</span>
              <Input value={this.state.staff} onChange={this.staffChange} style={{ width: 160, height: 30 }} placeholder='姓名/手机号/证件号' />
            </Col>
            <Col style={{ margin: '8px 24px 8px 2px' }} className={styles.btnStyle}>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
            </Col>
          </Row>
        </Row>
        <div className={styles.tableBottom}>
          {/* <div className={styles.btnBox} style={{display:'none'}}>
            {customerTracking?.includes('asign') && <Distribution {...oprProp} oprType={5}></Distribution>}
            {customerTracking?.includes('excute') && <Execute {...oprProp} oprType={6}></Execute>}
            {customerTracking?.includes('ignore') && <OtherOperate {...oprProp} oprType={3}></OtherOperate>}
            {customerTracking?.includes('further') && <OtherOperate {...oprProp} oprType={1}></OtherOperate>}
            {customerTracking?.includes('exchange') && <Distribution {...oprProp} oprType={4}></Distribution>}
            {customerTracking?.includes('refurther') && <OtherOperate {...oprProp} oprType={2}></OtherOperate>}
          </div> */}
        </div>
        <div style={{ padding: '0 16px', overflow: 'auto' }}>
          <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} className={`${styles.table} m-Card-Table`} />
          <div style={{ float: 'right', margin: '10px 0 0 0' }}>
            <Pagination
              size='small'
              showLessItems
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              className={`${styles.pagination} ${styles.smallPagination}`}
              pageSize={pageSize}
              current={current}
              total={this.state.total}
              onChange={this.handlePageChange}
              onShowSizeChange={(current, pageSize) => this.handlePageChange(1, pageSize)}
            />
          </div>
        </div>
      </div >
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(Form.create()(interruptAccount));