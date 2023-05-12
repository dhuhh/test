import React, { Component } from 'react';
import { Button, Col, DatePicker, Icon, Input, message, Modal, Pagination, Progress, Row, Select, Table, Tooltip, Checkbox, TreeSelect, Spin, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import config from '$utils/config';
import BasicDataTable from '$common/BasicDataTable';
import lodash, { initial, map } from 'lodash';
import { QueryPcxJjtgYjbb, QueryChannelAuthorityDepartment, QueryZhdm } from '$services/newProduct';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import MultipleSelect from '../Common/MultipleSelect';
import { FetchExcStaffList } from '../../../../../../services/incidentialServices';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less';
const { api } = config;
const { Option } = Select;
const {
  newProduct: {
    QueryPcxJjtgYjbbExport,
  } } = api;



class SalesPerformance extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    tjDateActiveKey: 1, // 统计时间周期选择项
    department: undefined, // 营业部
    tjDate: [moment().startOf('year'), moment()], // 统计时间周期
    tjDateRangePickerVisible: false,
    statcDim: 0, // 汇总维度 
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    dataSource: [],
    searchValue: '',
    gxType: 1,
    gxType_Copy: 1,
    ygTotal: 0,
    ygCurrent: 1,
    ygLoading: false,
    administratorData: [],
    listData: [],
    searchMemberValue: '',
    showDim: 1,//查询后展示的维度
    zhcl: [],
    staff: '',
  };
  newState = {}

  componentDidMount() {
    this.getDepartments();
    this.fetchData();
  }
   // 生成uuid
   guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
     return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
   }
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = QueryPcxJjtgYjbbExport;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = this.state.total;

    if (total <= 0) {
      Modal.info({ content: '当前无数据导出!' });
      return false;
    }
    if (total > 50000) {
      Modal.info({ content: '导出数据不能超过5万条!' });
      return;
    }
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let columns = _this.getColumns();
        let tableHeaderCodes = columns.map(item => item.dataIndex).join(',');
        let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key).join(',');
        let request = {
          beginDate: _this.newState.tjDate[0]?.format('YYYYMMDD'),
          endDate: _this.newState.tjDate[1]?.format('YYYYMMDD'),
          custRange: _this.newState.gxType,
          summary: _this.newState.statcDim + '',
          custId: _this.newState.listData.map(item => item.split('/')[0]).join(','),
          custNo: _this.newState.staff,
          strategy: _this.newState.zhcl.join(','),
          dept: _this.newState.department,
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



  // 获取管辖营业部的数据
  getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
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

  // 营业部选择
  departmentChange = (value) => {
    this.setState({
      department: value,
    });
  }

  // 点击时间周期按钮
  handleClick = (activeKey) => {
    const map = {
      1: [moment().startOf('year'), moment()],
      2: [moment().subtract(1, 'years'), moment()],
      3: [moment().subtract(1, 'months'), moment()],
      4: [moment().startOf('month'), moment()],
      5: [moment().subtract(1, 'days'), moment()],
    };
    this.setState({ tjDateActiveKey: activeKey, tjDate: map[activeKey] });
    console.log(map[activeKey][0].format('YYYY-MM-DD'), map[activeKey][1].format('YYYY-MM-DD'));
  }

  // 点击维度按钮
  handleStatcDimClick = (activeKey) => {
    this.setState({ statcDim: activeKey });
  }

  // 获取columns
  getColumns = () => {
    let columns = [
      {
        title: '分支机构',
        key: '分支机构',
        dataIndex: 'fzName',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '营业部',
        key: '营业部',
        dataIndex: 'yybName',
        width: 180,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>期间新签客户数</span>
            <Tooltip title='与期间首次签约客户数计算；签约客户需要以客户的基金投顾资产大于0才算，如客户已全部转走，则不在计算范围；'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '期间新签客户数',
        dataIndex: 'qjxQkhs',
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>期间新增市值</span>
            <Tooltip title='以期间首次签约客户当前市值计算'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '期间新增市值',
        dataIndex: 'qjXzsz',
      },
      {
        title: '期间服务费',
        key: '期间服务费',
        dataIndex: 'qjFwf',
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>期间预估手续费</span>
            <Tooltip title='期间收取客户的预估申购费、赎回费、销售服务费、维护费计算'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '期间预估手续费',
        dataIndex: 'qjSxf',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '期末签约客户数',
        key: '期末签约客户数',
        dataIndex: 'qmQykhs',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>期末持有策略数</span>
            <Tooltip title='单个客户持有一个策略，资产大于0计算为1，持有3个策略，资产都大于0计算3；'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '期末持有策略数',
        dataIndex: 'qmCycls',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '期末保有资产客户数',
        key: '期末保有资产客户数',
        dataIndex: 'haveAssetsCusCount',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '期末保有市值',
        key: '期末保有市值',
        dataIndex: 'qmBysz',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>累计签约资产</span>
            <Tooltip title='以对应客户累计转入资产计算；'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '累计签约资产',
        dataIndex: 'qjJlr',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>期末月日均保有</span>
            <Tooltip title='以期末月日均保有展示；'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '期末月日均保有',
        dataIndex: 'qmYrjby',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
    ];
    if (this.state.showDim === 1) {
      columns.splice(2, 0,
        {
          title: '员工姓名',
          key: '员工姓名',
          dataIndex: 'staffName',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '员工OA',
          key: '员工OA',
          dataIndex: 'oAAccount',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        });
    } else if (this.state.showDim === 2) {
      columns.splice(2, 2,
        {
          title: '客户姓名',
          key: '客户姓名',
          dataIndex: 'khxm',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '客户号',
          key: '客户号',
          dataIndex: 'customerNo',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '基金投顾关系(姓名)',
          key: '基金投顾关系(姓名)',
          dataIndex: 'staffName',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '基金投顾关系(OA)',
          key: '基金投顾关系(OA)',
          dataIndex: 'oAAccount',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        }
      );
      columns.splice(8, 1);
      columns.splice(9, 1);
    }
    return columns;
  }
  // 分页器
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };
  // 查询表格
  fetchData = () => {
    this.setState({ loading: true });
    QueryPcxJjtgYjbb({
      paging: 1,
      pageSize: this.state.pageSize,
      current: this.state.current,
      beginDate: this.state.tjDate[0]?.format('YYYYMMDD'),
      endDate: this.state.tjDate[1]?.format('YYYYMMDD'),
      custRange: this.state.gxType,
      summary: this.state.statcDim + '',
      custId: this.state.listData.map(item => item.split('/')[0]).join(','),
      custNo: this.state.staff,
      strategy: this.state.zhcl.join(','),
      dept: this.state.department,
    }).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({ dataSource: records, total, loading: false, dataSourceCount: res, showDim: this.state.statcDim });
      this.newState = this.state;
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }
  // 重置
  reset = () => {
    this.setState({
      tjDateActiveKey: 1, // 统计时间周期选择项
      department: undefined, // 营业部
      searchValue: '',
      tjDate: [moment().startOf('year'), moment()], // 统计时间周期
      statcDim: 0, // 汇总维度 
      gxType: 1,
      listData: [],//推荐人
      tjDateRangePickerVisible: false,
      zhcl: [],
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
  showTjIndex = (gxType) => {
    this.setState({
      gxType,
    });
  }
  zhclChange = (zhcl) => {
    this.setState({
      zhcl,
    });
  }
  staffChange = (e) => {
    this.setState({
      staff: e.target.value,
    });
  }


  render() {
    const { dataSource = [], current, pageSize, gxType, administratorData, listData, total, ygCurrent, ygTotal, ygLoading } = this.state;
    dataSource.forEach((item, index) => {
      if (item.key !== 'total') {
        item['key'] = ((current - 1) * pageSize) + index + 1;
      }
    });
    let columns = this.getColumns() || [];
    columns.forEach(item => {
      item['ellipsis'] = true;
    });
    const PaginationProps = {
      pageSize: 20,
      hideOnSinglePage: true,
      showQuickJumper: true,
      current: ygCurrent,
      onChange: this.handleYGPagerChange,
      total: ygTotal,
    };
    const { dataAnalysis } = this.props.authorities;
    return (
      <div style={{ fontSize: 14, color: '#1A2243', background: '#FFF', overflow: 'auto' }} onClick={() => this.setState({ channelVisible: false, groupVisible: false })}>
        <Row style={{ display: 'flex', flexWrap: 'wrap', margin: '12px 0 12px 16px' }} className={styles.searchContent}>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>客户范围</span>
            <span className={`${styles.tjIndex} ${gxType === 1 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(1)}>个人业务关系<Popover title={<span style={{ fontSize: '14px', color: ' #1A2243' }}>提示</span>} content={<div style={{ fontSize: '14px', color: ' #1A2243', width: '150px' }}>与员工本人有基金投顾关系的客户业绩数据</div>}><Icon type="question-circle" style={{ color: gxType === 1 ? '#244FFF' : '#959CBA', marginLeft: '2px' }} /></Popover></span>
            <span className={`${styles.tjIndex} ${gxType === 2 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(2)}>直属<Popover title={<span style={{ fontSize: '14px', color: ' #1A2243' }}>提示</span>} content={<div style={{ fontSize: '14px', color: ' #1A2243', width: '150px' }}>员工名下所有关系客户的基金投顾业绩数据</div>}><Icon type="question-circle" style={{ color: gxType === 2 ? '#244FFF' : '#959CBA', marginLeft: '2px' }} /></Popover></span>
            <span className={`${styles.tjIndex} ${gxType === 4 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(4)}>所有<Popover title={<span style={{ fontSize: '14px', color: ' #1A2243' }}>提示</span>} content={<div style={{ fontSize: '14px', color: ' #1A2243', width: '350px' }}>对于总部有该岗位的员工，可以统计全公司所有营业部客户的基金投顾业绩数据；对于分公司有【基金投顾管理岗】【营业部负责人】【营业部CRM管理员】【所有客户】【财富负责人】角色权限人员，可以统计分公司（包含下级营业部）客户的基金投顾业绩数据；对于营业部有【基金投顾管理岗】【营业部负责人】【营业部CRM管理员】【所有客户】【财富负责人】角色权限人员，可以统计营业部（包含下级营业部）客户的基金投顾业绩数据</div>}><Icon type="question-circle" style={{ color: gxType === 4 ? '#244FFF' : '#959CBA', marginLeft: '2px' }} /></Popover></span>
            {/* <span className={`${styles.tjIndex} ${gxType === 4 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(4)}>自来</span> */}
          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>汇总维度</span>
            <span onClick={() => this.handleStatcDimClick(0)} className={`${styles.tjIndex} ${this.state.statcDim === 0 ? styles.activeIndex : ''}`} style={{ height: 30, marginRight: 8 }}>按营业部</span>
            <span onClick={() => this.handleStatcDimClick(1)} className={`${styles.tjIndex} ${this.state.statcDim === 1 ? styles.activeIndex : ''}`} style={{ height: 30, marginRight: 8 }}>按员工</span>
            <span onClick={() => this.handleStatcDimClick(2)} className={`${styles.tjIndex} ${this.state.statcDim === 2 ? styles.activeIndex : ''}`} style={{ height: 30, marginRight: 8 }}>按客户</span>
          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>统计周期</span>
            <Button onClick={() => { this.handleClick(1); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 1 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>本年</Button>
            <Button onClick={() => { this.handleClick(2); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 2 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>近一年</Button>
            <Button onClick={() => { this.handleClick(3); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 3 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>近一月</Button>
            <Button onClick={() => { this.handleClick(4); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 4 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>本月</Button>
            <Button onClick={() => { this.handleClick(5); this.setState({ tjDateRangePickerVisible: true }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 5 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>自定义</Button>
            {this.state.tjDateRangePickerVisible && (
              <DatePicker.RangePicker
                allowClear={false}
                value={this.state.tjDate}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                style={{ width: '264px' }}
                placeholder={['开始日期', '结束日期']}
                format="YYYY-MM-DD"
                separator='至'
                disabledDate={(current) => current && current > moment().endOf('day')}
                onChange={tjDate => this.setState({ tjDate, tjDateActiveKey: 5 })}
              />
            )}
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
              searchValue={this.state.searchValue}
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
          <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>客户</span>
            <Input style={{ width: 160, height: 30 }} placeholder='姓名/手机号/证件号' value={this.state.staff} onChange={this.staffChange} />
          </Col>
          <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>组合策略</span>
            <MultipleSelect zhcl={this.state.zhcl} zhclChange={this.zhclChange} />
          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 16px 8px 0' }}>
          <div></div>
          {<Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>}
        </div>
        <div style={{ padding: '0 16px', overflow: 'auto' }}>
          <BasicDataTable rowKey='key' loading={this.state.loading} columns={columns} dataSource={dataSource} className={`${styles.table} m-Card-Table`} pagination={false} scroll={{ x: 2080 }} />
          <div style={{ float: 'right', margin: '16px 0 0 0' }}>
            <Pagination
              size='small'
              showLessItems
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              className={`${styles.pagination} ${styles.smallPagination}`}
              showTotal={(total) => <div style={{ fontSize: 14 }}>{`总共${total}条`}</div>}
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
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(SalesPerformance);