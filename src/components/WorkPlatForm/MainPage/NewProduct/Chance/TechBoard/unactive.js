import React, { Component } from 'react';
import styles from '../index.less';
import SearchContent from '../Common/SearchContent';
import { Link } from 'umi';
import { message } from 'antd';
import { QuerySTARMarket } from '$services/newProduct';
import BasicDataTable from '$common/BasicDataTable';
import TableBtn from '../Common/TableBtn';
import moment from 'moment';

export default class unactive extends Component {
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

    isSatisfy: Number(this.props.tab2),
    twentyAssetMin: null,
    twentyAssetMax: null,
    bailValue: 0,
    khDateKey: 0,
    khDate: [undefined,undefined],
    tradeExpDate: [undefined,undefined],
    tradeExpDateKey: 0,
    riskValue: [],
    riskVisible: false,
    assetsPeak: 0,
    turnoverValue: 0,
    tags: [],
    tagsVisible: false,
    custGrup: [],
    custVisible: false,
  }
  newState = this.state
  getParam = ()=>{
    const { 
      custRange,
      gudongka,
      custRank,

      isSatisfy,
      twentyAssetMin,
      twentyAssetMax,
      bailValue,
      khDateKey,
      khDate,
      tradeExpDate,
      tradeExpDateKey,
      riskValue,riskVisible,
      assetsPeak,
      turnoverValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.newState;
    return {
      buzState: 0 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      coverOpeningCondition: isSatisfy === 1 ? true : false,
      averageDailyAssets20: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+twentyAssetMin,
        // "valueTo": ''+twentyAssetMax,
        "valueFrom": twentyAssetMin === null ? '0' : `${twentyAssetMin}`,
        "valueTo": twentyAssetMax === null ? `${Math.pow(2,31)}` : `${twentyAssetMax}`,
      },
      promiseMoney: bailValue,
      registerYear: {
        "isCustom": khDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": khDateKey === 999 ? null : khDateKey,
        "date": null,
        "dateFrom": khDateKey === 999 ? (khDate[0] ? khDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": khDateKey === 999 ? (khDate[1] ? khDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      tradingYears: {
        "isCustom": tradeExpDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": tradeExpDateKey === 999 ? null : tradeExpDateKey,
        "date": null,
        "dateFrom": tradeExpDateKey === 999 ? (tradeExpDate[0] ? tradeExpDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": tradeExpDateKey === 999 ? (tradeExpDate[1] ? tradeExpDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      riskAssessment: riskValue,
      assetsPeak: assetsPeak,
      dealAmount: turnoverValue,
      "staffTagList": tags.filter(item=>item.split('/')[1] === '3').map(item=>item.split('/')[0]),
      "companyTagList": tags.filter(item=>item.split('/')[1] === '2').map(item=>item.split('/')[0]),
      "activityTagList": tags.filter(item=>item.split('/')[1] === '1').map(item=>item.split('/')[0]),
      customerGroupIdList: custGrup,
      pageNo: 0,
      pageSize: 0,
    };
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
        title: '20日日均资产',
        dataIndex: 'averageDailyAssets20',
        key: '20日日均资产',
      },
      {
        title: '开户营业部',
        dataIndex: 'department',
        key: '开户营业部',
      },
      {
        title: '保证金余额(元)',
        dataIndex: 'promiseMoney',
        key: '保证金余额(元)',
      },
      {
        title: '开户时间(年)',
        dataIndex: 'registerYears',
        key: '开户时间(年)',
      },
      {
        title: '交易经验(年)',
        dataIndex: 'tradingYears',
        key: '交易经验(年)',
      },
      {
        title: '风险测评',
        dataIndex: 'riskAssessment',
        key: '风险测评',
      },
      {
        title: '资产峰值(近一年)(元)',
        dataIndex: 'assetsPeak',
        key: '资产峰值(近一年)(元)',
      },
      {
        title: '成交量(近一年)(元)',
        dataIndex: 'dealAmount',
        key: '成交量(近一年)(元)',
      },
    ];
  }
  // 点击时间周期按钮
   handleClick = (value, key) => {
     this.setState({
       [key]: value,
     });
   }
  setStateChange = (state)=>{
    this.setState({
      ...state,
    });
  }
  reset = ()=>{
    this.setState({
      custRange: 0,
      gudongka:0,
      custRank: [],
      rankVisible: false,

      isSatisfy: Number(this.props.tab2),
      twentyAssetMin: null,
      twentyAssetMax: null,
      bailValue: 0,
      khDateKey: 0,
      khDate: [undefined,undefined],
      tradeExpDate: [undefined,undefined],
      tradeExpDateKey: 0,
      riskValue: [],
      riskVisible: false,
      assetsPeak: 0,
      turnoverValue: 0,
      tags: [],
      tagsVisible: false,
      custGrup: [],
      custVisible: false,
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
  fetchData = ()=>{
    this.setState({
      loading: true,
    });
    const { 
      custRange,
      gudongka,
      custRank,

      isSatisfy,
      twentyAssetMin,
      twentyAssetMax,
      bailValue,
      khDateKey,
      khDate,
      tradeExpDate,
      tradeExpDateKey,
      riskValue,riskVisible,
      assetsPeak,
      turnoverValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.state;
    QuerySTARMarket({
      buzState: 0 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      coverOpeningCondition: isSatisfy === 1 ? true : false,
      averageDailyAssets20: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+twentyAssetMin,
        // "valueTo": ''+twentyAssetMax,
        "valueFrom": twentyAssetMin === null ? '0' : `${twentyAssetMin}`,
        "valueTo": twentyAssetMax === null ? `${Math.pow(2,31)}` : `${twentyAssetMax}`,
      },
      promiseMoney: bailValue,
      registerYear: {
        "isCustom": khDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": khDateKey === 999 ? null : khDateKey,
        "date": null,
        "dateFrom": khDateKey === 999 ? (khDate[0] ? khDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": khDateKey === 999 ? (khDate[1] ? khDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      tradingYears: {
        "isCustom": tradeExpDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": tradeExpDateKey === 999 ? null : tradeExpDateKey,
        "date": null,
        "dateFrom": tradeExpDateKey === 999 ? (tradeExpDate[0] ? tradeExpDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": tradeExpDateKey === 999 ? (tradeExpDate[1] ? tradeExpDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      riskAssessment: riskValue,
      assetsPeak: assetsPeak,
      dealAmount: turnoverValue,
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

      isSatisfy,
      twentyAssetMin,
      twentyAssetMax,
      bailValue,
      khDateKey,
      khDate,
      tradeExpDate,
      tradeExpDateKey,
      riskValue,riskVisible,
      assetsPeak,
      turnoverValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.state;
    const SearchProps = {
      rankVisible: this.state.rankVisible,
      custRange,
      gudongka,
      custRank,

      isSatisfy,
      twentyAssetMin,
      twentyAssetMax,
      bailValue,
      khDateKey,
      khDate,
      tradeExpDate,
      tradeExpDateKey,
      riskValue,riskVisible,
      assetsPeak,
      turnoverValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
      handleClick: this.handleClick,
      setStateChange: this.setStateChange,
      reset: this.reset,
      queryData: this.queryData,
    };
    const btnProps = { type: 5 ,total,getColumns: this.getColumns,param: this.getParam(),selectAll: this.state.selectAll,selectedRows: this.state.selectedRows,md5: this.state.md5 };
    return (
      <div className={styles.Table} onClick={() => this.setState({ tagsVisible: false,custVisible: false ,riskVisible: false,sceneVisible: false,rankVisible: false })}>
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
