import React, { Component } from 'react';
import { message , Card } from 'antd';
import styles from './index.less';
import { Link } from 'umi';
import config from '$utils/config';
import SearchContent from './SearchContent';
import TableBtn from './TableBtn';
import moment from 'moment';
import BasicDataTable from '$common/BasicDataTable';
import { QueryStaffList } from '$services/activityComPage';
const { ftq } = config;
const { activityComPage: { exportStaffCommissionList } } = ftq;



export default class Person extends Component{

  state ={
    custName: '', // 客户姓名
    dept: [], // 营业部 
    deptSearch: '', // 营业部搜索值
    payVar: [] , // 付费品种
    capNmu: '' , // 资金账号
    dateNmu: [moment().startOf('day').subtract(365,'d'),moment().endOf('day')] , // 日期 
    algorithm: '1' , // 算法
    algorithmLabel: '卡方主动型算法',
    algorithmLabelTwo: '卡方主动型算法' ,
    dataSource: [],
    pageSize: 10,
    current: 1,
    total: 0,
    loading: false,
  }

  componentDidMount(){
    this.queryData();
  }

  queryData = ()=>{
    const { algorithmLabel } = this.state;
    this.setState({
      current: 1,
      algorithmLabelTwo: algorithmLabel ,
    },this.fetchData());
  }

  fetchData = ()=>{
    this.setState({
      loading: true,
    });
    const { payVar , dateNmu , custName , algorithm , pageSize ,current , capNmu , dept } = this.state;
    QueryStaffList({
      ffpz: payVar.join(';'),
      jsrq: dateNmu[1].format('yyyyMMDD'),
      khxm: custName,
      ksrq: dateNmu[0].format('yyyyMMDD'),
      pagecount: pageSize,
      pagenumber: current,
      sf: algorithm,
      yyb: dept.join(','),
      zjzh: capNmu,
    }).then(res=>{
      this.setState({ dataSource: res.records ,total: res.count ,loading: false });
    }).catch(err => message.error(err.note || err.message));
  }
  reset = ()=>{
    this.setState({
      custName: '', // 客户姓名
      dept: [], // 营业部 
      deptSearch: '',
      payVar: [] , // 付费品种
      capNmu: '' , // 资金账号
      dateNmu: [moment().startOf('day').subtract(365,'d'),moment().endOf('day')] , // 日期 
      algorithm: '1' , // 算法
      algorithmLabel: '卡方主动型算法',
      payVarVisible: false , // 付费品种下拉
      algorithmVisible: false , // 算法下拉
    });
  }

  setStateChange = (state)=>{
    this.setState({
      ...state,
    });
  }


  getColumns = ()=>{
    const { algorithmLabelTwo } = this.state ;
    return [
      {
        title: '序号',
        dataIndex: 'key',
        keys: '序号',
        width: 68,
      },
      // {
      //   title: '业务合作费时间范围',
      //   dataIndex: 'rq',
      //   key: '业务合作费时间范围',
      // },
      {
        title: '资金账号',
        dataIndex: 'zjzh',
        key: '资金账号',
        width: 150,
      },
      {
        title: '资金账号类型',
        dataIndex: 'zjzhlx',
        key: '资金账号类型',
        width: 150,
      },
      {
        title: '客户号',
        dataIndex: 'khh',
        key: '客户号',
        width: 150,
      },
      {
        title: '客户姓名',
        dataIndex: 'khxm',
        key: '客户姓名',
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.khh}`} target='_blank'>{text}</Link>,
        width: 150,
      },
      {
        title: '营业部',
        dataIndex: 'yybmc',
        key: '营业部',
        width: 150, 
      },
      {
        title: '所属分公司',
        dataIndex: 'khwdmc',
        key: '所属分公司',
        width: 200,
      },
      {
        title: '开发人员',
        dataIndex: 'kfrymc',
        key: '开发人员',
        width: 150,
      },
      {
        title: '服务人员',
        dataIndex: 'fwrymc',
        key: '服务人员',
        width: 150,
      },
      {
        title: '付费品种',
        dataIndex: 'zqpzmc',
        key: '付费品种', 
        width: 200,
      },
      {
        title: (<div>{algorithmLabelTwo}<br />普通业务交易额</div>),
        dataIndex: 'ptjyl',
        key: `${algorithmLabelTwo}普通业务交易额`,
        width: 200,
      },
      {
        title: (<div>{algorithmLabelTwo}<br />信用业务交易额</div>),
        dataIndex: 'xyjyl',
        key: `${algorithmLabelTwo}信用业务交易额`,
        width: 200,
      },
      {
        title: (<div>{algorithmLabelTwo}<br />业务扣减费率</div>),
        dataIndex: 'jkfl',
        key: `${algorithmLabelTwo}业务扣减费率`,
        width: 200,
      },
      {
        title: (<div>{algorithmLabelTwo}<br />业务扣减佣金</div>),
        dataIndex: 'jkyj',
        key: `${algorithmLabelTwo}业务扣减佣金`,
        width: 200,
      },
    ];
  }

  render() {
    const { 
      dept,
      deptSearch,
      custName ,
      payVar , 
      capNmu , 
      dateNmu, 
      algorithm , 
      payVarVisible , // 付费品种下拉
      algorithmVisible , // 算法下拉
      pageSize,
      current,
      total,
    } = this.state;

    const tableProps = {
      bordered: true,
      // scroll: { x: true },
      rowKey: 'key',
      dataSource: this.state.dataSource.map((item, index) => {
        return { ...item,key: ((current - 1) * pageSize) + index + 1 };
      }),
      columns: this.getColumns(),
      className: `${styles.tableLeft} m-Card-Table`,
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
    };

    const SearchProps = {
      dept,
      deptSearch,
      custName,
      payVar , 
      capNmu , 
      dateNmu, 
      algorithm , 
      payVarVisible , // 付费品种下拉
      algorithmVisible , // 算法下拉
      setStateChange: this.setStateChange,
      reset: this.reset,
      queryData: this.queryData,
    };

    const newGetColums = this.getColumns().filter(t=> t.dataIndex !== 'key');
    const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(',');   
    const tableHeaderNames = newGetColums.map(item => item.key).join(',');   
    const staffCommissionModel = {
      ffpz: payVar.join(';'),
      jsrq: dateNmu[1].format('yyyyMMDD'),
      khxm: custName,
      ksrq: dateNmu[0].format('yyyyMMDD'),
      sf: algorithm,
      yyb: dept.join(','),
      zjzh: capNmu,
    };

    const exportPayload = JSON.stringify({
      staffCommissionModel,
      tableHeaderNames,
      tableHeaderCodes,

    });

    return(
      <div onClick={() => this.setState({ payVarVisible: false,algorithmVisible: false })} className={styles.cards}>
        <SearchContent {...SearchProps} />
        <Card>
          <TableBtn exportPayload={exportPayload} total={total} action={exportStaffCommissionList}/>
          <BasicDataTable {...tableProps} loading={this.state.loading}/>
        </Card>

      </div>
    );
    
  }
}