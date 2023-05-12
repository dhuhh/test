import React, { Component } from 'react';
import styles from '../index.less';
import moment from 'moment';
import SearchContent from '../Common/SearchContent';
import { Link } from 'umi';
import { QueryFundInvestmentAdvisor } from '$services/newProduct';
import BasicDataTable from '$common/BasicDataTable';
import TableBtn from '../Common/TableBtn';
import { message } from 'antd';


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
    custRank: [],
    rankVisible: false,

    netAssetMin: null,
    netAssetMax: null,
    financialAssetMin: null,
    financialAssetMax: null,
    fundMin: null,
    fundMax: null,
    outAssetMin: null,
    outAssetMax: null,
    signDate: [undefined,undefined],
    dept: [],
    deptSearch: '',
    riskValue: [],
    riskVisible: false,
    tags: [],
    tagsVisible: false,
    custGrup: [],
    custVisible: false,
  }
  newState = this.state
  getParam = ()=>{
    const { 
      custRange,
      custRank,

      netAssetMin,
      netAssetMax,
      financialAssetMin,
      financialAssetMax,
      fundMin,
      fundMax,
      outAssetMin,
      outAssetMax,
      signDate,
      dept,
      deptSearch,
      riskValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.newState;
    return {
      buzState: 1 ,
      customerRange: custRange,
      customerLevel: custRank,
      assets: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+netAssetMin,
        // "valueTo": ''+netAssetMax,
        "valueFrom": netAssetMin === null ? '0' : `${netAssetMin}`,
        "valueTo": netAssetMax === null ? `${Math.pow(2,31)}` : `${netAssetMax}`,
      },
      managedFinanceAssets: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+financialAssetMin,
        // "valueTo": ''+financialAssetMax,
        "valueFrom": financialAssetMin === null ? '0' : `${financialAssetMin}`,
        "valueTo": financialAssetMax === null ? `${Math.pow(2,31)}` : `${financialAssetMax}`,
      },
      fundMarketValue: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+fundMin,
        // "valueTo": ''+fundMax,
        "valueFrom": fundMin === null ? '0' : `${fundMin}`,
        "valueTo": fundMax === null ? `${Math.pow(2,31)}` : `${fundMax}`,
      },
      externalMarketValue: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+outAssetMin,
        // "valueTo": ''+outAssetMax,
        "valueFrom": outAssetMin === null ? '0' : `${outAssetMin}`,
        "valueTo": outAssetMax === null ? `${Math.pow(2,31)}` : `${outAssetMax}`,
      },
      contractDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (signDate[0] ? signDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (signDate[1] ? signDate[1].format('YYYYMMDD') : "30000101"),
      },
      departmentList: dept,
      riskAssessment: riskValue,
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
        title: '场景',
        dataIndex: 'scene',
        key: '场景',
      },
      {
        title: '签约时间',
        dataIndex: 'contractDate',
        key: '签约时间',
      },
      {
        title: '预估外部市值(元)',
        dataIndex: 'externalMarketValue',
        key: '预估外部市值(元)',
      },
      {
        title: '基金投顾市值(元)',
        dataIndex: 'fundMarketValue',
        key: '基金投顾市值(元)',
      },
      {
        title: '基金投顾总盈亏(元)',
        dataIndex: 'profitOrLoss',
        key: '基金投顾总盈亏(元)',
      },
      {
        title: '开户营业部',
        dataIndex: 'department',
        key: '开户营业部',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: '手机号',
      },
      {
        title: '近一年总贡献(元)',
        dataIndex: 'contribution1Year',
        key: '近一年总贡献(元)',
      },
      {
        title: '开发关系',
        dataIndex: 'relationOfDevelopment',
        key: '开发关系',
      },
      {
        title: '服务关系',
        dataIndex: 'relationOfService',
        key: '服务关系',
      },
      {
        title: '无效户激活关系',
        dataIndex: 'relationOfActive',
        key: '无效户激活关系',
      },
    ];
  }
  // 点击时间周期按钮
   handleClick = (value, key) => {
     this.setState({
       [key]: value,
     });
   }
  reset = ()=>{
    this.setState({
      custRange: 0,
      custRank: [],
      rankVisible: false,

      netAssetMin: null,
      netAssetMax: null,
      financialAssetMin: null,
      financialAssetMax: null,
      fundMin: null,
      fundMax: null,
      outAssetMin: null,
      outAssetMax: null,
      signDate: [undefined,undefined],
      dept: [],
      deptSearch: '',
      riskValue: [],
      riskVisible: false,
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

  setStateChange = (state)=>{
    this.setState({
      ...state,
    });
  }
  fetchData = ()=>{
    this.setState({
      loading: true,
    });
    const { 
      custRange,
      custRank,

      netAssetMin,
      netAssetMax,
      financialAssetMin,
      financialAssetMax,
      fundMin,
      fundMax,
      outAssetMin,
      outAssetMax,
      signDate,
      dept,
      deptSearch,
      riskValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.state;
    QueryFundInvestmentAdvisor({
      buzState: 1 ,
      customerRange: custRange,
      customerLevel: custRank,
      assets: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+netAssetMin,
        // "valueTo": ''+netAssetMax,
        "valueFrom": netAssetMin === null ? '0' : `${netAssetMin}`,
        "valueTo": netAssetMax === null ? `${Math.pow(2,31)}` : `${netAssetMax}`,
      },
      managedFinanceAssets: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+financialAssetMin,
        // "valueTo": ''+financialAssetMax,
        "valueFrom": financialAssetMin === null ? '0' : `${financialAssetMin}`,
        "valueTo": financialAssetMax === null ? `${Math.pow(2,31)}` : `${financialAssetMax}`,
      },
      fundMarketValue: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+fundMin,
        // "valueTo": ''+fundMax,
        "valueFrom": fundMin === null ? '0' : `${fundMin}`,
        "valueTo": fundMax === null ? `${Math.pow(2,31)}` : `${fundMax}`,
      },
      externalMarketValue: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+outAssetMin,
        // "valueTo": ''+outAssetMax,
        "valueFrom": outAssetMin === null ? '0' : `${outAssetMin}`,
        "valueTo": outAssetMax === null ? `${Math.pow(2,31)}` : `${outAssetMax}`,
      },
      contractDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (signDate[0] ? signDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (signDate[1] ? signDate[1].format('YYYYMMDD') : "30000101"),
      },
      departmentList: dept,
      riskAssessment: riskValue,
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
        custRank,

        netAssetMin,
        netAssetMax,
        financialAssetMin,
        financialAssetMax,
        fundMin,
        fundMax,
        outAssetMin,
        outAssetMax,
        signDate,
        dept,
        deptSearch,
        riskValue,riskVisible,
        tags,
        tagsVisible,
        custGrup,
        custVisible,
      } = this.state;
      const SearchProps = {
        rankVisible: this.state.rankVisible, 
        custRange,
        custRank,

        netAssetMin,
        netAssetMax,
        financialAssetMin,
        financialAssetMax,
        fundMin,
        fundMax,
        outAssetMin,
        outAssetMax,
        signDate,
        dept,
        deptSearch,
        riskValue,riskVisible,
        tags,
        tagsVisible,
        custGrup,
        custVisible,
        handleYybChange: this.handleYybChange,
        handleYybSearch: this.handleYybSearch,
        setStateChange: this.setStateChange,
        handleClick: this.handleClick,
        reset: this.reset,
        queryData: this.queryData,
      };
      const btnProps = { type: 8,total,getColumns: this.getColumns,param: this.getParam(),selectAll: this.state.selectAll,selectedRows: this.state.selectedRows,md5: this.state.md5 };
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
