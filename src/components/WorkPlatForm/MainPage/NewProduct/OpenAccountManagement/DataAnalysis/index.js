import React, { Component } from 'react';
import { Button, Col, DatePicker, Icon, Input, message, Modal, Pagination, Progress, Row, Select, Table, Tooltip, Checkbox, TreeSelect, Spin, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import BasicDataTable from '$common/BasicDataTable';
import lodash, { initial, map } from 'lodash';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import { GetAllAccountDate, GetBankCodeList, QueryChannelAuthorityDepartment, QueryStaffTips, GetAllAccountDatePop } from '$services/newProduct';
import { FetchExcStaffList } from '../../../../../../services/incidentialServices';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less';
import config from '$utils/config';
const { Option } = Select;

const { api } = config;
const {
  newProduct: {
    getAllAccountDateExport,
    getAllAccountDatePopExport,
  } } = api;


class DataAnalysis extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    khDateActiveKey: 1, // 开户时间周期选择项
    tjDateActiveKey: 1, // 统计时间周期选择项
    channelValue: [], // 渠道
    groupValue: [], // 二维码名称 |（渠道小组）
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    department: undefined, // 营业部
    bank: [], // 存管银行
    applSc: '', // 场景
    khDate: [moment().startOf('year'), moment()], // 开户时间周期
    tjDate: [moment().startOf('year'), moment()], // 统计时间周期
    khDateRangePickerVisible: false,
    tjDateRangePickerVisible: false,
    statcDim: 1, // 汇总维度 1|营业部 2|员工 3|存管银行
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    dataSource: [],
    dataSourceCount: {}, // 合计
    height: document.body.offsetHeight < 680 ? document.body.offsetHeight - 180 : 500,
    modalVisible: false,
    percent: 0,
    bankData: [],
    searchValue: '',
    mode: ['month', 'month'],
    gxType: '1',
    gxType_Copy: 1,
    ygTotal: 0,
    ygCurrent: 1,
    ygLoading: false,
    administratorData: [],
    listData: [],
    searchMemberValue: '',
    showDim: 1,//查询后展示的维度
    visible: false,
    tempRecord: {},
    modalDate: [moment().startOf('year'), moment()],
    modalCurrent: 1,
    modalPageSize: 20,
    modalTotal: 0,
    modalLoading: false,
    modalDataSource: [],
    customerTypes: [
      { ibm: '1',note: '渠道' },
      { ibm: '2',note: '员工' },
      { ibm: '3',note: '经纪人' },
      { ibm: '4',note: '自来' },
      { ibm: '5',note: '营业部合作小组' },
    ],
  };

  componentDidMount() {
    this.getBankCodeList();
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

  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
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

  // 渠道选择
  channelChange = (value) => {
    this.setState({
      channelValue: value,
    });
  }
  getBankCodeList = () => {
    GetBankCodeList().then(res => {
      this.setState({
        bankData: res.records,
      });
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

  // 点击时间周期按钮
  handleClick = (activeKey, type) => {
    const map = {
      1: [moment().startOf('year'), moment()],
      2: [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')],
      3: [moment().startOf('month'), moment()],
      4: [moment().subtract(1, 'years'), moment()],
    };
    if (type === 'khDate') {
      this.setState({ khDateActiveKey: activeKey, khDate: map[activeKey] });
    } else {
      this.setState({ tjDateActiveKey: activeKey, tjDate: map[activeKey] });
    }
  }

  // 点击维度按钮
  handleStatcDimClick = (activeKey) => {
    this.setState({ statcDim: activeKey });
  }

  // 获取columns
  getColumns = () => {
    let columns = [
      {
        title: '排名',
        key: '排名',
        dataIndex: 'key',
        width: 55,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{Number(text) || ''}</div>,
      },
      {
        title: '客户总数',
        key: '客户总数',
        width: 100,
        dataIndex: 'tolNum',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '未成功开户数',
        key: '未成功开户数',
        width: 115,
        dataIndex: 'failOpen',
      },
      {
        title: '成功开户数',
        key: '成功开户数',
        width: 116,
        dataIndex: 'sucOpen',
        render: (text, record) => (
          record.key === 'total' ? text : (
            <div onClick={() => this.handleModalClick(record)} style={{
              cursor: 'pointer',
              color: '#244fff',
            }}>{text}</div>
          )
        ),
      },
      {
        title: '开户成功率',
        key: '开户成功率',
        width: 116,
        dataIndex: 'sucOpenRatio',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '有效户数',
        key: '有效户数',
        width: 116,
        dataIndex: 'vailCus',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '有效户率',
        key: '有效户率',
        width: 80,
        dataIndex: 'vailCusRatio',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>中端富裕客户数</span>
            <Tooltip title='净资产（剔除负债）达到30万（含）的客户'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '中端富裕客户数',
        dataIndex: 'mediaRich',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>当前总资产</span>
            <Tooltip title='客户上一交易日全账户资产，含普通账户资产（含港股通）、信用账户资产（含信用负债）、期权资产、理财市值等'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '当前总资产',
        dataIndex: 'tolAssets',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>资产净流入数</span>
            <Tooltip title='普通账户、信用账户、期权账户转入转出资金轧差+转入证券转出证券轧差'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '资产净流入数',
        dataIndex: 'netInFlow',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>总交易量</span>
            <Tooltip title='客户开户之后全账户交易量，含普通账户交易（含港股通、新三板）、信用账户交易量（普通交易和信用交易）、期权账户交易量、理财产品交易量等'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '总交易量',
        dataIndex: 'tolBus',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>总贡献</span>
            <Tooltip title='客户开户以来全账户贡献，含普通账户净佣金、普通账户利差收入、信用账户净佣金（普通交易和信用交易）、信用账户息费收入、期权账户净佣金、理财产品手续费等'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '总贡献',
        dataIndex: 'dedication',
        fixed: 'right',
        width: 130,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
    ];
    if (this.state.showDim === 1) {
      columns.splice(1, 0,
        {
          title: '营业部',
          key: '营业部',
          dataIndex: 'dept',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        });
    } else if (this.state.showDim === 2) {
      columns.splice(1, 0,
        {
          title: '营业部',
          key: '营业部',
          dataIndex: 'dept',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '员工',
          key: '员工',
          dataIndex: 'staff',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        });
    } else if (this.state.showDim === 3) {
      columns.splice(1, 0,
        {
          title: '存管银行',
          key: '存管银行',
          dataIndex: 'bank',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        });
    }
    return columns;
  }
  handleModalClick = (record) => {
    this.setState({ tempRecord: record, modalDate: this.state.tjDate }, () => {
      this.setState({ visible: true });
      this.fetchModalData();
    });
  }
  fetchModalData = () => {
    this.setState({ modalLoading: true });
    const param = {
      pageSize: this.state.modalPageSize,
      current: this.state.modalCurrent,
      beginDate: this.state.modalDate[0]?.format('YYYYMM'),
      endDate: this.state.modalDate[1]?.format('YYYYMM'),
      openBDate: this.state.khDate[0]?.format('YYYYMMDD'),
      openEDate: this.state.khDate[1]?.format('YYYYMMDD'),
      totalType: this.state.showDim,
      kindType: this.state.gxType_Copy,
      channelCode: this.state.channelValue.join(','),
      channelGroup: this.state.groupValue.join(','),
      staffId: this.state.showDim === 2 ? this.state.tempRecord.staffId : this.state.listData.map(item => item.split('/')[0]).join(','),
      scene: this.state.scene,
      dept: this.state.showDim === 1 ? this.state.tempRecord.deptId : this.state.department,
      bank: this.state.showDim === 3 ? this.state.tempRecord.bankId : this.state.bank.join(','),
    };
    GetAllAccountDatePop(param).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({ modalDataSource: records, modalTotal: total, modalLoading: false });
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }
  getmodalColumns = () => [
    {
      title: '序号',
      key: '序号',
      dataIndex: 'key',
      width: 55,
      render: (text, record, index) => `${(this.state.modalCurrent - 1) * this.state.modalPageSize + index + 1}`,
    },
    {
      title: '分支机构',
      key: '分支机构',
      dataIndex: 'branch',
    },
    {
      title: '开户营业部',
      key: '开户营业部',
      dataIndex: 'dept',
    },
    {
      title: '客户姓名',
      key: '客户姓名',
      dataIndex: 'user',
    },
    {
      title: '客户号',
      key: '客户号',
      dataIndex: 'userId',
    },
    {
      title: '客户手机',
      key: '客户手机',
      dataIndex: 'phone',
    },
    {
      title: '开户日期',
      key: '开户日期',
      dataIndex: 'date',
    },
    {
      title: '渠道',
      key: '渠道',
      dataIndex: 'channel',
    },
    {
      title: '二维码名称',
      key: '二维码名称',
      dataIndex: 'channelGrp',
    },
    {
      title: '开户场景',
      key: '开户场景',
      dataIndex: 'scene',
    },
    {
      title: '推荐人ID',
      key: '推荐人ID',
      dataIndex: 'staffId',
    },
    {
      title: '推荐人姓名',
      key: '推进人姓名',
      dataIndex: 'staff',
    },
    {
      title: '存管银行',
      key: '存管银行',
      dataIndex: 'bank',
    },
  ]
  handleModalChange = (modalDate, mode) => {
    this.setState({
      modalDate,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    }, () => this.fetchModalData());
  };
  handleModalPageChange = (modalCurrent, modalPageSize) => {
    this.setState({ modalCurrent, modalPageSize }, () => this.fetchModalData());
  }
  // 分页器
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };



  // 查询表格
  fetchData = () => {
    this.setState({ loading: true });
    GetAllAccountDate({
      pageSize: this.state.pageSize,
      current: this.state.current,
      beginDate: this.state.tjDate[0]?.format('YYYYMM'),
      endDate: this.state.tjDate[1]?.format('YYYYMM'),
      openBDate: this.state.khDate[0]?.format('YYYYMMDD'),
      openEDate: this.state.khDate[1]?.format('YYYYMMDD'),
      totalType: this.state.statcDim,
      kindType: this.state.gxType,
      channelCode: this.state.channelValue.join(','),
      channelGroup: this.state.groupValue.join(','),
      staffId: this.state.listData.map(item => item.split('/')[0]).join(','),
      scene: this.state.scene,
      dept: this.state.department,
      bank: this.state.bank.join(','),
    }).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({ dataSource: records, total, loading: false, dataSourceCount: res, showDim: this.state.statcDim, gxType_Copy: this.state.gxType });
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }

  // 重置
  reset = () => {
    this.setState({
      khDateActiveKey: 1, // 开户时间周期选择项
      tjDateActiveKey: 1, // 统计时间周期选择项
      channelValue: [], // 渠道
      groupValue: [], // 小组
      department: undefined, // 营业部
      searchValue: '',
      bank: [], // 存管银行
      applSc: '', // 场景
      khDate: [moment().startOf('year'), moment()], // 开户时间周期
      tjDate: [moment().startOf('year'), moment()], // 统计时间周期
      statcDim: 1, // 汇总维度 1|营业部 2|员工 3|存管银行
      gxType: '1',
      listData: [],//推荐人
      khDateRangePickerVisible: false,
      tjDateRangePickerVisible: false,
    });
  }

  handleInputChange = (e) => {
    const value = e.target.value;
    if ((Number(value) >= 1 && Number(value) <= 99 && !`${value}`.includes('.')) || `${value}` === '') {
      this.setState({ applSc: value });
    }
  }

  // falg: 1|外面列表导出
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = flag !== 2 ? getAllAccountDateExport : getAllAccountDatePopExport;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = flag !== 2 ? this.state.total : this.state.modalTotal;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let columns = flag !== 2 ? _this.getColumns() : _this.getmodalColumns();
        columns.shift();
        let tableHeaderCodes = columns.map(item => item.dataIndex);
        let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key);
        tableHeaderCodes = tableHeaderCodes.join(',');
        headerInfo = headerInfo.join(',');
        let channelTotalModel = {
          beginDate: _this.state.tjDate[0]?.format('YYYYMM'),
          endDate: _this.state.tjDate[1]?.format('YYYYMM'),
          openBDate: _this.state.khDate[0]?.format('YYYYMMDD'),
          openEDate: _this.state.khDate[1]?.format('YYYYMMDD'),
          totalType: _this.state.statcDim,
          kindType: _this.state.gxType,
          channelCode: _this.state.channelValue.join(','),
          channelGroup: _this.state.groupValue.join(','),
          staffId: _this.state.listData.map(item => item.split('/')[0]).join(','),
          scene: _this.state.scene,
          dept: _this.state.department,
          bank: _this.state.bank.join(','),
        };
        let GetAllAccountDatePopModel = {
          beginDate: _this.state.modalDate[0]?.format('YYYYMM'),
          endDate: _this.state.modalDate[1]?.format('YYYYMM'),
          openBDate: _this.state.khDate[0]?.format('YYYYMMDD'),
          openEDate: _this.state.khDate[1]?.format('YYYYMMDD'),
          totalType: _this.state.showDim,
          kindType: _this.state.gxType,
          channelCode: _this.state.channelValue.join(','),
          channelGroup: _this.state.groupValue.join(','),
          staffId: _this.state.showDim === 2 ? _this.state.tempRecord.staffId : _this.state.listData.map(item => item.split('/')[0]).join(','),
          scene: _this.state.scene,
          dept: _this.state.showDim === 1 ? _this.state.tempRecord.deptId : _this.state.department,
          bank: _this.state.showDim === 3 ? _this.state.tempRecord.bankId : _this.state.bank.join(','),
        };
        let exportPayload = '';
        if (flag !== 2) {
          exportPayload = JSON.stringify({
            tableHeaderCodes,
            headerInfo,
            channelTotalModel,
          });
        } else {
          exportPayload = JSON.stringify({
            tableHeaderCodes,
            headerInfo,
            GetAllAccountDatePopModel,
          });
        }
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
  showTjIndex = (gxType) => {
    this.setState({
      gxType,
    });
  }

  render() {
    const { dataSource = [], current, pageSize, dataSourceCount = {}, bank, bankData, mode, channelVisible, groupVisible, gxType, administratorData, listData, total, ygCurrent, ygTotal, ygLoading, modalDataSource , customerTypes } = this.state;
    dataSource.forEach((item, index) => {
      if (item.key !== 'total') {
        item['key'] = ((current - 1) * pageSize) + index + 1;
      }
    });
    modalDataSource.forEach((item, index) => {
      if (item.key !== 'total') {
        item['key'] = ((current - 1) * pageSize) + index + 1;
      }
    });
    let item = {};
    item['key'] = 'total';
    item['tolNum'] = dataSourceCount.tolNumSum || 0;
    item['failOpen'] = dataSourceCount.failOpenSum || 0;
    item['sucOpen'] = dataSourceCount.sucOpenSum || 0;
    item['sucOpenRatio'] = dataSourceCount.sucOpenRatioSum || 0;
    item['vailCus'] = dataSourceCount.vailCusSum || 0;
    item['vailCusRatio'] = dataSourceCount.vailCusRatioSum || 0;
    item['mediaRich'] = dataSourceCount.mediaRichSum || 0;
    item['tolAssets'] = dataSourceCount.tolAssetsSum || 0;
    item['netInFlow'] = dataSourceCount.netInFlowSum || 0;
    item['tolBus'] = dataSourceCount.tolBusSum || 0;
    item['dedication'] = dataSourceCount.dedicationSum || 0;
    if (this.state.showDim === 1 || this.state.showDim === 2) {
      item['dept'] = '合计';
    } else {
      item['bank'] = '合计';
    }
    if (dataSource.find(item => item.key === 'total')) {
      dataSource.pop();
      dataSource.push(item);
    } else {
      dataSource.push(item);
    }
    const columns = this.getColumns() || [];
    let modalColumns = this.getmodalColumns() || [];
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
            <span style={{ marginRight: 8 }}>查询时间</span>
            <Button onClick={() => { this.handleClick(1, 'khDate'); this.setState({ khDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.khDateActiveKey === 1 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>本年</Button>
            <Button onClick={() => { this.handleClick(2, 'khDate'); this.setState({ khDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.khDateActiveKey === 2 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>上年</Button>
            <Button onClick={() => { this.handleClick(3, 'khDate'); this.setState({ khDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.khDateActiveKey === 3 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>本月</Button>
            <Button onClick={() => { this.handleClick(4, 'khDate'); this.setState({ khDateRangePickerVisible: true }); }} className={`${styles.button} ${this.state.khDateActiveKey === 4 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>自定义</Button>
            {this.state.khDateRangePickerVisible && (
              <DatePicker.RangePicker
                allowClear={false}
                value={this.state.khDate}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                style={{ width: '264px' }}
                placeholder={['开始日期', '结束日期']}
                format="YYYY-MM-DD"
                separator='至'
                disabledDate={(current) => current && current > moment().endOf('day')}
                onChange={khDate => this.setState({ khDate, khDateActiveKey: 4 })}
              />
            )}
          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>客户来源</span>
            {/* <span className={`${styles.tjIndex} ${gxType === 1 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(1)}>渠道</span>
            <span className={`${styles.tjIndex} ${gxType === 2 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(2)}>员工</span>
            <span className={`${styles.tjIndex} ${gxType === 3 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(3)}>经纪人</span>
            <span className={`${styles.tjIndex} ${gxType === 4 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(4)}>自来</span>
            <span className={`${styles.tjIndex} ${gxType === 5 ? styles.activeIndex : ''}`} onClick={() => this.showTjIndex(5)}>营业部合作小组</span> */}

            <Select style={{ width: 160, height: 30 }} className={styles.select} value={gxType} defaultActiveFirstOption={false} onChange={this.showTjIndex}>
              {customerTypes.map(item => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)}
            </Select>

          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>汇总维度</span>
            <span onClick={() => this.handleStatcDimClick(1)} className={`${styles.tjIndex} ${this.state.statcDim === 1 ? styles.activeIndex : ''}`} style={{ height: 30, marginRight: 8 }}>按营业部</span>
            <span onClick={() => this.handleStatcDimClick(3)} className={`${styles.tjIndex} ${this.state.statcDim === 3 ? styles.activeIndex : ''}`} style={{ height: 30, marginRight: 8 }}>按存管银行</span>
            <span onClick={() => this.handleStatcDimClick(2)} className={`${styles.tjIndex} ${this.state.statcDim === 2 ? styles.activeIndex : ''}`} style={{ height: 30, marginRight: 8 }}><span style={{ marginRight: 2 }}>按员工</span><Popover title={<span style={{ fontSize: '14px', color: ' #1A2243' }}>提示</span>} content={<div style={{ fontSize: '14px', color: ' #1A2243' }}>可能会因客户历史开过<br />户而没有建立开发关<br />系，存在数据上差异</div>}><Icon type="question-circle" style={{ color: '#959CBA' }} /></Popover></span>
          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>统计维度</span>
            <Button onClick={() => { this.handleClick(1, 'tjDate'); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 1 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>本年</Button>
            <Button onClick={() => { this.handleClick(2, 'tjDate'); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 2 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>上年</Button>
            <Button onClick={() => { this.handleClick(3, 'tjDate'); this.setState({ tjDateRangePickerVisible: false }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 3 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>本月</Button>
            <Button onClick={() => { this.handleClick(4, 'tjDate'); this.setState({ tjDateRangePickerVisible: true }); }} className={`${styles.button} ${this.state.tjDateActiveKey === 4 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>自定义</Button>
            {this.state.tjDateRangePickerVisible && (
              <DatePicker.RangePicker
                mode={mode}
                allowClear={false}
                value={this.state.tjDate}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                style={{ width: '264px' }}
                placeholder={['开始日期', '结束日期']}
                format="YYYY-MM"
                separator='至'
                disabledDate={(current) => current && current > moment().endOf('day')}
                onChange={tjDate => this.setState({ tjDate, tjDateActiveKey: 4 })}
                onPanelChange={this.handlePanelChange}
              />
            )}
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }}>
            <span style={{ marginRight: 8 }}>存管银行</span>
            <Select
              placeholder='请选择存管银行'
              className={styles.mulSelect}
              showArrow={bank.length === 0}
              allowClear={true}
              mode='multiple'
              defaultActiveFirstOption={false}
              maxTagCount={3}
              maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)
              }
              maxTagTextLength={7}
              menuItemSelectedIcon={e => {
                return bankData.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={bank.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
              }}
              onChange={bank => this.setState({ bank })}
              filterOption={(input, option) => option.props.children.indexOf(input) !== -1}
              value={bank}
              dropdownRender={menu => (
                <div className='m-bss-select-checkbox'>
                  <div className='m-bss-select-dropdown' >{menu}</div>
                </div>
              )}
            >
              {bankData.map(item => <Select.Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Select.Option>)}
            </Select >
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
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }}>
            <span style={{ marginRight: 8 }}>开户场景</span>
            <Input value={this.state.applSc} onChange={this.handleInputChange} type='number' min={1} max={99} style={{ width: 160, height: 30 }} placeholder='场景1-99' />
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ channelVisible: true, groupVisible: false }); }}>
            <span style={{ marginRight: 8 }}>渠道</span>
            <MultipleSearchInput channelValue={this.state.channelValue} channelChange={this.channelChange} source='query' visible={channelVisible} />
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ groupVisible: true, channelVisible: false }); }}>
            <span style={{ marginRight: 8 }}>二维码名称</span>
            <MultipleSearchInput channelValue={this.state.groupValue} channelChange={this.groupChange} api='GetGroupInfoModel' source='query' visible={groupVisible} />
          </Col>
          <Col style={{ margin: '8px 64px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>推荐人</span>
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              <Select
                placeholder='请选择推荐人'
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
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex' }}>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 16px 8px 0' }}>
          <div></div>
          {dataAnalysis?.includes('export') && <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export(1)}>导出</Button>}

        </div>

        <div style={{ padding: '0 16px', overflow: 'auto' }}>
          <Table rowKey='key' loading={this.state.loading} columns={columns} bordered dataSource={dataSource} className={`m-table-customer m-Card-Table ${styles.borderTable} ${styles.totalRow}`} pagination={false} scroll={{ x: 1900 }} />
          <div style={{ float: 'right', margin: '16px 0 0 0' }}>
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
        <div style={{ backgroundColor: '#F2F3F7', height: '70px' }}></div>
        <Modal
          visible={this.state.visible}
          title={<div style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: '#1A2243' }}>
            <span style={{ fontSize: 16, marginRight: 24 }}>成功开户客户</span>
            <span>开户时间：</span>
            <span style={{ marginRight: 36 }}>{(() => {
              if (this.state.khDateActiveKey === 1) {
                return '本年';
              } else if (this.state.khDateActiveKey === 2) {
                return '上年';
              } else if (this.state.khDateActiveKey === 3) {
                return '本月';
              } else if (this.state.khDateActiveKey === 4) {
                return `${this.state.khDate[0].format('YYYY-MM-DD')}至${this.state.khDate[1].format('YYYY-MM-DD')}`;
              }
            })()}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>统计周期</span>
              <DatePicker.RangePicker
                mode={mode}
                allowClear={false}
                value={this.state.modalDate}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                style={{ width: '264px' }}
                placeholder={['开始日期', '结束日期']}
                format="YYYY-MM"
                separator='至'
                disabledDate={(current) => current && current > moment().endOf('day')}
                onChange={modalDate => this.setState({ modalDate }, () => this.fetchModalData())}
                onPanelChange={this.handleModalChange}
              />
            </div>
          </div>}
          footer={null}
          onCancel={() => { this.setState({ visible: false }); }}
          width={document.body.clientWidth > 1300 ? 1200 : document.body.clientWidth - 100}
          bodyStyle={{ padding: 0 }}
          centered
          destroyOnClose
        >
          <div style={{ position: 'relative' }}>
            <Scrollbars autoHide style={{ width: '100%', height: this.state.height }}>
              <Row style={{ padding: '0 16px' }}>
                <Row style={{ overflow: 'hidden', padding: '12px 0' }}>
                  <Button style={{ width: 60, height: 30, float: 'right' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export(2)}>导出</Button>
                </Row>
                <Table rowKey='key' loading={this.state.modalLoading} columns={modalColumns} dataSource={this.state.modalDataSource} className={`m-table-customer ${styles.table}`} pagination={false} scroll={{ x: 1700, y: this.state.modalDataSource.length > 0 ? this.state.height - 106 : 0 }} />
              </Row>
            </Scrollbars>
            <div style={{ height: 44 }}></div>
            <div style={{ padding: '10px 16px', width: '100%', textAlign: 'right', height: 44, position: 'absolute', bottom: '0', right: '0', boxShadow: '0 0 12px 0 rgba(5, 14, 28, 0.12)' }}>
              <Pagination
                size='small'
                showLessItems
                showQuickJumper
                showSizeChanger
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
        </Modal>
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
}))(DataAnalysis);