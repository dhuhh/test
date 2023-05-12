import React, { Component } from 'react';
import styles from '../index.less';
import SearchContent from '../Common/SearchContent';
import { Link } from 'umi';
import { QueryThreeBoard } from '$services/newProduct';
import BasicDataTable from '$common/BasicDataTable';
import TableBtn from '../Common/TableBtn';
import moment from 'moment';
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
    gudongka:0,
    custRank: [],
    rankVisible: false,
    ktDate: [undefined,undefined],//默认无限制
    isTrade: 0,
    firstDate: [undefined,undefined],
    dept: [],
    deptSearch: '',
    custKind: 0,
    khDate: [undefined,undefined],
    khDateKey: 0,
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
      ktDate,//默认无限制
      isTrade,
      firstDate,
      dept,
      deptSearch,
      custKind,
      khDate,
      khDateKey,
      assetsPeak,
      turnoverValue,
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
      registerYears: {
        "isCustom": khDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": khDateKey === 999 ? null : khDateKey,
        "date": null,
        "dateFrom": khDateKey === 999 ? (khDate[0] ? khDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": khDateKey === 999 ? (khDate[1] ? khDate[1].format('YYYYMMDD') : "30000101") : null,
      },
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
        title: '开通时间',
        dataIndex: 'buzOpeningDate',
        key: '开通时间',
      },
      {
        title: '是否交易',
        dataIndex: 'isDeal',
        key: '是否交易',
      },
      {
        title: '首次交易时间',
        dataIndex: 'firstTimeTradingDate',
        key: '首次交易时间',
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
        title: '客户类型',
        dataIndex: 'customerType',
        key: '客户类型',
      },
      {
        title: '开户时间(年)',
        dataIndex: 'registerYears',
        key: '开户时间(年)',
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
      khDate: [undefined,undefined],
      khDateKey: 0,
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
      gudongka,
      custRank,
      ktDate,//默认无限制
      isTrade,
      firstDate,
      dept,
      deptSearch,
      custKind,
      khDate,
      khDateKey,
      assetsPeak,
      turnoverValue,
      tags,
      tagsVisible,
      custGrup,
      custVisible,
    } = this.state;
    QueryThreeBoard({
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
      registerYears: {
        "isCustom": khDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": khDateKey === 999 ? null : khDateKey,
        "date": null,
        "dateFrom": khDateKey === 999 ? (khDate[0] ? khDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": khDateKey === 999 ? (khDate[1] ? khDate[1].format('YYYYMMDD') : "30000101") : null,
      },
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
    // 点击时间周期按钮
   handleClick = (value, key) => {
     this.setState({
       [key]: value,
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
       khDate,
       khDateKey,
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
       ktDate,//默认无限制
       isTrade,
       firstDate,
       dept,
       deptSearch,
       custKind,
       khDate,
       khDateKey,
       assetsPeak,
       turnoverValue,
       tags,
       tagsVisible,
       custGrup,
       custVisible,
       handleYybChange: this.handleYybChange,
       handleYybSearch: this.handleYybSearch,
       setStateChange: this.setStateChange,
       reset: this.reset,
       queryData: this.queryData,
       handleClick: this.handleClick,
     };
     const btnProps = { type: 4,total,getColumns: this.getColumns,param: this.getParam(),selectAll: this.state.selectAll,selectedRows: this.state.selectedRows,md5: this.state.md5 };
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
