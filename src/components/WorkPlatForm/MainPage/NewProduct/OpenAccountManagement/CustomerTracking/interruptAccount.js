import React, { Component } from 'react';
import { Button, Col, DatePicker, Input, message, Pagination, Row, TreeSelect, Modal, Form, Select, Icon, Card } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { prefix } from '../../../../../../utils/config';
import { EncryptBase64 } from '../../../../../Common/Encrypt';
import moment from 'moment';
import BasicDataTable from '$common/BasicDataTable';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import SingleSelect from '../Common/SingleSelect';
import { QueryChannelAuthorityDepartment, GetTracksCustInfoList, SaveChnnlAccnBreakCust } from '$services/newProduct';
import { getQueryDictionary } from '$services/searchProcess';
import { OperateAxFullinServerRecord, OperateAxMessageSend, FetchStaffMessageQuotal, OperateAssignIntrptCust } from '../../../../../../services/incidentialServices';
import { getDictKey } from '../../../../../../utils/dictUtils';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less';
import UploadFiles from './UploadFiles';
import Distribution from './Common/Distribution';
import OtherOperate from './Common/OtherOperate';
import FilterColumn from './Common/FilterColumn';
import { assign } from 'lodash';
const { TextArea } = Input;
const { Option } = Select;


class interruptAccount extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    breakStepDate: [], // 中断步骤
    statusInfoDate: [] , //状态
    channelValue: [], // 渠道
    groupValue: [], // 小组
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    department: undefined, // 营业部
    khDate: [null, null], // 开户时间周期
    statcDim: '', //二维码类型  1|个人户 2|渠道小组 3 营业部合作小组  
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    dataSource: [],
    searchValue: '',
    staff: '',
    statusInfo: '' , //状态--列表筛选
    breakStep: '', //中断步骤--列表筛选
    staffInfo: '', //人员
    selectAll: false,
    selectedRows: [],
    selectedRowKeys: [],
    visible: false,
    customerTotal: 0,
    fwfs: '1',
    fwjg: '1',
    fileMd5: '',
    messageQuota: {},
    note: '',
    oneClick: false,
  };
  componentDidMount() {
    this.getDepartments();
    this.fetchData();
    this.getAllQueryDictionary();
  }
  fetchData = () => {
    this.setState({
      loading: true,
    });
    GetTracksCustInfoList({
      paging: 1,
      total: -1,
      proType: 1,
      current: this.state.current,
      pageSize: this.state.pageSize,
      beignDate: this.state.khDate[0]?.format('YYYYMMDD'),
      endDate: this.state.khDate[1]?.format('YYYYMMDD'),
      custType: this.state.statcDim * 1,
      dept: this.state.department,
      chnnlId: this.state.channelValue.join(','),
      grpId: this.state.groupValue.join(','),
      staff: this.state.staff,
      staffInfo: this.state.staffInfo,
      breakStep: this.state.breakStep,
      statusInfo: this.state.statusInfo ,
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
  resetTable = () => {
    this.setState({
      selectAll: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
  }
  // 中断步骤--INTCUS_STP 状态--INTSRV_ST  字典 
  getAllQueryDictionary = ()=>{
    Promise.all([
      getQueryDictionary( { dictionaryType: "INTCUS_STP" }),
      getQueryDictionary( { dictionaryType: "INTSRV_ST" }),
    ]).then(res=>{
      const [res1, res2 ] = res;
      const { records: records1 = [] } = res1;
      const { records: records2 = [] } = res2;
      this.setState({ breakStepDate: records1 , statusInfoDate: records2 });
    });

  };

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
  staffInfoChange = (e) => {
    this.setState({
      staffInfo: e.target.value,
    });
  }

  setBreakStep = (obj) => {
    this.setState({ breakStep: obj },()=>{this.fetchData();});
  }

  setStatusInfo = (obj) => {
    this.setState({ statusInfo: obj },()=>{this.fetchData();});
  }

  // 点击维度按钮
  // handleStatcDimClick = (activeKey) => {
  //   this.setState({ statcDim: activeKey });
  // }

  // 获取columns
  getColumns = () => {

    const { breakStepDate , statusInfoDate } = this.state;
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
        title: '中断步骤',
        key: '中断步骤',
        width: 160,
        ellipsis: true,
        dataIndex: 'breakStep',
        filterDropdown: ({ confirm }) => <FilterColumn setData={this.setBreakStep} fetchData={this.fetchData} YWLC_ZTList={ breakStepDate } confirm={confirm } /> ,
      },
      {
        title: '中断时间',
        key: '中断时间',
        width: 160,
        dataIndex: 'breakTm',
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
        width: 150,
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
        filterDropdown: ({ confirm }) => <FilterColumn setData={this.setStatusInfo} YWLC_ZTList={ statusInfoDate } confirm={confirm } /> ,
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
        render: (text, record) => {
          const params = {
            custNo: record.id,
          };
          const paramsStr = JSON.stringify(params);
          return <Link onClick={() => this.setInfo(record)} to={`${prefix}/single/incidentialServices/customerBreak/${EncryptBase64(paramsStr)}`} target="_blank" className='m-black'>详情<Icon type="right" />{record.info === '0' && <span style={{ width: 6, height: 6, background: 'red', borderRadius: '50%', display: 'inline-block', transform: 'translateY(-10px)' }} />}</Link>;
        },
      },
    ];
    return columns;
  }
  setInfo = (record) => {
    let param = {
      proType: 1,
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
      staffInfo: '', //人员
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
  showModalExe = () => {
    const { note, selectAll, selectedRowKeys, selectedRows } = this.state;
    const Params = {
      uuid: selectedRows.map(item => item.id).join(','), // 所选客户对应的uid
      asgnTp: 4, // 1.分配；2.转办；3.撤回
      asgnMode: '', // 1.按员工；2.按部门；
      wthrAll: selectAll ? 1 : 0, // 0.非全选；1.全选
      qrySqlId: note,//note
      objNo: '', // 执行人；执行部门
      asgnNum: '', // 客户数
    };
    OperateAssignIntrptCust({ ...Params, asgnParm: '0' }).then((result) => {
      const { code: cxCode = 0 } = result;
      if (cxCode > 0) {
        this.setState({
          visible: true,
        }, this.fetchStaffMessageQuotal());
      }
    }).catch((error) => {
      Modal.warn({ content: !error.success ? error.message : error.note });
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      fwfs: '1',
      fwjg: '1',
      fileMd5: '',
      messageQuota: {},
      content: '',
      oneClick: false,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ oneClick: true });
        const { fwfs, fileMd5 } = this.state;
        const { selectAll, selectedRowKeys, note, selectedRows } = this.state;
        const xcfwsj = values.xcfwsj === '' ? '' : moment(values.xcfwsj).format('YYYYMMDD');
        if (fwfs !== '2') { // 填写服务记录
          const payload = {
            md5: fileMd5 !== '' ? fileMd5[0] : '',
            selectAll: selectAll ? '1' : '0', // 0.非全选；1.全选
            selectCode: selectedRows.map(item => item.id).join(','), // 所选客户对应的uid
            uuid: note,
            severMode: fwfs, // 服务方式
            severResult: values.fwjg, // 服务结果
            severCntnt: values.fwnr, // 服务内容
            nextSeverTime: xcfwsj, //下次服务时间
          };
          this.handServerRecord(payload);
        } else { //  发送短信
          const payload = {
            cntnt: values.dxnr, // 短信内容
            selectAll: selectAll ? '1' : '0', // 0.非全选；1.全选
            selectCode: selectedRows.map(item => item.id).join(','), // 所选客户对应的uid
            uuid: note,
          };
          this.handMessageSend(payload);
        }
      }
    });
  }
  handServerRecord = (payload) => {
    OperateAxFullinServerRecord(payload).then((result) => {
      const { code = 0 } = result;
      if (code > 0) {
        Modal.success({
          content: '填写服务记录成功！',
          onOk: () => {
            this.handleCancel();
            this.fetchData();
            this.resetTable();
          },
        });
      }
    }).catch((error) => {
      Modal.warn({ content: !error.success ? error.message : error.note });
      this.setState({
        oneClick: false,
      });
    });
  }

  handMessageSend = (payload) => {
    OperateAxMessageSend(payload).then((result) => {
      const { code = 0, note = '' } = result;
      if (code > 0) {
        Modal.success({
          content: note,
          onOk: () => {
            this.handleCancel();
            this.fetchData();
            this.resetTable();
          },
        });
      }
    }).catch((error) => {
      Modal.warn({ content: !error.success ? error.message : error.note });
      this.setState({
        oneClick: false,
      });
    });
  }

  fetchStaffMessageQuotal = () => {
    FetchStaffMessageQuotal().then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0) {
        this.setState({
          messageQuota: records[0],
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 选中二维码类型
  codeChange = (value) => {
    this.setState({
      statcDim: value,
    });
  }

  render() {
    const { dataSource = [], current, pageSize, selectAll, selectedRowKeys, channelVisible, groupVisible,
      loading, total, customerTotal, fwfs, fwjg, messageQuota, oneClick , statcDim } = this.state;
    
    // const btnStatus = selectAll || selectedRowKeys.length !== 0;
    let columns = this.getColumns() || [];
    columns.forEach(item => {
      if (item.dataIndex !== 'cz' && item.title !== '序号') {
        item['ellipsis'] = true;
      }
    });
    const tableProps = {
      scroll: { x: 2180 },
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
      //     this.setState({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys, selectedRows });
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
    const { getFieldDecorator } = this.props.form;
    const { dictionary = {} } = this.props;
    const groupTypeInfo = dictionary['CHNL_EWMLX'] || [];
    const { [getDictKey('qzkhfwfs')]: fwfsList = [], [getDictKey('qzkhfwjg')]: fwjgList = [] } = dictionary;
    // const oprProp = {
    //   btnStatus,
    //   customerTotal,
    //   selectAll,
    //   selectedRowKeys,
    //   tableType: 1,
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
            <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 24px 8px 0' }}>
              <span style={{ marginRight: 8 }}>员工</span>
              <Input value={this.state.staffInfo} onChange={this.staffInfoChange} style={{ width: 160, height: 30 }} placeholder='员工ID/姓名' />
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
          {/* 产品要求屏蔽 */}
          {/* <div className={styles.btnBox} style={{display:'none'}}>
            {customerTracking?.includes('asign') && <Distribution {...oprProp} oprType={5}></Distribution>}
            {customerTracking?.includes('excute') && <Button onClick={this.showModalExe} disabled={btnStatus ? false : true} className={`${styles.bannedBtn} ${btnStatus ? styles.activeBtn : styles.deactiveBtn}`} >执行{selectedRowKeys.length > 0 || selectAll ? `(${customerTotal})` : ''}</Button>}
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
        
        <Modal
          title='处理'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          width={700}
          className={styles.iframe}
          footer={null}
        >
          <Form onSubmit={(e) => !oneClick ? this.handleSubmit(e) : ''} className="m-form-default ant-advanced-search-form" style={{ paddingTop: '2rem' }}>
            <Row>
              <Col span={16}>
                <Form.Item className="m-form-item m-bss-modal-form-item " label="服务方式" wrapperCol={{ span: 12 }}>
                  {
                    getFieldDecorator('fwfs', { initialValue: fwfs })(<Select
                      placeholder='请选择服务方式'
                      allowClear={true}
                      onSelect={value => this.setState({ fwfs: value })}
                    >
                      {fwfsList.map(item => <Option key={item.note} value={item.ibm}>{item.note}</Option>)}
                    </Select>)
                  }
                </Form.Item>
              </Col>
            </Row>
            {fwfs !== '2' && (
              <Row>
                <Col span={16}>
                  <Form.Item className="m-form-item m-bss-modal-form-item " label="服务内容" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator('fwnr', { initialValue: '' })(<TextArea style={{ width: '100%' }}
                        // placeholder="可输入自定义备注信息"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                      />)
                    }
                  </Form.Item>
                </Col>
              </Row>
            )}
            {fwfs !== '2' && (
              <Row>
                <Col span={16}>
                  <Form.Item className="m-form-item m-bss-modal-form-item " label="服务结果" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator('fwjg', { initialValue: fwjg })(<Select
                        // placeholder='请选择服务方式'
                        allowClear={true}
                        onSelect={(value) => { this.setState({ fwjg: value }); }}
                      >
                        {fwjgList.map(item => <Option key={item.note} value={item.ibm}>{item.note}</Option>)}
                      </Select>)
                    }
                  </Form.Item>
                </Col>
              </Row>
            )}
            {fwfs !== '2' && fwjg !== '1' && (
              <Row>
                <Col span={16}>
                  <Form.Item className="m-form-item m-bss-modal-form-item " label="下次服务时间" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator('xcfwsj', { initialValue: '' })(<DatePicker disabledDate={(current) => current < moment().add(-1, 'day')} />)
                    }
                  </Form.Item>
                </Col>
              </Row>
            )}
            {fwfs !== '2' && (
              <Row>
                <Col span={20}>
                  <Form.Item className="m-form-item m-bss-modal-form-item " label="附件" wrapperCol={{ span: 12 }}>
                    <div>
                      <UploadFiles onChange={params => this.setState({ fileMd5: params.fileMd5 })} />
                      <Card className="m-card default fs12 m-darkgray" style={{ width: '340px', position: 'absolute', top: 0, left: '160px', lineHeight: '21px' }}>
                        {'单个附件带下限制50M，为便于移动签批，请上传word、excel、ppt、pdf、txt等常用格式文件，尽可能不上压缩包'}
                      </Card>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            )}
            {fwfs === '2' && (
              <Row>
                <Col span={16}>
                  <Form.Item className="m-form-item m-bss-modal-form-item " label="短信内容" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator('dxnr', { initialValue: '' })(<TextArea style={{ width: '100%' }}
                        // placeholder="可输入自定义备注信息"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                      />)

                    }
                  </Form.Item>
                </Col>
              </Row>
            )}
            {fwfs === '2' && (
              <Row>
                <Form.Item className="m-form-item m-bss-modal-form-item">
                  <Card className="m-card default fs14 m-lightgray" style={{ paddingLeft: '8.5rem' }}>
                    <p>{'提示'}</p>
                    <p>{`本月发送短信限制${messageQuota.bype}条， 还可发送${messageQuota.bycxsype}条`}</p>
                    <p>{`每次最多${messageQuota.mcsl}条， 最大允许字数：150字`}</p>
                    <p>{'如使用模板，模板中的$V{KHXM}会自动替换为客户姓名'}</p>
                  </Card>
                </Form.Item>
              </Row>
            )}
            <Row className='tr pd16'>
              {fwfs !== '2' && <Button className='m-btn ant-btn mr20' style={{ height: '40px', borderRadius: '0px' }} onClick={this.handleCancel}>取消</Button>}
              <Button className='m-btn ant-btn m-btn-blue' style={{ height: '40px', borderRadius: '0px' }} htmlType="submit">{fwfs !== '2' ? '保存' : '发送'}</Button>
            </Row>
          </Form>
        </Modal>
      </div >
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(Form.create()(interruptAccount));