import React, { Component } from 'react';
import styles from '../index.less';
import SearchContent from '../Common/SearchContent';
import { Link } from 'umi';
import { message , Tooltip , Icon } from 'antd';
import { hongkongStock } from '$services/newProduct';
import BasicDataTable from '$common/BasicDataTable';
import TableBtn from '../Common/TableBtn';


export default class actived extends Component {
  state ={
    tableVisible: false,
    selectAll: false,
    selectedRowKeys: [],
    selectedRows: [],
    md5: '',
    dataSource: [],
    pageSize: 10,
    current: 1,
    total: 0,
    loading: false,

    custRange: 0,
    gudongka:0,
    custRank: [],
    rankVisible: false,
    ktDate: [undefined,undefined],//默认无限制
    isTrade: 0,
    firstDate: [undefined,undefined],
    dept: [],
    deptSearch: '',
    custKind: 0,
    gkRankTop: 0,
    assetsPeak: 0,
    turnoverValue: 0,
    qkImportance: [],
    bussGkbin: [7],
    ggtTradingMin: null,
    ggtTradingMax: null,
    ggtNetCommissionMin: null,
    ggtNetCommissionMax: null,
    tags: [],
    tagsVisible: false,
    custGrup: [],
    custVisible: false,
    qkVisible: false ,
    bussGkVisible: false ,
  }
  newState = this.state
  getParam = ()=>{
    const { 
      custRange,
      gudongka,
      custRank,
      ktDate,//默认无限制
      isTrade,
      firstDate,
      dept,
      deptSearch,
      custKind,
      assetsPeak,
      turnoverValue,
      ggtTradingMin,
      ggtTradingMax,
      ggtNetCommissionMin,
      ggtNetCommissionMax,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.newState;
    return {
      buzState: 1 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      buzOpeningDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (ktDate[0] ? ktDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (ktDate[1] ? ktDate[1].format('YYYYMMDD') : "30000101"),
      },
      isDeal: isTrade,
      firstTimeDealDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (firstDate[0] ? firstDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (firstDate[1] ? firstDate[1].format('YYYYMMDD') : "30000101"),
      },
      departmentList: dept,
      customerType: custKind,
      assetsPeak: assetsPeak,
      dealAmount: turnoverValue,
      hongkongStockTradingAmount: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+ggtTradingMin,
        // "valueTo": ''+ggtTradingMax,
        "valueFrom": ggtTradingMin === null ? '0' : `${ggtTradingMin}`,
        "valueTo": ggtTradingMax === null ? `${Math.pow(2,31)}` : `${ggtTradingMax}`,
      },
      hongkongStockCommissionAmount: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+ggtNetCommissionMin,
        // "valueTo": ''+ggtNetCommissionMax,
        "valueFrom": ggtNetCommissionMin === null ? '0' : `${ggtNetCommissionMin}`,
        "valueTo": ggtNetCommissionMax === null ? `${Math.pow(2,31)}` : `${ggtNetCommissionMax}`,
      },
      "staffTagList": tags.filter(item=>item.split('/')[1] === '3').map(item=>item.split('/')[0]),
      "companyTagList": tags.filter(item=>item.split('/')[1] === '2').map(item=>item.split('/')[0]),
      "activityTagList": tags.filter(item=>item.split('/')[1] === '1').map(item=>item.split('/')[0]),
      customerGroupIdList: custGrup,
      pageNo: 0,
      pageSize: 0,
    } ;
  }
  // 点击时间周期按钮
   handleClick = (value, key) => {
     this.setState({
       [key]: value,
     });
   }
  qkShowTooltip = () =>{
    return (
      <div> 
        <div>1.判断逻辑：“强烈”、“较高”、“一般”三个推荐程度由“潜力模型”打分对应，未纳入评分范围内的已开通未交易客户显示为“较低”，已交易展示推荐程度为空，刚开通未交易未更新展示“暂无”</div>
        <div>2.更新频率：每周日更新一次</div>
        <div>3.潜力模型原理：“潜力模型”针对港股通已开通未交易客户，利用交易、持仓、资产、App浏览等数据因子，利用机器学习模型评估激活客户交易港股通可能性。强烈推荐的客户指模型得分高且仅1个月有App港股通浏览行为，是强烈建议服务的客群，转化率高。</div>
        
      </div>
    );
  }


  gkShowTooltip = () =>{
    return (
      <div> 
        <div>得分客户范围: 港股通首次交易日期为当年,且港股通交易量达到1万元(不满足为0)。</div>
        <div>具体分值:</div>
        <div>①个人: 港股通开通日期为当年之前(1分)  港股通开通日期为当年(2分)</div>
        <div>②机构: 港股通开通日期为当年之前(2分)  港股通开通日期为当年(4分)</div>
      </div>
    );
  }

  getColumns = ()=>{
    return [
      {
        title: '姓名',
        dataIndex: 'customerName',
        key: '姓名',
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.customerNO}`} target='_blank'>{text}</Link>,
      },
      {
        title: '客户号',
        dataIndex: 'customerNO',
        key: '客户号',
      },
      {
        title: '客户级别',
        dataIndex: 'customerLevel',
        key: '客户级别',
      },
      {
        title: '开通时间',
        dataIndex: 'buzOpeningDate',
        key: '开通时间',
      },
      {
        title: '开户营业部',
        dataIndex: 'department',
        key: '开户营业部',
      },
      {
        title: '客户类型',
        dataIndex: 'customerType',
        key: '客户类型',
      },
      {
        title: (<div style={{ display: 'flex',alignItems: 'center'}}>
          <div>
             未交易潜客<br />推荐程度
          </div>
          <div>
            <Tooltip title={this.qkShowTooltip()} overlayStyle={{ minWidth: '400px' }}>
              <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
            </Tooltip>
          </div>
        </div>),
        dataIndex: 'recommendLevel',
        key: '未交易潜客推荐程度',
      },
      {
        title: (<div style={{ display: 'flex',alignItems: 'center'}}>
          <div>是否交易</div>
          <div>
            <Tooltip title={'【含ETF】'}>
              <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
            </Tooltip>
          </div>
        </div>),
        dataIndex: 'isDeal',
        key: '是否交易',
      },
      {
        title: (<div style={{ display: 'flex',alignItems: 'center'}}>
          <div>首次交易时间</div>
          <div>
            <Tooltip title={'【含ETF】'}>
              <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
            </Tooltip>
          </div>
        </div>),
        dataIndex: 'firstTimeDealDate',
        key: '首次交易时间',
      },
      {
        title: (<div>当年月日均港股通<br />市值峰值(含ETF)(元)</div>),
        dataIndex: 'hkMvMonthlyPeak',
        key: '当年月日均港股通市值峰值(含ETF)(元)',
      },
      {
        title: (<div>当年港股通<br />成交量(除ETF)(元)</div>),
        dataIndex: 'hkStockDealAmount',
        key: '当年港股通成交量(除ETF)(元)',
      },
      {
        title: (<div>当年港股通<br />成交量(ETF)(元)</div>),
        dataIndex: 'hkETFDealAmount',
        key: '当年港股通成交量(ETF)(元)',
      },
      {
        title: (<div>当年港股通<br />净佣金(除ETF)(元)</div>),
        dataIndex: 'netCommissionStock',
        key: '当年港股通净佣金(除ETF)(元)',
      },
      {
        title: (<div>当年港股通<br />净佣金(ETF)(元)</div>),
        dataIndex: 'netCommissionETF',
        key: '当年港股通净佣金(ETF)(元)',
      },
      {
        title: '外部市值',
        dataIndex: 'exterMarketValue',
        key: '外部市值',
      },
      // {
      //   title: (<div style={{ display: 'flex',alignItems: 'center'}}>
      //     <div>
      //        业务渗透<br/>港股通积分
      //     </div>
      //     <div>
      //       <Tooltip title={this.gkShowTooltip()} overlayStyle={{ minWidth: '400px' }}>
      //         <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
      //       </Tooltip>
      //     </div>
      //   </div>),
      //   dataIndex: 'hkScore',
      //   key: '业务渗透-港股通积分',
      // },

      {
        title: '开发关系',
        dataIndex: 'relationOfDevelopment',
        key: '开发关系',
      },
      {
        title: '无效户激活关系',
        dataIndex: 'relationOfActive',
        key: '无效户激活关系',
      },
      {
        title: '港股通开发关系',
        dataIndex: 'relationOfHKStockDevelopment',
        key: '港股通开发关系',
      },
      {
        title: '服务关系',
        dataIndex: 'relationOfService',
        key: '服务关系',
      },
    ];
  }
  reset = ()=>{
    this.setState({
      custRange: 0,
      gudongka:0,
      custRank: [],
      rankVisible: false,
      ktDate: [undefined,undefined],//默认无限制
      isTrade: 0,
      firstDate: [undefined,undefined],
      dept: [],
      deptSearch: '',
      custKind: 0,
      assetsPeak: 0,
      turnoverValue: 0,
      ggtTradingMin: null,
      ggtTradingMax: null,
      ggtNetCommissionMin: null,
      ggtNetCommissionMax: null,
      qkImportance: [],
      // bussGkbin: [7],
      gkRankTop: 0,
      tags: [],
      tagsVisible: false,
      custGrup: [],
      custVisible: false,
      qkVisible: false,
    });
  }
  componentDidMount(){
    //this.queryData();
  }
  queryData = ()=>{
    this.setState({
      tableVisible: true,
      current: 1,
      selectAll: false,
      selectedRowKeys: [],
      selectedRows: [],
    },this.fetchData());
  }

  setStateChange = (state)=>{
    this.setState({
      ...state,
    });
  }

  setImpoChange = (state,key)=>{
    let length = state[key].length;
    let item = state[key][length - 1];
    if (item === 7) { //如果是全部,则和其他所有关系互斥
      state[key].splice(0, length - 1);
    }else{
      if (state[key].indexOf(7) > -1) {
        state[key].splice(state[key].indexOf(7), 1);
      }
    } 
    this.setState({
      ...state,
    });
  };


  fetchData = ()=>{
    this.setState({
      loading: true,
    });
    const { 
      custRange,
      gudongka,
      custRank,
      ktDate,//默认无限制
      isTrade,
      firstDate,
      dept,
      deptSearch,
      custKind,
      assetsPeak,
      turnoverValue,
      ggtTradingMin,
      ggtTradingMax,
      ggtNetCommissionMin,
      ggtNetCommissionMax,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
      bussGkbin,
      qkImportance,
      gkRankTop ,
    } = this.state;
    hongkongStock({
      buzState: 1 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      buzOpeningDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (ktDate[0] ? ktDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (ktDate[1] ? ktDate[1].format('YYYYMMDD') : "30000101"),
      },
      isDeal: isTrade,
      firstTimeDealDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (firstDate[0] ? firstDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (firstDate[1] ? firstDate[1].format('YYYYMMDD') : "30000101"),
      },
      departmentList: dept,
      customerType: custKind,
      assetsPeak: assetsPeak,
      dealAmount: turnoverValue,
      hkScoreList: bussGkbin.includes(7) ? [] : bussGkbin,
      hkMvMonthlyPeak: gkRankTop,
      recommendLevelList: qkImportance,
      hongkongStockTradingAmount: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+ggtTradingMin,
        // "valueTo": ''+ggtTradingMax,
        "valueFrom": ggtTradingMin === null ? '0' : `${ggtTradingMin}`,
        "valueTo": ggtTradingMax === null ? `${Math.pow(2,31)}` : `${ggtTradingMax}`,
      },
      hongkongStockCommissionAmount: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+ggtNetCommissionMin,
        // "valueTo": ''+ggtNetCommissionMax,
        "valueFrom": ggtNetCommissionMin === null ? '0' : `${ggtNetCommissionMin}`,
        "valueTo": ggtNetCommissionMax === null ? `${Math.pow(2,31)}` : `${ggtNetCommissionMax}`,
      },
      "staffTagList": tags.filter(item=>item.split('/')[1] === '3').map(item=>item.split('/')[0]),
      "companyTagList": tags.filter(item=>item.split('/')[1] === '2').map(item=>item.split('/')[0]),
      "activityTagList": tags.filter(item=>item.split('/')[1] === '1').map(item=>item.split('/')[0]),
      customerGroupIdList: custGrup,
      pageNo: this.state.current,
      pageSize: this.state.pageSize,
    }).then(res=>{
      this.setState({ dataSource: res.records ,total: res.total ,loading: false ,md5: res.note });
      this.newState = this.state;
    }).catch(err => message.error(err.note || err.message));
  }
    // 选中营业部变化
    handleYybChange = (value, label, extra) => {
      let { dept } = this.state;
      if (value.length) {
        const array = [];
        array.push(extra.triggerValue);
        this.getCheckedKeys(extra.triggerNode.props.children, array);
        if (extra.checked) {
          array.forEach(item => {
            if (dept.indexOf(item) === -1) dept.push(item);
          });
        } else {
          array.forEach(item => {
            if (dept.indexOf(item) > -1) dept.splice(dept.indexOf(item), 1);
          });
        }
      } else {
        dept = [];
      }
      this.setState({ deptSearch: this.state.deptSearch, dept });
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
        deptSearch: value,
      });
    }
    render() {
      const { pageSize,current,total } = this.state;
      const tableProps = {
        bordered: true,
        scroll: { x: true },
        rowKey: 'key',
        dataSource: this.state.dataSource.map((item, index) => {
          return { ...item,key: ((current - 1) * pageSize) + index + 1 };
        }),
        columns: this.getColumns(),
        className: 'm-Card-Table',
        pagination: {
          className: 'm-bss-paging',
          showTotal: totals => {
            return `总共${totals}条`;
          },
          showLessItems: true,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          total,
          current,
          pageSize,
          onChange: (current, pageSize) => {
            this.setState({ current, pageSize }, () => this.fetchData());
          },
          onShowSizeChange: (current, pageSize) => {
            this.setState({ current, pageSize }, () => this.fetchData());
          },
        },
        rowSelection: {
          type: 'checkbox',
          crossPageSelect: true, // checkbox默认开启跨页全选
          selectAll: this.state.selectAll,
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
            this.setState({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys,selectedRows });
          },
          getCheckboxProps: record => ({
            disabled: record.status === 0, // Column configuration not to be checked
            name: record.status,
          }),
          fixed: true,
        },
      // onChange: this.handleTableChange,
      };
      const { 
        custRange,
        gudongka,
        custRank,
        ktDate,//默认无限制
        isTrade,
        firstDate,
        dept,
        deptSearch,
        custKind,
        assetsPeak,
        turnoverValue,
        qkImportance,
        bussGkbin,
        ggtTradingMin,
        ggtTradingMax,
        ggtNetCommissionMin,
        ggtNetCommissionMax,
        tags,
        tagsVisible,
        custGrup,
        custVisible,
        qkVisible,
        bussGkVisible,
        gkRankTop,
      } = this.state;
      const SearchProps = {
        rankVisible: this.state.rankVisible, 
        custRange,
        gudongka,
        custRank,
        ktDate,//默认无限制
        isTrade,
        firstDate,
        dept,
        deptSearch,
        custKind,
        // assetsPeak,
        // turnoverValue,
        qkImportance,
        bussGkbin,
        ggtTradingMin,
        ggtTradingMax,
        ggtNetCommissionMin,
        ggtNetCommissionMax,
        tags,
        tagsVisible,
        qkVisible,
        custGrup,
        custVisible,
        bussGkVisible,
        gkRankTop,
        handleYybChange: this.handleYybChange,
        handleYybSearch: this.handleYybSearch,
        setStateChange: this.setStateChange,
        setImpoChange: this.setImpoChange,
        qkShowTooltip: this.qkShowTooltip,
        gkShowTooltip: this.gkShowTooltip,
        reset: this.reset,
        queryData: this.queryData,
        handleClick: this.handleClick,
      };
      const btnProps = { type: 3,total,getColumns: this.getColumns,param: this.getParam(),selectAll: this.state.selectAll,selectedRows: this.state.selectedRows,md5: this.state.md5 };
      return (
        <div className={styles.Table} onClick={() => this.setState({ tagsVisible: false,custVisible: false ,riskVisible: false,sceneVisible: false,rankVisible: false ,qkVisible: false ,bussGkVisible: false })}>
          <SearchContent {...SearchProps}/>
          {
            this.state.tableVisible && (
          <>
            <TableBtn {...btnProps}/>
            <BasicDataTable {...tableProps} style={{ marginBottom: 20 }} loading={this.state.loading}/>
          </>
            )
          }
        </div>
      );
    }
}
