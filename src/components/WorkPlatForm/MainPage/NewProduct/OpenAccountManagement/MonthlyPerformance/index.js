import React, { Component } from 'react';
import { Button, Col, DatePicker, message, Modal, Pagination, Progress, Row, TreeSelect, Checkbox, Select, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import lodash, { initial, map } from 'lodash';
import config from '$utils/config';
import BasicDataTable from '$common/BasicDataTable';
import { QueryChannelAuthorityDepartment, Getachievements, QueryStaffTips } from '$services/newProduct';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import { FetchExcStaffList } from '../../../../../../services/incidentialServices';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less';
const { Option } = Select;
const { api } = config;
const {
  newProduct: {
    getachievementsExport,
  } } = api;
class DataAnalysis extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    department: undefined, // 营业部
    tjDate: [moment().startOf('year'), moment()], // 统计时间周期
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    ygTotal: 0,
    ygCurrent: 1,
    ygLoading: false,
    administratorData: [],
    channelValue: [], // 渠道
    groupValue: [], // 小组
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    listData: [],
    searchMemberValue: '',
    searchValue: '',
    dataSource: [],
    mode: ['month', 'month'],
    modalVisible: false,
  };
  componentDidMount() {
    this.getDepartments();
    this.fetchData();
    // this.queryStaffPracticeInfo();
  }

  componentWillUnmount() {
    // 清空定时器,避免内存泄漏
    if (this.timers && this.timers.length > 0) {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
      });
      this.timers = null;
    }
    // 关闭EventSource,避免内存泄漏
    if (this.eventSources && this.eventSources.length > 0) {
      this.eventSources.forEach((eventSource) => {
        if (eventSource && eventSource.close) {
          eventSource.close();
        }
      });
      this.eventSources = null;
    }
  }

  queryStaffPracticeInfo = () => {
    this.setState({
      ygLoading: true,
    });
    FetchExcStaffList({
      cxlx: "2",
      zt: "0",
      cxbs: this.state.searchMemberValue,
      paging: 1,
      sort: '',
      total: -1,
      pageSize: 20,
      current: this.state.ygCurrent,
    }).then(res => {
      this.setState({
        administratorData: res.records,
        ygTotal: res.total,
        ygLoading: false,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  onChange = (checkedList) => {
    this.setState({
      listData: checkedList,
    });
  };
  handleOnFocus = () => {
    this.setState({
      searchMemberValue: '',
      ygCurrent: 1,
    }, () => {
      lodash.debounce(this.queryStaffPracticeInfo, 300)();
    });
  }
  searchAdmin = (value) => {
    this.setState({
      searchMemberValue: value,
      ygCurrent: 1,
    }, () => {
      lodash.debounce(this.queryStaffPracticeInfo, 300)();
    });
  }
  handleYGPagerChange = (ygCurrent) => {
    this.setState({
      ygCurrent,
    }, () => {
      this.queryStaffPracticeInfo();
    });
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }


  //查询每月业绩
  fetchData = () => {
    this.setState({
      loading: true,
    });
    Getachievements({
      salaryOrAchivement: '1',
      pageSize: this.state.pageSize,
      current: this.state.current,
      beginDate: this.state.tjDate[0]?.format('YYYYMM'),
      endDate: this.state.tjDate[1]?.format('YYYYMM'),
      dept: this.state.department,
      staff: this.state.listData.map(item => item.split('/')[0]).join(','),
      channelId: this.state.channelValue.join(','), //渠道id
      channelDpId: this.state.groupValue.join(',') , //渠道小组ID
    }).then(res => {
      const{ records , cnt = [] } = res;
      if(cnt){
        let item = {};
        item['myOption'] = cnt[0].myOptionCnt || '';
        item['trading'] = cnt[0].tradingCnt ;
        item['creditAccount'] = cnt[0].creditAccountCnt || '';
        item['accountNetCommission'] = cnt[0].accountNetCommissionCnt || '';
        item['totalContribute'] = cnt[0].totalContributeCnt || '';
        item['channelDept'] = cnt[0].channelDeptCnt || '';
        item['totalvolume'] = cnt[0].totalvolumeCnt || '';
        item['channel'] = cnt[0].channelCnt || '';
        item['staff'] = cnt[0].staffCnt || '';
        item['dept'] = cnt[0].deptCnt || '';
        item['equityBaseCommission'] = cnt[0].equityBaseCommissionCnt || '';
        item['oa'] = cnt[0].oaCnt || '';
        item['total'] = cnt[0].totalCnt || '';
        item['month'] = `${this.state.tjDate[0]?.format('YYYYMM')}-${this.state.tjDate[1]?.format('YYYYMM')}`;
        item['inflow'] = cnt[0].inflowCnt || '';
        item['staffOpen'] = cnt[0].staffOpenCnt || '';
        item['information'] = cnt[0].informationCnt || '';
        item['staffEffective'] = cnt[0].staffEffectiveCnt || '';
        records.unshift(item);
      }
      this.setState({
        dataSource: records,
        total: res.total,
        loading: false,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });;
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
  // 获取columns
  getColumns = () => {
    let columns = [
      {
        title: '序号',
        key: '序号',
        width: 53,
        render: (text, record, index) =>{
          if( index == '0'){
            return '合计' ;
          }else{
            return `${(this.state.current - 1) * this.state.pageSize + index }` ;
          }
        },
      },
      {
        title: '月份',
        key: '月份',
        width: 170,
        dataIndex: 'month',
        render: (text,record,index) =>{
          if(index == '0'){
            return text
          }else{
            return moment(text).format('yyyy-MM')
          }
        },
      },
      {
        title: '员工部门',
        key: '员工部门',
        width: 170,
        ellipsis: true,
        dataIndex: 'dept',
      },
      {
        title: '员工',
        key: '员工',
        dataIndex: 'staff',
        width: 180,
        ellipsis: true,
        render: (text, record) => text && text + '(' + record?.oa + ')',
      },
      {
        title: '员工账号',
        key: '员工账号',
        dataIndex: 'oa',
        width: 0,
      },
      {
        title: '渠道',
        key: '渠道',
        dataIndex: 'channel',
      },
      {
        title: '二维码名称',
        key: '二维码名称',
        dataIndex: 'channelDept',
      },
      {
        title: '新开客户数',
        key: '新开客户数',
        dataIndex: 'staffOpen',
      },
      {
        title: '新开有效户数',
        key: '新开有效户数',
        dataIndex: 'staffEffective',
      },
      {
        title: '资产净流入',
        key: '资产净流入',
        dataIndex: 'inflow',
      },
      {
        title: <div>普通账户净佣金<br />(不含港股通)</div>,
        key: '普通账户净佣金',
        align: 'center',
        dataIndex: 'accountNetCommission',
      },
      {
        title: '港股通净佣金',
        key: '港股通净佣金',
        dataIndex: 'trading',
      },
      {
        title: '信用账户净佣金',
        key: '信用账户净佣金',
        dataIndex: 'creditAccount',
      },
      {
        title: '信用息费收入',
        key: '信用息费收入',
        dataIndex: 'information',
      },
      {
        title: '期权净佣金',
        key: '期权净佣金',
        dataIndex: 'myOption',
      },
      {
        title: '股基净佣金',
        key: '股基净佣金',
        dataIndex: 'equityBaseCommission',
      },
      {
        title: '当前总资产',
        key: '当前总资产',
        dataIndex: 'total',
      },
      {
        title: '总交易量',
        key: '总交易量',
        dataIndex: 'totalvolume',
      },
      {
        title: '总贡献',
        key: '总贡献',
        dataIndex: 'totalContribute',
      },
    ];
    return columns;
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
  handlePanelChange = (tjDate, mode) => {
    this.setState({
      tjDate,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };
  // 分页器
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = getachievementsExport;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = this.state.total;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let columns = _this.getColumns();
        columns.shift();
        let tableHeaderCodes = columns.map(item => item.dataIndex).join(',');
        let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key).join(',');
        let request = {
          salaryOrAchivement: '1',
          beginDate: _this.state.tjDate[0]?.format('YYYYMM'),
          endDate: _this.state.tjDate[1]?.format('YYYYMM'),
          dept: _this.state.department,
          staff: _this.state.listData.map(item => item.split('/')[0]).join(','),
          current: 0,
        };
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          request,
        });
        const form1 = document.createElement('form');
        form1.id = 'form1';
        form1.name = 'form1';
        // 添加到 body 中
        document.getElementById('m_iframe').appendChild(form1);
        // 创建一个输入
        const input = document.createElement('input');
        // 设置相应参数
        input.type = 'text';
        input.name = 'exportPayload';
        input.value = exportPayload;

        // 将该输入框插入到 form 中
        form1.appendChild(input);

        // form 的提交方式
        form1.method = 'POST';
        // form 提交路径
        form1.action = action;

        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById('m_iframe').removeChild(form1);

        if (total >= 10000000 && typeof EventSource !== 'undefined') {
          // if (typeof EventSource !== 'undefined') {
          if (!_this.timers) {
            _this.timers = [];
          }
          // 浏览器支持 Server-Sent
          const timer1 = setTimeout(() => {
            _this.setState({ modalVisible: true, percent: 0 });
            const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
            let eventSourcesIndex = 0;
            // 成功与服务器发生连接时触发
            source.onopen = () => {
              if (!_this.eventSources) {
                _this.eventSources = [];
              }
              eventSourcesIndex = _this.eventSources.legnth;
              _this.eventSources.push(source);
            };
            source.onmessage = (event) => {
              const { data: percent = 0 } = event;
              if (percent === '100') {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
                const timer2 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(timer => timer === timer2);
                    if (index >= 0) {
                      _this.timers.splice(index, 1);
                    }
                  }
                }, 1000);
                _this.timers.push(timer2);
              }
              // handle message
              _this.setState({ percent });
            };
            source.onerror = () => {
              source.close();
              if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
              const timer3 = setTimeout(() => {
                _this.setState({ modalVisible: false, percent: 0 });
                if (_this.timers && _this.timers.length > 0) {
                  const index = _this.timers.findIndex(timer => timer === timer3);
                  if (index >= 0) {
                    _this.timers.splice(index, 1);
                  }
                }
              }, 1000);
              _this.timers.push(timer3);
            };
          }, 500);
          _this.timers.push(timer1);
        } else {
          // 浏览器不支持 Server-Sent..
        }
      },
    });
  }

  // 重置
  reset = () => {
    this.setState({
      channelValue: [], // 渠道
      groupValue: [], // 小组
      department: undefined, // 营业部
      searchValue: '',
      listData: [],
      searchMemberValue: '',
      tjDate: [moment().startOf('year'), moment()], // 统计时间周期
    });
  }




  render() {
    const { dataSource = [], current, pageSize, mode, loading, administratorData, listData, total, ygCurrent, ygTotal, ygLoading, channelVisible, groupVisible } = this.state;


 

    dataSource.forEach((item, index) => {
      item['key'] = ((current - 1) * pageSize) + index + 1;

    });
    const columns = this.getColumns() || [];
    columns.forEach(item => {
      if (item.title !== '序号') {
        item['ellipsis'] = true;
      }
    });
    const tableProps = {
      scroll: { x: 2280 },
      rowKey: 'key',
      loading: loading,
      dataSource: dataSource,
      columns,
      pagination: false,
    };
    const PaginationProps = {
      pageSize: 20,
      hideOnSinglePage: true,
      showQuickJumper: true,
      current: ygCurrent,
      onChange: this.handleYGPagerChange,
      total: ygTotal,
    };
    const { monthlyPerformance } = this.props.authorities;
    return (
      <div style={{ fontSize: 14, color: '#1A2243', background: '#FFF', overflow: 'auto' }} onClick={() => this.setState({ channelVisible: false, groupVisible: false })}>
        <Row style={{ margin: '12px 0 12px 16px', display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>统计月份</span>
            <DatePicker.RangePicker
              allowClear={false}
              value={this.state.tjDate}
              className={styles.rangePicker}
              dropdownClassName={`${styles.calendar} m-bss-range-picker`}
              mode={mode}
              style={{ width: '264px' }}
              placeholder={['开始日期', '结束日期']}
              format="YYYY-MM"
              separator='至'
              disabledDate={(current) => current && current > moment().endOf('day')}
              onChange={tjDate => this.setState({ tjDate })}
              onPanelChange={this.handlePanelChange}
            />
          </Col>
          <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingRight: '8px' }}>开户营业部</div>
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
          <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>员工</span>
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              <Select
                placeholder='请选择员工'
                className={styles.mulSelect}
                onSearch={this.searchAdmin}
                showArrow={listData.length === 0}
                allowClear={true}
                mode='multiple'
                defaultActiveFirstOption={false}
                maxTagCount={3}
                maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)
                }
                maxTagTextLength={7}
                menuItemSelectedIcon={e => {
                  return administratorData.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={listData.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
                }}
                onChange={(e) => this.onChange(e)}
                value={listData}
                onFocus={this.handleOnFocus}
                dropdownClassName={styles.dropDown}
                dropdownRender={menu => (
                  <div className='m-bss-select-checkbox'>
                    <Spin spinning={ygLoading}>
                      <div className='m-bss-select-dropdown' >{menu}</div>
                    </Spin>
                    <div style={{ marginTop: '3px', marginBottom: '3px', textAlign: 'right' }}>
                      <Pagination {...PaginationProps} simple />
                    </div>
                  </div>
                )}
              // open
              >
                {administratorData.map(item => <Option key={`${item.yhid}/${item.yhxm}`} value={`${item.yhid}/${item.yhxm}/${item.yhbh}`} >{`${item.yhxm}(${item.yhbh})`}</Option>)}
              </Select >
            </div>
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 36px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ channelVisible: true, groupVisible: false }); }}>
            <span style={{ marginRight: 8 }}>渠道</span>
            <MultipleSearchInput channelValue={this.state.channelValue} channelChange={this.channelChange} source='query' visible={channelVisible} />
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 36px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ channelVisible: false, groupVisible: true }); }}>
            <div style={{ marginRight: 8, textAlign: 'right' }}>
              <div>二维码名称</div>
            </div>
            <MultipleSearchInput channelValue={this.state.groupValue} channelChange={this.groupChange} api='GetGroupInfoModel' source='query' visible={groupVisible} modalType = '4'/>
          </Col>
          <Col style={{ margin: '8px 24px 8px 0', alignItems: 'center' }} className={styles.btnStyle}>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 16px 8px 0' }}>
          <div></div>
          {monthlyPerformance?.includes('export') && <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>}
        </div>
        <div style={{ padding: '0 16px', overflow: 'auto' }}>
          <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} className={`${styles.table} m-Card-Table`} />
          <div style={{ float: 'right', margin: '16px 0' }}>
            <Pagination
              size='small'
              showLessItems
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              className={`${styles.pagination} ${styles.smallPagination}`}
              pageSize={pageSize}
              current={current}
              total={total}
              onChange={this.handlePageChange}
              onShowSizeChange={(current, pageSize) => this.handlePageChange(1, pageSize)}
            />
          </div>
        </div>
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        <Modal
          title="系统处理中,请稍候..."
          centered
          destroyOnClose
          closable={false}
          maskClosable={false}
          visible={this.state.modalVisible}
          footer={null}
        >
          <Row>
            <Col span={2}>进度:</Col>
            <Col span={22}><Progress percent={parseInt(this.state.percent, 10)} status={this.state.percent === '100' ? 'success' : 'active'} /></Col>
          </Row>
        </Modal>
      </div >
    );
  }
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(DataAnalysis);