import React, { Component } from 'react';
import styles from '../index.less';
import moment from 'moment';
import { message } from 'antd';
import SearchContent from '../Common/SearchContent';
import { Link } from 'umi';
import { QueryInvalidCustomer } from '$services/newProduct';
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
    activedDate: [undefined,undefined],//默认无限制
    dept: [],
    deptSearch: '',
  }
  newState = this.state
  getParam = ()=>{
    const { custRange,custRank,activedDate,dept,deptSearch,gudongka } = this.newState;
    return {
      buzState: 1 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      activeDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (activedDate[0] ? activedDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (activedDate[1] ? activedDate[1].format('YYYYMMDD') : "30000101"),
      },
      "departmentList": dept,
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
        title: '激活时间',
        dataIndex: 'activeDate',
        key: '激活时间',
      },
      {
        title: '开户营业部',
        dataIndex: 'department',
        key: '开户营业部',
      },
      {
        title: '当前资产(元)',
        dataIndex: 'previousAsset',
        key: '当前资产(元)',
      },
      {
        title: '开发关系',
        dataIndex: 'devRela',
        key: '开发关系',
      },
      {
        title: '无效户激活关系',
        dataIndex: 'relationOfActive',
        key: '无效户激活关系',
      },
    ];
  }
  reset = ()=>{
    this.setState({
      custRange: 0,
      gudongka:0,
      custRank: [],
      rankVisible: false,
      activedDate: [undefined,undefined],//默认无限制
      dept: [],
      deptSearch: '',
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
  // 点击时间周期按钮
   handleClick = (value, key) => {
     this.setState({
       [key]: value,
     });
   }
  fetchData = ()=>{
    this.setState({
      loading: true,
    });
    const { custRange,custRank,activedDate,dept,deptSearch,gudongka } = this.state;
    QueryInvalidCustomer({
      buzState: 1 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      activeDate: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (activedDate[0] ? activedDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (activedDate[1] ? activedDate[1].format('YYYYMMDD') : "30000101"),
      },
      "departmentList": dept,
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
      const { custRange,custRank,activedDate,dept,deptSearch,gudongka } = this.state;
      const SearchProps = {
        rankVisible: this.state.rankVisible, custRange,custRank,activedDate,dept,deptSearch,gudongka,
        handleYybChange: this.handleYybChange,
        handleYybSearch: this.handleYybSearch,
        setStateChange: this.setStateChange,
        reset: this.reset,
        queryData: this.queryData,
        handleClick: this.handleClick,
      };
      const btnProps = { type: 10 ,total,getColumns: this.getColumns,param: this.getParam(),selectAll: this.state.selectAll,selectedRows: this.state.selectedRows,md5: this.state.md5 };
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
