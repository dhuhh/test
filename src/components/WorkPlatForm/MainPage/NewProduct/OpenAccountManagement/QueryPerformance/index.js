import React, { Component } from 'react';
import { Button, Col, DatePicker, Icon, Input, message, Modal, Pagination, Progress, Row, Select, Table, Tooltip, Checkbox, TreeSelect } from 'antd';
import { connect } from 'dva';
import { history, Link } from 'umi';
import moment from 'moment';
import lodash from 'lodash';
import Scrollbars from 'react-custom-scrollbars';
import { EncryptBase64 } from '$common/Encrypt';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import SingleSelect from '../Common/SingleSelect';
import { GetAchievementAnalysis, GetChannelCustList, GetBankCodeList, QueryChannelAuthorityDepartment } from '$services/newProduct';
import config from '$utils/config';
import FilterDropdown from '../../../../../Biz/NewProduct/FilterDropdown';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less';

const { api, prefix } = config;
const {
  newProduct: {
    getAchievementAnalysisExport,
    getChannelCustListExport,
  } } = api;

class QueryPerformance extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    khDateActiveKey: 1, // 开户时间周期选择项
    tjDateActiveKey: 1, // 统计时间周期选择项
    channelValue: [], // 渠道
    groupValue: [], // 小组
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    department: undefined, // 营业部
    bank: [], // 存管银行
    applSc: '', // 场景
    khDate: [moment().startOf('year'), moment()], // 开户时间周期
    tjDate: [moment().startOf('year'), moment()], // 统计时间周期
    khDateRangePickerVisible: false,
    tjDateRangePickerVisible: false,
    statcDim: 1, // 汇总维度 1|渠道小组 2|渠道 
    current: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    sort: '',
    modalSort: 'acctDt desc',
    filter: [],
    stepData: [],
    stepList: [],
    dataSource: [],
    dataSourceCount: {}, // 合计
    tempRecord: {}, // 点击行数据
    visible: false,
    successCus: true, // 是否点击成功开户客户
    height: document.body.offsetHeight < 680 ? document.body.offsetHeight - 180 : 500,
    modalDate: [moment().startOf('year'), moment()],
    modalCurrent: 1,
    modalPageSize: 20,
    modalTotal: 0,
    modalLoading: false,
    modalDataSource: [],
    modalVisible: false,
    percent: 0,
    bankData: [],
    searchValue: '',
    mode: ['month', 'month'],
    codeType: '' , // 二维码类型
    isBank: '', // 银行专属
  };
  filterRef = React.createRef()
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
  // 二维码名称选择
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
        title: '序号',
        key: '序号',
        dataIndex: 'key',
        width: 55,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{Number(text) || ''}</div>,
      },
      {
        title: '二维码类型',
        key: '二维码类型',
        dataIndex: 'grpTp',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '二维码名称',
        key: '二维码名称',
        dataIndex: 'grpNm',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '渠道',
        key: '渠道',
        dataIndex: 'chnlNm',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: "是否银行专属",
        dataIndex: "isBank",
        key: "是否银行专属",
        render: (text,record) => ( record.chnlNm !== '合计' ? text : ''),
        width: 110,
      },
      {
        title: '客户总数',
        key: '客户总数',
        width: 100,
        dataIndex: 'totNum',
        sorter: true,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '未成功开户数',
        key: '未成功开户数',
        width: 115,
        dataIndex: 'failNum',
        render: (text, record) => <div onClick={record.grpSrc === '1' ? () => this.handleModalClick(2, record) : () => { }} style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={record.grpSrc === '1' ? styles.hover : ''}>{text}</div>,
      },
      {
        title: '成功开户数',
        key: '成功开户数',
        width: 116,
        dataIndex: 'sucNum',
        render: (text, record) => <div onClick={record.grpSrc === '1' ? () => this.handleModalClick(1, record) : () => { }} style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={record.grpSrc === '1' ? styles.hover : ''}>{text}</div>,
      },
      {
        title: '开户成功率',
        key: '开户成功率',
        width: 116,
        dataIndex: 'sucRto',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '有效户数',
        key: '有效户数',
        width: 116,
        dataIndex: 'vldCustNum',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: '有效户率',
        key: '有效户率',
        width: 80,
        dataIndex: 'vldCustRto',
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
        dataIndex: 'medRich',
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
        dataIndex: 'talAssts',
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
        dataIndex: 'netInflow',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>累计交易量</span>
            <Tooltip title='客户开户之后全账户交易量，含普通账户交易（含港股通、新三板）、信用账户交易量（普通交易和信用交易）、期权账户交易量、理财产品交易量等'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '累计交易量',
        dataIndex: 'trasconNum',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>股基净佣金</span>
            <Tooltip title='场内普通账户股票和基金的买卖净佣金，不含港股通、新三板、期权等交易佣金，不含场内场外认申赎手续费。'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '股基净佣金',
        dataIndex: 'brokerage',
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>投顾产品当前签约量</span>
            <Tooltip title='投顾产品包括免费的产品，当前签约状态去除到期、退订状态，只保留签约中状态，更新频率为每天更新T-1数据。'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '投顾产品当前签约量',
        dataIndex: 'inAdProductNum',
        width: 180,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>累计总贡献</span>
            <Tooltip title='客户开户以来全账户贡献，含普通账户净佣金、普通账户利差收入、信用账户净佣金（普通交易和信用交易）、信用账户息费收入、期权账户净佣金、理财产品手续费等'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        key: '累计总贡献',
        dataIndex: 'dedication',
        fixed: 'right',
        width: 130,
        render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      },
    ];
    return columns;
  }

  getModalColumns = () => {
    let columns = [];
    if (this.state.successCus) {
      columns = [
        {
          title: '序号',
          key: '序号',
          dataIndex: 'key',
          width: 55,
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '客户',
          key: '客户',
          dataIndex: 'custNo',
          render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custNo}`} target='_blank'><div style={{ wordBreak: 'break-all', whiteSpace: 'normal', color: '#244FFF', cursor: 'pointer' }}>{record.custNm}({record.custNo})</div></Link>,
        },
        {
          title: '开户营业部',
          key: '开户营业部',
          dataIndex: 'acctDept',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '渠道',
          key: '渠道',
          dataIndex: 'chnlNm',
          render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '二维码名称',
          key: '二维码名称',
          dataIndex: 'grpNm',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '开户日期',
          key: '开户日期',
          dataIndex: 'acctDt',
          defaultSortOrder: 'descend',
          sorter: true,
          render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{moment(text).format('YYYY-MM-DD')}</div>,
        },
        {
          title: '有效户',
          key: '有效户',
          dataIndex: 'isVldCust',
          filterDropdown: ({ confirm }) => (
            <FilterDropdown
              confirm={confirm}
              type={'1'}
              selectData={[{ ibm: 1, note: '是' }, { ibm: 2, note: '否' }]}
              value={this.state.filter}
              onChange={(data) => { this.setState({ filter: data.value, modalCurrent: 1 }, () => { this.fetchModalData(); }); }}
            />
          ),
          filtered: this.state.filter?.length,
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: (
            <div>
              <span style={{ paddingRight: 5 }}>中端富裕客户数</span>
              <Tooltip title='净资产（剔除负债）达到30万（含）的客户'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
            </div>
          ),
          key: '中端富裕客户',
          dataIndex: 'ismedRich',
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
          dataIndex: 'talAssts',
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
          dataIndex: 'netInflow',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: (
            <div>
              <span style={{ paddingRight: 5 }}>交易量</span>
              <Tooltip title='客户开户之后全账户交易量，含普通账户交易（含港股通、新三板）、信用账户交易量（普通交易和信用交易）、期权账户交易量、理财产品交易量等'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
            </div>
          ),
          key: '交易量',
          dataIndex: 'trasconNum',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: (
            <div>
              <span style={{ paddingRight: 5 }}>股基净佣金</span>
              <Tooltip title='场内普通账户股票和基金的买卖净佣金，不含港股通、新三板、期权等交易佣金，不含场内场外认申赎手续费。'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
            </div>
          ),
          key: '股基净佣金',
          dataIndex: 'brokerage',
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
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
      ];
    } else {
      columns = [
        {
          title: '序号',
          key: '序号',
          dataIndex: 'key',
          width: 55,
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '渠道',
          key: '渠道',
          dataIndex: 'chnlNm',
          render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '二维码名称',
          key: '二维码名称',
          dataIndex: 'grpNm',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '手机',
          key: '手机',
          dataIndex: 'custPhn',
          render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.hover} onClick={() => window.open(`/#${prefix}/single/incidentialServices/customerBreak/${EncryptBase64(JSON.stringify({ custNo: record.mintcustId }))}`)}>{text}</div>,
        },
        {
          title: '客户姓名',
          key: '客户姓名',
          dataIndex: 'custNm',
          render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '开户营业部',
          key: '开户营业部',
          dataIndex: 'acctDept',
          render: (text, record) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '中断步骤',
          key: '中断步骤',
          dataIndex: 'intrptStep',
          // filterDropdown: ({ confirm }) => (
          //   <FilterDropdown
          //     ref={this.filterRef}
          //     confirm={confirm}
          //     symbolDataSource={this.state.stepData?.map(item => item.note)}
          //     fetchData={this.fetchModalData}
          //     setCurrent={() => {
          //       this.setState({
          //         modalCurrent: 1,
          //       });
          //     }}
          //     setStepList={(stepList) => { this.setState({ stepList }); }}
          //   />
          // ),
          filterDropdown: ({ confirm }) => (
            <FilterDropdown
              confirm={confirm}
              type={'1'}
              dictKey={'INTCUS_STP'}
              value={this.state.stepList}
              onChange={(data) => { this.setState({ stepList: data.value, modalCurrent: 1 }, () => { this.fetchModalData(); }); }}
            />
          ),
          filtered: this.state.stepList?.length,
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '中断时间',
          key: '中断时间',
          dataIndex: 'intrptTm',
          sorter: true,
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{lodash.get(text.split(' '), '[0]', '')}<br />{lodash.get(text.split(' '), '[1]', '')}</div>,
        },
        {
          title: '开户时间',
          key: '开户时间',
          dataIndex: 'acctTm',
          defaultSortOrder: 'descend',
          sorter: true,
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{lodash.get(text.split(' '), '[0]', '')}<br />{lodash.get(text.split(' '), '[1]', '')}</div>,
        },
        {
          title: '场景',
          key: '场景',
          dataIndex: 'acctSc',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '推荐人名称',
          key: '推荐人名称',
          dataIndex: 'rcmdrNm',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
        {
          title: '推荐人ID',
          key: '推荐人ID',
          dataIndex: 'rcmdrNo',
          render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
        },
      ];
    }
    // if (this.state.successCus) {
    //   if (this.state.statcDim === 1 && columns.length === 12) {
    //     columns.splice(4, 0, {
    //       title: '渠道小组',
    //       key: '渠道小组',
    //       dataIndex: 'grpNm',
    //       render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    //     });
    //   } else if (this.state.statcDim === 2 && columns.length === 13) {
    //     columns.splice(4, 1);
    //   }
    // } else {
    //   if (this.state.statcDim === 1 && columns.length === 11) {
    //     columns.splice(2, 0, {
    //       title: '渠道小组',
    //       key: '渠道小组',
    //       dataIndex: 'grpNm',
    //       render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    //     });
    //   } else if (this.state.statcDim === 2 && columns.length === 12) {
    //     columns.splice(2, 1);
    //   }
    // }
    return columns;
  }

  // 分页器
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };

  handleModalPageChange = (modalCurrent, modalPageSize) => {
    this.setState({ modalCurrent, modalPageSize }, () => this.fetchModalData());
  }

  // 点击行
  handleModalClick = (srcId, record) => {
    this.setState({ successCus: srcId === 1 ? true : false, tempRecord: record, modalDate: this.state.tjDate, stepData: [...this.props.dictionary['INTCUS_STP']].sort((a, b) => a.ibm - b.ibm), modalSort: srcId === 1 ? 'acctDt desc' : 'acctTm desc', filter: [], stepList: [] }, () => {
      this.setState({ visible: true, modalCurrent: 1, modalPageSize: 20 });
      this.fetchModalData();
    });
  }

  fetchModalData = () => {
    this.setState({ modalLoading: true });
    const param = {
      accon: {
        "acctDept": this.state.department || '',
        applSc: this.state.applSc || '',
        "bgnDt": Number(this.state.khDate[0].format('YYYYMMDD')),
        "chnlId": `${this.state.tempRecord.chnlCode}` || '',
        "depBank": this.state.bank.join(','),
        "endDt": Number(this.state.khDate[1].format('YYYYMMDD')),
        "grpId": `${this.state.tempRecord.grpCode}` || '',
        srcId: this.state.successCus ? 1 : 2,
        'isVldCust': this.state.filter.length === 1 ? this.state.filter[0] : undefined,
        'intrptStep': this.state.stepList.join(','),
        'grpTp': `${this.state.tempRecord.grpTp}` * 1 || 0,
      },
      "cycle": {
        "bgnDt": Number(this.state.modalDate[0].format('YYYYMM')),
        "endDt": Number(this.state.modalDate[1].format('YYYYMM')),
      },
      "current": this.state.modalCurrent,
      "pageSize": this.state.modalPageSize,
      "paging": 1,
      "sort": this.state.modalSort,
      "total": -1,
    };
    GetChannelCustList(param).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({ modalDataSource: records, modalTotal: total, modalLoading: false });
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }

  // 查询表格
  fetchData = () => {
    this.setState({ loading: true });
    const param = {
      accon: {
        "acctDept": this.state.department || '',
        applSc: this.state.applSc || '',
        "bgnDt": Number(this.state.khDate[0].format('YYYYMMDD')),
        "chnlId": (this.state.channelValue || []).join(','),
        "depBank": this.state.bank.join(','),
        "endDt": Number(this.state.khDate[1].format('YYYYMMDD')),
        "grpId": (this.state.groupValue || []).join(','),
        'grpTp': this.state.codeType * 1 ,
        'isBank': this.state.isBank,
      },
      "cycle": {
        "bgnDt": Number(this.state.tjDate[0].format('YYYYMM')),
        "endDt": Number(this.state.tjDate[1].format('YYYYMM')),
        "statcDim": this.state.statcDim, // 默认是渠道小组 1 
      },
      "current": this.state.current,
      "pageSize": this.state.pageSize,
      "paging": 1,
      "sort": this.state.sort,
      "total": -1,
    };
    GetAchievementAnalysis(param).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({ dataSource: records, total, loading: false, dataSourceCount: res });
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
      groupValue: [], // 二维码名称
      department: undefined, // 营业部
      searchValue: "",
      bank: [], // 存管银行
      applSc: "", // 场景
      khDate: [moment().startOf("year"), moment()], // 开户时间周期
      tjDate: [moment().startOf("year"), moment()], // 统计时间周期
      statcDim: 1, // 汇总维度 1|渠道小组 2|渠道
      khDateRangePickerVisible: false,
      tjDateRangePickerVisible: false,
      codeType: "", // 二维码类型
      isBank: "",
    });
  }

  handleInputChange = (e) => {
    const value = e.target.value;
    if ((Number(value) >= 1 && Number(value) <= 99 && !`${value}`.includes('.')) || `${value}` === '') {
      this.setState({ applSc: value });
    }
  }

  // falg: 1|外面列表导出 2|Modal列表导出
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = flag === 1 ? getAchievementAnalysisExport : getChannelCustListExport;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = flag === 1 ? this.state.total : this.state.modalTotal;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let columns = flag === 1 ? _this.getColumns() : _this.getModalColumns();
        columns.shift();
        let tableHeaderCodes = columns.map(item => item.dataIndex);
        let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key);
        if (flag === 2 && columns[0].dataIndex === 'custNo') {
          tableHeaderCodes.splice(0, 1, 'custNm', 'custNo');
          headerInfo.splice(0, 1, '客户名', '客户号');
        }
        tableHeaderCodes = tableHeaderCodes.join(',');
        headerInfo = headerInfo.join(',');
        let getAchievementAnalysisModel = flag === 1 ? {
          accon: {
            "acctDept": _this.state.department || '',
            applSc: _this.state.applSc || '',
            "bgnDt": Number(_this.state.khDate[0].format('YYYYMMDD')),
            "chnlId": (_this.state.channelValue || []).join(','),
            "depBank": _this.state.bank.join(','),
            "endDt": Number(_this.state.khDate[1].format('YYYYMMDD')),
            "grpId": (_this.state.groupValue || []).join(','),
            'grpTp': _this.state.codeType * 1 ,
            'isBank': _this.state.isBank,
          },
          "cycle": {
            "bgnDt": Number(_this.state.tjDate[0].format('YYYYMM')),
            "endDt": Number(_this.state.tjDate[1].format('YYYYMM')),
            "statcDim": _this.state.statcDim,
          },
        } : {
          accon: {
            "acctDept": _this.state.department || '',
            applSc: _this.state.applSc || '',
            "bgnDt": Number(_this.state.khDate[0].format('YYYYMMDD')),
            "chnlId": `${_this.state.tempRecord.chnlCode}` || '',
            "depBank": _this.state.bank.join(','),
            "endDt": Number(_this.state.khDate[1].format('YYYYMMDD')),
            "grpId": `${_this.state.tempRecord.grpCode}` || '',
            srcId: _this.state.successCus ? 1 : 2,
            'isVldCust': _this.state.filter.length === 1 ? _this.state.filter[0] : undefined,
            'intrptStep': _this.state.stepList.join(','),
            'grpTp': `${_this.state.tempRecord.grpTp}` * 1 || 0 ,
          },
          "cycle": {
            "bgnDt": Number(_this.state.modalDate[0].format('YYYYMM')),
            "endDt": Number(_this.state.modalDate[1].format('YYYYMM')),
          },
          "sort": _this.state.modalSort,
        };
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          getAchievementAnalysisModel,
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

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYyb = [] } = this.state;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
  }

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.state;
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
  handleModalChange = (modalDate, mode) => {
    this.setState({
      modalDate,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    }, () => this.fetchModalData());
  };
  handleTableChange = (pagination, filters, sorter) => {
    let param = '';
    if (sorter.order) {
      let order = sorter.order === 'ascend' ? 'asc' : 'desc';
      param = sorter.field + " " + order;
    }
    this.setState({
      sort: param,
    }, () => {
      this.fetchData();
    });
  }
  handleModalTableChange = (pagination, filters, sorter) => {
    let param = '';
    if (sorter.order) {
      let order = sorter.order === 'ascend' ? 'asc' : 'desc';
      param = sorter.field + " " + order;
    }
    this.setState({
      modalSort: param,
    }, () => {
      this.fetchModalData();
    });
  }
  codeChange = (value) => {
    this.setState({
      codeType: value,
    });
  }
  bankChange = (value)=>{
    this.setState({
      isBank: value,
    });
  }

  render() {
    const { dataSource = [], current, pageSize, modalDataSource = [], modalCurrent, modalPageSize, dataSourceCount = {}, bank, bankData, mode, channelVisible, groupVisible , codeType } = this.state;
    const { dictionary } = this.props;
    const groupTypeInfo = dictionary['CHNL_EWMLX'] || [];

    dataSource.forEach((item, index) => {
      if (item.key !== 'total') {
        item['key'] = ((current - 1) * pageSize) + index + 1;
      }
    });
    let item = {};
    item['key'] = 'total';
    item['totNum'] = dataSourceCount.totNumSum || 0;
    item['failNum'] = dataSourceCount.failNumSum || 0;
    item['sucNum'] = dataSourceCount.sucNumSum || 0;
    item['sucRto'] = dataSourceCount.sucRtoSum || 0;
    item['vldCustNum'] = dataSourceCount.vldCustNumSum || 0;
    item['vldCustRto'] = dataSourceCount.vldCustRtoSum || 0;
    item['medRich'] = dataSourceCount.medRichSum || 0;
    item['talAssts'] = dataSourceCount.talAsstsSum || 0;
    item['netInflow'] = dataSourceCount.netInflowSum || 0;
    item['trasconNum'] = dataSourceCount.trasconNumSum || 0;
    item['brokerage'] = dataSourceCount.brokerageSum || 0;
    item['inAdProductNum'] = dataSourceCount.inAdProductSum || 0;
    item['dedication'] = dataSourceCount.dedicationSum || 0;
    item['chnlNm'] = '合计';

    if (dataSource.find(item => item.key === 'total')) {
      dataSource.pop();
      dataSource.push(item);
    } else {
      dataSource.push(item);
    }
    modalDataSource.forEach((item, index) => {
      item['key'] = ((modalCurrent - 1) * modalPageSize) + index + 1;
    });
    const columns = this.getColumns() || [];
    columns.forEach((item, index) => {
      const render = item.render;
      item.render = (text, record) => {
        if (!record.key) {
          return <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} >{text}</div>;
        } else {
          return render(text, record);
        }
      };
    });
    const modalColumns = this.getModalColumns() || [];
    return (
      <div style={{ fontSize: 14, color: '#1A2243', background: '#FFF', overflow: 'auto' }} onClick={() => this.setState({ channelVisible: false, groupVisible: false })}>
        <Row style={{ display: 'flex', flexWrap: 'wrap', margin: '12px 0 12px 16px' }} className={styles.searchContent}>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>开户时间</span>
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
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }}>
            <span style={{ marginRight: 8 }}>二维码类型</span>
            <SingleSelect selectChange={this.codeChange} selectValue={codeType}/>
          </Col>
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>开户营业部</span>
            <TreeSelect
              showSearch
              className={styles.treeSelect}
              style={{ width: '200px' }}
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
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ channelVisible: true, groupVisible: false }); }}>
            <span style={{ marginRight: 8 }}>渠道</span>
            <MultipleSearchInput channelValue={this.state.channelValue} channelChange={this.channelChange} source='query' visible={channelVisible} />
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }} onClick={e => { e.stopPropagation(); this.setState({ groupVisible: true, channelVisible: false }); }}>
            <span style={{ marginRight: 8 }}>二维码名称</span>
            <MultipleSearchInput channelValue={this.state.groupValue} channelChange={this.groupChange} api='GetGroupInfoModel' source='query' visible={groupVisible} />
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
          <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }}>
            <span style={{ marginRight: 8 }}>场景</span>
            <Input value={this.state.applSc} onChange={this.handleInputChange} type='number' min={1} max={99} style={{ width: 200, height: 30 }} placeholder='场景1-99' />
          </Col>
          <Col style={{ margin: '8px 35px 8px 0' }}>
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
          {
            this.state.codeType === '3' && ( 
              <Col style={{ display: 'flex', alignItems: 'center', margin: '8px 35px 8px 0' }}>
                <span style={{ marginRight: 8 }}>是否银行专属</span>
                <Select
                  style={{ width: '160px' }}
                  // value={this.state.isBank}
                  allowClear
                  onChange={this.bankChange}
                  defaultActiveFirstOption={false}
                  className={styles.selectHeight}
                >
                  <Select.Option key='1' value='1'>是</Select.Option>
                  <Select.Option key='2' value='2'>否</Select.Option>
                </Select >
              </Col>
            )
          }

          {/* <Col style={{ margin: '8px 35px 8px 0' }}>
            <span style={{ marginRight: 8 }}>汇总维度</span>
            <Button onClick={() => this.handleStatcDimClick(1)} className={`${styles.button} ${this.state.statcDim === 1 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>按渠道小组</Button>
            <Button onClick={() => this.handleStatcDimClick(2)} className={`${styles.button} ${this.state.statcDim === 2 ? styles.activeButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>按渠道</Button>
          </Col> */}
          <Col style={{ margin: '8px 35px 8px 0', display: 'flex' }}>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.setState({ current: 1 }, () => { this.fetchData(); })}>查询</Button>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 16px 8px 0' }}>
          <div></div>
          {this.props.authorities.queryPerformance?.indexOf('export') > -1 ? <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export(1)}>导出</Button> : ""}
        </div>
        <div style={{ padding: '0 16px', overflow: 'auto' }}>
          <Table rowKey='key' loading={this.state.loading} columns={columns} bordered dataSource={dataSource} className={`m-table-customer m-Card-Table ${styles.borderTable} ${styles.totalRow}`} pagination={false} scroll={{ x: 2200 }} onChange={this.handleTableChange} />
          <div style={{ float: 'right', margin: '16px 0 0 0' }}>
            <Pagination
              size='small'
              showLessItems
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['20', '50', '100', '200']}
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
            <span style={{ fontSize: 16, marginRight: 24 }}>{this.state.successCus ? '成功开户客户' : '未成功开户客户'}</span>
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
            {this.state.successCus && (
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
            )}
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
                <Table rowKey='key' loading={this.state.modalLoading} columns={modalColumns} dataSource={modalDataSource} className={`m-table-customer ${styles.table}`} pagination={false} scroll={{ x: 1700, y: modalDataSource.length > 0 ? this.state.height - 106 : 0 }} onChange={this.handleModalTableChange} />
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
  dictionary: global.dictionary,
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(QueryPerformance);
