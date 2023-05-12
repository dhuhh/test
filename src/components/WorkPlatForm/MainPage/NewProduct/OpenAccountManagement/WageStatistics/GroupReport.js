import React, { Component } from 'react';
import { Button, Col, DatePicker, Input, message, Pagination, Row, TreeSelect, Select, Checkbox, Spin, Modal, Progress } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import lodash, { initial, map } from 'lodash';
import BasicDataTable from '$common/BasicDataTable';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import { QueryChannelAuthorityDepartment, GetSalarys, QueryStaffTips } from '$services/newProduct';
import { FetchExcStaffList } from '../../../../../../services/incidentialServices';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less';
import config from '$utils/config';
const { Option } = Select; const { api } = config;
const {
  newProduct: {
    getSalarysExport,
  } } = api;

class GroupReport extends Component {
  state = {
    tjDate: [moment().startOf('year'), moment()],
    allYyb: [], // 所有营业部数据
    channelValue: [], // 渠道
    groupValue: [], // 小组
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    department: undefined, // 营业部
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    dataSource: [],
    mode: ['month', 'month'],
    searchValue: '',
    ygTotal: 0,
    ygCurrent: 1,
    ygLoading: false,
    administratorData: [],
    listData: [],
    searchMemberValue: '',
    modalVisible: false,
  };
  componentDidMount() {
    this.getDepartments();
    this.fetchData();
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


  handlePanelChange = (tjDate, mode) => {
    this.setState({
      tjDate,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };
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
  fetchData = () => {
    this.setState({
      loading: true,
    });
    GetSalarys({
      salaryOrAchivement: '2',
      pageSize: this.state.pageSize,
      current: this.state.current,
      beginDate: this.state.tjDate[0]?.format('YYYYMM'),
      endDate: this.state.tjDate[1]?.format('YYYYMM'),
      dept: this.state.department,
      channelId: this.state.channelValue.join(','),
      channelDpId: this.state.groupValue.join(','),
      staff: this.state.listData.map(item => item.split('/')[0]).join(','),
      deptOrStaff: '1',
    }).then(res => {
      this.setState({
        dataSource: res.records,
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
        render: (text, record, index) => `${(this.state.current - 1) * this.state.pageSize + index + 1}`,
      },
      {
        title: '月份',
        key: '月份',
        dataIndex: 'month',
        render: (text) => moment(text).format('YYYY-MM'),
      },
      {
        title: '所属营业部',
        key: '所属营业部',
        ellipsis: true,
        dataIndex: 'ownerDept',
      },
      {
        title: '渠道',
        key: '渠道',
        dataIndex: 'channelDept',
      },
      {
        title: '渠道小组',
        key: '渠道小组',
        dataIndex: 'channelName',
      },
      {
        title: '累计到本月收入',
        key: '累计到本月收入',
        dataIndex: 'monthInCome',
      },
      {
        title: '累计到本月成本',
        key: '累计到本月成本',
        dataIndex: 'monthCost',
      },
      {
        title: '净利润',
        key: '净利润',
        dataIndex: 'profit',
      },
      {
        title: '正式盈利月份',
        key: '正式盈利月份',
        dataIndex: 'profitMonth',
        render: (text) => text && moment(text).format('YYYY-MM'),
      },
      {
        title: '计提比例',
        key: '计提比例',
        dataIndex: 'withdrawalRatio',
      },
      {
        title: '提成',
        key: '提成',
        dataIndex: 'commission',
      },
    ];
    return columns;
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
      listData: [],
      searchValue: '',
      tjDate: [moment().startOf('year'), moment()], // 开户时间周期
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
  changeStep = (step) => {
    this.setState({
      step,
    });
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = getSalarysExport;
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
          salaryOrAchivement: '2',
          beginDate: _this.state.tjDate[0]?.format('YYYYMM'),
          endDate: _this.state.tjDate[1]?.format('YYYYMM'),
          dept: _this.state.department,
          channelId: _this.state.channelValue.join(','),
          channelDpId: _this.state.groupValue.join(','),
          staff: _this.state.listData.map(item => item.split('/')[0]).join(','),
          deptOrStaff: '1',
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
  render() {
    const { dataSource = [], current, pageSize, mode, loading, administratorData, listData, total, ygCurrent, ygTotal, ygLoading, channelVisible, groupVisible } = this.state;
    const columns = this.getColumns() || [];
    columns.forEach(item => {
      if (item.title !== '序号') {
        item['ellipsis'] = true;
      }
    });
    dataSource.forEach((item, index) => {
      item['key'] = ((current - 1) * pageSize) + index + 1;
    });
    const tableProps = {
      scroll: { x: 1500 },
      rowKey: 'key',
      dataSource: dataSource,
      columns,
      pagination: false,
      loading,
    };
    const PaginationProps = {
      pageSize: 20,
      hideOnSinglePage: true,
      showQuickJumper: true,
      current: ygCurrent,
      onChange: this.handleYGPagerChange,
      total: ygTotal,
    };
    const marginBottom = this.state.department ? (this.state.department.split(',').length - 1) * 25 : 0;
    const { wageStatistics } = this.props.authorities;
    return (
      <div style={{ fontSize: 14, color: '#1A2243', background: '#FFF', overflow: 'auto' }} onClick={() => this.setState({ channelVisible: false, groupVisible: false })}>
        <Row style={{ margin: '0 0 12px 16px' }}>
          <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Col style={{ margin: '8px 36px 8px 0', display: 'flex', alignItems: 'center' }}>
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
                <div>渠道小组</div>
              </div>
              <MultipleSearchInput channelValue={this.state.groupValue} channelChange={this.groupChange} modalType='2' type='groupTeam' api='GetGroupInfoModel' source='query' visible={groupVisible} />
            </Col>
            <Col style={{ margin: '8px 24px 8px 0', alignItems: 'center' }} className={styles.btnStyle}>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
            </Col>
          </Row>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 16px 8px 0' }}>
          <div></div>
          {wageStatistics?.includes('export') && <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>}

        </div>
        <div style={{ padding: '0 16px', overflow: 'auto' }}>
          <BasicDataTable {...tableProps} className={`${styles.table} m-Card-Table`} />
          <div style={{ float: 'right', margin: '16px 0' }}>
            <Pagination
              size='small'
              showLessItems
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              className={`${styles.pagination}  ${styles.smallPagination}`}
              pageSize={pageSize}
              current={current}
              total={this.state.total}
              onChange={this.handlePageChange}
              onShowSizeChange={(current, pageSize) => this.handlePageChange(1, pageSize)}
            />
          </div>
        </div>
        <div style={{ backgroundColor: '#F2F3F7', height: '70px' }}></div>
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
      </div>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(GroupReport);
