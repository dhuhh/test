import React, { Fragment } from 'react';
import { Table,Button,Divider,Radio,message,Modal } from 'antd';
import { history as router } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import lodash from 'lodash';
import config from '$utils/config';
import styles from './index.less';
import BasicDataTable from '$common/BasicDataTable';
import { QueryQueryProfitAllAcount, QueryProfitNormalAcount,QueryProfitfinanAcount,QueryProfitOptionAcount } from '$services/customerPanorama';
import { newClickSensors, newViewSensors } from "$utils/newSensors";

const { api } = config;
const {
  customerPanorama: {
    getSucessWatertListExport, // 成交流水全部账户导出
    getProfitNormalListExport, // 成交流水信用、普通导出
    getProfitOptionListListExport, // 成交流水期权账户导出
    getProfitfinanListExport, // 成交流水理财账户导出
  } } = api;
class Commontable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pagesize: 10,
      current: 1,
      total: 0,

      isMonth: 1,
      beginDate: '',
      endDate: '',
      customerCode: '', // 客户号
      TableData: [], // 全部账户-Table

      isSearchType: '', //明细
      jyType2: '',// 交易类别
      inputValue2: '', // 产品代码
      accountType: '', // 账户类型

      cpType2: '', // 产品类型
      businessType2: '', // 业务类别

      isResetCurrentPageCopy: true,
    };
  }
  // 切换交易流水大类触发
  componentDidMount(){
    const { chengjiaoAll: { isMonth,tjDateCopy,tjDate }, customerCode, accountType2,chengjiaoAll,chengjiaoCommCredit,chengjiaoLicai,chengjiaoqiquan,isResetCurrentPage } = this.props;

    // 从资金流水 信用/期权 切换回成交流水时,默认调用的接口入参是成交流水全部的问题解决
    if(accountType2 === 1){
      this.setState({
        beginDate: tjDate[0].format('YYYYMM'),
        endDate: tjDate[1].format('YYYYMM'),
        customerCode: this.props.customerCode, // 客户号
      },
      ()=>{
        this.fetchAllAccountTable();
      }
      );
    }
    if(accountType2 === 2 || accountType2 === 3 ){
      this.setState({
        ...chengjiaoCommCredit,
        accountType: chengjiaoCommCredit.accountType2,
        beginDate: chengjiaoCommCredit.tjDateCopy[0].format('YYYYMM'),
        endDate: chengjiaoCommCredit.tjDateCopy[1].format('YYYYMM'),
      },
      ()=>{
        this.fetchProfitNormalAcount();
      }
      );
    }

    if(accountType2 === 4){
      this.setState({
        ...chengjiaoLicai,
        beginDate: chengjiaoLicai.tjDateCopy[0].format('YYYYMM'),
        endDate: chengjiaoLicai.tjDateCopy[1].format('YYYYMM'),

      },
      ()=>{
        this.fetchFinanAcount();
      }
      );
    }

    if(accountType2 === 5){
      this.setState({
        ...chengjiaoqiquan,
        beginDate: chengjiaoqiquan.tjDateCopy[0].format('YYYYMM'),
        endDate: chengjiaoqiquan.tjDateCopy[1].format('YYYYMM'),
      },
      ()=>{

        this.fetchOptionAcount();
      }
      );
    }
  }

  // 交易流水大类之外的筛选条件查询触发
  componentWillReceiveProps(nextProps) {
    this.setState({
      accountType2: nextProps.accountType2, // 给分页用的判断当前是那个账户类型下的Table
    });
    if(nextProps.isResetCurrentPage !== this.props.isResetCurrentPage){ // 保持每次切换筛选条件之后的table的当前页都能初始化1
      this.setState({
        current: 1,
        isResetCurrentPageCopy: nextProps.isResetCurrentPage,
      });
    }
    // 交流水全部账户Table
    if( nextProps.chengjiaoAll.accountType2 === 1){
      if( nextProps.chengjiaoAll.accountType2 !== this.props.chengjiaoAll.accountType2 ||
        nextProps.chengjiaoAll.isMonth !== this.props.chengjiaoAll.isMonth || nextProps.chengjiaoAll.tjDateCopy[0] !== this.props.chengjiaoAll.tjDateCopy[0] || nextProps.chengjiaoAll.tjDateCopy[1] !== this.props.chengjiaoAll.tjDateCopy[1]){
        if(nextProps.chengjiaoAll.isMonth === 1){ // 按月
          this.setState({
            isMonth: nextProps.chengjiaoAll.isMonth,
            beginDate: nextProps.chengjiaoAll.tjDateCopy[0].format('YYYYMM'),
            endDate: nextProps.chengjiaoAll.tjDateCopy[1].format('YYYYMM'),
          },
          ()=>{
            this.fetchAllAccountTable();
          }
          );
        }else { // 按日
          this.setState({
            isMonth: nextProps.chengjiaoAll.isMonth,
            beginDate: nextProps.chengjiaoAll.tjDateCopy[0].format('YYYYMMDD'),
            endDate: nextProps.chengjiaoAll.tjDateCopy[1].format('YYYYMMDD'),
          },
          ()=>{
            this.fetchAllAccountTable();
          }
          );
        }
      }
    }

    // 全部-普通/信用Table
    if(nextProps.chengjiaoCommCredit.accountType2 === 2 || nextProps.chengjiaoCommCredit.accountType2 === 3){
      if( nextProps.chengjiaoCommCredit.tjDateCopy[0] !== '' && (nextProps.chengjiaoCommCredit.accountType2 !== this.props.chengjiaoCommCredit.accountType2 ||
        nextProps.chengjiaoCommCredit.isAccountClick !== this.props.chengjiaoCommCredit.isAccountClick || nextProps.chengjiaoCommCredit.isSearchType !== this.props.chengjiaoCommCredit.isSearchType
        || nextProps.chengjiaoCommCredit.jyType2 !== this.props.chengjiaoCommCredit.jyType2 || nextProps.chengjiaoCommCredit.inputValue2 !== this.props.chengjiaoCommCredit.inputValue2
        || nextProps.chengjiaoCommCredit.tjDateCopy[0] !== this.props.chengjiaoCommCredit.tjDateCopy[0] || nextProps.chengjiaoCommCredit.tjDateCopy[1] !== this.props.chengjiaoCommCredit.tjDateCopy[1])){
        this.setState({
          accountType: nextProps.chengjiaoCommCredit.isAccountClick,
          beginDate: nextProps.chengjiaoCommCredit.tjDateCopy[0].format('YYYYMMDD'),
          endDate: nextProps.chengjiaoCommCredit.tjDateCopy[1].format('YYYYMMDD'),
          isSearchType: nextProps.chengjiaoCommCredit.isSearchType,
          jyType2: nextProps.chengjiaoCommCredit.jyType2,
          inputValue2: nextProps.chengjiaoCommCredit.inputValue2,
        },
        ()=>{
          this.fetchProfitNormalAcount();
        }
        );
      }
    }

    // 全部-理财-table
    if( nextProps.chengjiaoLicai.accountType2 === 4){
      if(nextProps.chengjiaoLicai.accountType2 !== this.props.chengjiaoLicai.accountType2 ||
        nextProps.chengjiaoLicai.cpType2 !== this.props.chengjiaoLicai.cpType2 || nextProps.chengjiaoLicai.businessType2 !== this.props.chengjiaoLicai.businessType2 ||
         nextProps.chengjiaoLicai.isSearchType !== this.props.chengjiaoLicai.isSearchType ||
        nextProps.chengjiaoLicai.inputValue2 !== this.props.chengjiaoLicai.inputValue2
        || nextProps.chengjiaoLicai.tjDateCopy[0] !== this.props.chengjiaoLicai.tjDateCopy[0] || nextProps.chengjiaoLicai.tjDateCopy[1] !== this.props.chengjiaoLicai.tjDateCopy[1]){
        this.setState({
          beginDate: nextProps.chengjiaoLicai.tjDateCopy[0].format('YYYYMMDD'),
          endDate: nextProps.chengjiaoLicai.tjDateCopy[1].format('YYYYMMDD'),
          isSearchType: nextProps.chengjiaoLicai.isSearchType,
          inputValue2: nextProps.chengjiaoLicai.inputValue2,
          cpType2: nextProps.chengjiaoLicai.cpType2,
          businessType2: nextProps.chengjiaoLicai.businessType2,
        },
        ()=>{
          this.fetchFinanAcount();
        }
        );
      }
    }

    // 全部-期权-table
    if( nextProps.chengjiaoqiquan.accountType2 === 5){
      if( nextProps.chengjiaoqiquan.accountType2 !== this.props.chengjiaoqiquan.accountType2 ||
        nextProps.chengjiaoqiquan.inputValueHeyue2 !== this.props.chengjiaoqiquan.inputValueHeyue2 || nextProps.chengjiaoqiquan.qiquanType2 !== this.props.chengjiaoqiquan.qiquanType2 ||
        nextProps.chengjiaoqiquan.isSearchType !== this.props.chengjiaoqiquan.isSearchType || nextProps.chengjiaoqiquan.inputValue2 !== this.props.chengjiaoqiquan.inputValue2
        || nextProps.chengjiaoqiquan.tjDateCopy[0] !== this.props.chengjiaoqiquan.tjDateCopy[0] || nextProps.chengjiaoqiquan.tjDateCopy[1] !== this.props.chengjiaoqiquan.tjDateCopy[1] ||
        nextProps.chengjiaoqiquan.dealType2 !== this.props.chengjiaoqiquan.dealType2){
        this.setState({
          beginDate: nextProps.chengjiaoqiquan.tjDateCopy[0].format('YYYYMMDD'),
          endDate: nextProps.chengjiaoqiquan.tjDateCopy[1].format('YYYYMMDD'),
          isSearchType: nextProps.chengjiaoqiquan.isSearchType,
          inputValueHeyue2: nextProps.chengjiaoqiquan.inputValueHeyue2,
          qiquanType2: nextProps.chengjiaoqiquan.qiquanType2,
          dealType2: nextProps.chengjiaoqiquan.dealType2,
        },
        ()=>{
          this.fetchOptionAcount();
        }
        );
      }
    }
  }

  // 全部账户--Table
  fetchAllAccountTable = () => {
    this.setState({
      loading: true,
    });
    QueryQueryProfitAllAcount({
      accnNo: this.props.customerCode, // 客户号  TODO 暂时写死
      monthOrday: this.state.isMonth.toString() === '1' ? '2' : '1' , // 按月/按日
      pageNo: this.state.current,
      pageSize: this.state.pagesize ,
      beginDate: this.state.beginDate,// 开始时间
      endDate: this.state.endDate, // 结束时间
    }).then((ret = {}) => {
      const { code = 0, records = [],total = 0 } = ret;
      if (code > 0) {
        this.setState({
          TableData: records,
          loading: false,
          total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        loading: false,
      });
    });
  }

  // 成交流水普通、信用账户--table
  fetchProfitNormalAcount =() => {
    this.setState({
      loading: true,
    });
    QueryProfitNormalAcount({
      accnNo: this.props.customerCode, // 客户号
      accountType: (this.state.accountType - 1).toString(), // 账户类型  1普通 2信用
      pageNo: this.state.current,
      pageSize: this.state.pagesize ,
      beginDate: this.state.beginDate,// 开始时间
      endDate: this.state.endDate, // 结束时间
      istotal: this.state.isSearchType.toString(), // 明细/汇总   1 明细 2汇总
      type: this.state.jyType2.toString(), // 交易类别   1|全部；2|买入;3|卖出;4|转托管; 999|其它
      productCode: this.state.inputValue2, // 产品代码
      pageing: 0 , // 是否分页
    }).then((ret = {}) => {
      const { code = 0, records = [],total = 0 } = ret;
      if (code > 0) {
        this.setState({
          TableData: records,
          loading: false,
          total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        loading: false,
      });
    });
  }

  // 成交流水理财--table
  fetchFinanAcount = () => {
    this.setState({
      loading: true,
    });
    QueryProfitfinanAcount({
      accnNo: this.props.customerCode, // 客户号
      productType: this.state.cpType2, // 产品类型
      pageNo: this.state.current,
      pageSize: this.state.pagesize ,
      beginDate: this.state.beginDate,// 开始时间
      endDate: this.state.endDate, // 结束时间
      istotal: this.state.isSearchType, // 明细/汇总   1 明细 2汇总
      servicetype: this.state.businessType2,// 业务类型
      productCode: this.state.inputValue2, // 产品代码
    }).then((ret = {}) => {
      const { code = 0, records = [],total = 0 } = ret;
      if (code > 0) {
        this.setState({
          TableData: records,
          loading: false,
          total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        loading: false,
      });
    });
  }

  // 成交流水期权账户--table
  fetchOptionAcount = () => {
    this.setState({

      loading: true,
    });
    QueryProfitOptionAcount({
      accnNo: this.props.customerCode, // 客户号
      contractCode: this.state.inputValueHeyue2 , // 合约代码
      pageNo: this.state.current,
      pageSize: this.state.pagesize ,
      beginDate: Number(this.state.beginDate) ,// 开始时间
      endDate: Number(this.state.endDate) , // 结束时间
      istotal: this.state.isSearchType, // 明细/汇总   1 明细 2汇总
      optionType: this.state.qiquanType2, // 期权类型
      buyWay: this.state.dealType2, // 买卖类别
    }).then((ret = {}) => {
      const { code = 0, records = [],total = 0 } = ret;
      if (code > 0) {
        this.setState({
          TableData: records,
          loading: false,
          total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        loading: false,
      });
    });
  }
    // 翻页
    pageChange = (value) => {
      const { accountType2 } = this.state;
      console.log(accountType2,'??????????');
      this.setState({ current: value }, () => {
        if(accountType2 === 1 || accountType2 === null || accountType2 === undefined){

          this.fetchAllAccountTable();
        }
        if(accountType2 === 2 || accountType2 === 3 ){
          this.fetchProfitNormalAcount();
        }
        if(accountType2 === 4 ){
          this.fetchFinanAcount();
        }
        if(accountType2 === 5 ){
          this.fetchOptionAcount();
        }
      });
    }
    // 改变每页展示条数
    handlePageSizeChange = (current, pagesize) => {
      const { accountType2 } = this.state;
      this.setState({ current: 1, pagesize }, () => {
        if(accountType2 === 1 ){
          this.fetchAllAccountTable();
        }
        if(accountType2 === 2 || accountType2 === 3 ){
          this.fetchProfitNormalAcount();
        }
        if(accountType2 === 4 ){
          this.fetchFinanAcount();
        }
        if(accountType2 === 5 ){
          this.fetchOptionAcount();
        }
      });
    }

    // 全部-月表头
    getColumnMonth=()=>[
      {
        title: '月份',
        dataIndex: 'profitDate',
        key: 'profitDate',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          // console.log(record,'按时多看哈数据的哈三六九等');
          return <div title = {record.profitDate} > { record.profitDate || '--'} </div>;
        },
      },
      {
        title: '总交易量',
        dataIndex: 'totalProfit',
        key: 'totalProfit',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.totalProfit} > { record.totalProfit || '--'} </div>;
        },
      },

      {
        title: '普通账户交易量',
        dataIndex: 'normalProfit',
        key: 'normalProfit',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.normalProfit} > { record.normalProfit || '--'} </div>;
        },
      },
      {
        title: '信用账户交易量',
        dataIndex: 'creditProfit',
        key: 'creditProfit',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.creditProfit} > { record.creditProfit || '--'} </div>;
        },
      },
      {
        title: '理财账户交易量',
        dataIndex: 'finanProfit',
        key: 'finanProfit',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.finanProfit} > { record.finanProfit || '--'} </div>;
        },
      },
      {
        title: '期权账户交易量',
        dataIndex: 'optionProfit',
        key: 'optionProfit',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.optionProfit} > {record.optionProfit || '--'} </div>;
        },
      },
      {
        title: '基金投顾账户交易量',
        dataIndex: 'fundProfit',
        key: 'fundProfit',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.fundProfit} > {record.fundProfit || '--'} </div>;
        },
      },
    ]
    // 全部-日表头
    getColumnday=()=>[
      {
        title: '日期',
        dataIndex: 'profitDate',
        key: 'profitDate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.profitDate} > { record.profitDate || '--'} </div>;
        },
      },
      {
        title: '总交易量',
        dataIndex: 'totalProfit',
        key: 'totalProfit',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.totalProfit} > { record.totalProfit || '--'} </div>;
        },
      },

      {
        title: '普通账户交易量',
        dataIndex: 'normalProfit',
        key: 'normalProfit',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.normalProfit} > { record.normalProfit || '--'} </div>;
        },
      },
      {
        title: '信用账户交易量',
        dataIndex: 'creditProfit',
        key: 'creditProfit',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.creditProfit} > { record.creditProfit || '--'} </div>;
        },
      },
      {
        title: '理财账户交易量',
        dataIndex: 'finanProfit',
        key: 'finanProfit',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.finanProfit} > { record.finanProfit || '--'} </div>;
        },
      },
      {
        title: '期权账户交易量',
        dataIndex: 'optionProfit',
        key: 'optionProfit',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.optionProfit} > { record.optionProfit || '--'} </div>;
        },
      },
      {
        title: '基金投顾账户交易量',
        dataIndex: 'fundProfit',
        key: 'fundProfit',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.fundProfit} > {record.fundProfit || '--'} </div>;
        },
      },
      // TODO=========>>>>
    ]
    // 普通
    getColumnCommonCredit = () => [
      {
        title: '成交日期',
        dataIndex: 'sucessDate',
        key: 'sucessDate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.sucessDate} > {record.sucessDate || '--'} </div>;
        },
      },
      {
        title: '交易类别',
        dataIndex: 'profitType',
        key: 'profitType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.profitType} > { record.profitType === '买入' ? <text style={{ color: '#EF5A3C ' }}>买入</text> : record.profitType === '卖出' ? <text style={{ color: '#3A7BEC ' }}>卖出</text> : record.profitType !== '' ? record.profitType : '--' } </div>;
        },
      },
      {
        title: '证券代码',
        dataIndex: 'productCode',
        key: 'productCode',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productCode} > { record.productCode || '--'} </div>;
        },
      },
      {
        title: '证券名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productName} > { record.productName || '--'} </div>;
        },
      },
      {
        title: '委托类型',
        dataIndex: 'way',
        key: 'way',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.way} > { record.way || '--'} </div>;
        },
      },
      {
        title: '成交价格',
        dataIndex: 'sucessPrice',
        key: 'sucessPrice',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.sucessPrice} > { record.sucessPrice || '--'} </div>;
        },
      },
      {
        title: '成交数量',
        dataIndex: 'sucessNumber',
        key: 'sucessNumber',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.sucessNumber} > { record.sucessNumber || '--'} </div>;
        },
      },
      {
        title: '成交金额',
        dataIndex: 'sucessMonth',
        key: 'sucessMonth',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.sucessMonth} > { record.sucessMonth || '--'} </div>;
        },
      },
      {
        title: '佣金',
        dataIndex: 'commission',
        key: 'commission',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.commission} > {record.commission || '--'} </div>;
        },
      },
      {
        title: '佣金率',
        dataIndex: 'commissionRate',
        key: 'commissionRate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.commissionRate} > { record.commissionRate || '--'} </div>;
        },
      },
      {
        title: '操作类型',
        dataIndex: 'operatorType',
        key: 'operatorType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.operatorType} > { record.operatorType || '--'} </div>;
        },
      },
    ]
    // 信用账户
    getColumnCredit2 = () => [
      {
        title: '成交日期',
        dataIndex: 'sucessDate',
        key: 'sucessDate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.sucessDate} > {record.sucessDate || '--'} </div>;
        },
      },
      {
        title: '交易类别',
        dataIndex: 'profitType',
        key: 'profitType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.profitType} > { record.profitType === '买入' ? <text style={{ color: '#EF5A3C ' }}>买入</text> : record.profitType === '卖出' ? <text style={{ color: '#3A7BEC ' }}>卖出</text> : record.profitType !== '' ? record.profitType : '--' } </div>;
        },
      },
      {
        title: '证券代码',
        dataIndex: 'productCode',
        key: 'productCode',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productCode} > { record.productCode || '--'} </div>;
        },
      },
      {
        title: '证券名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productName} > { record.productName || '--'} </div>;
        },
      },
      {
        title: '委托类型',
        dataIndex: 'way',
        key: 'way',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.way} > { record.way || '--'} </div>;
        },
      },
      {
        title: '成交价格',
        dataIndex: 'sucessPrice',
        key: 'sucessPrice',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.sucessPrice} > { record.sucessPrice || '--'} </div>;
        },
      },
      {
        title: '成交数量',
        dataIndex: 'sucessNumber',
        key: 'sucessNumber',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.sucessNumber} > { record.sucessNumber || '--'} </div>;
        },
      },
      {
        title: '成交金额',
        dataIndex: 'sucessMonth',
        key: 'sucessMonth',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.sucessMonth} > { record.sucessMonth || '--'} </div>;
        },
      },
      {
        title: '佣金',
        dataIndex: 'commission',
        key: 'commission',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.commission} > {record.commission || '--'} </div>;
        },
      },
      {
        title: '佣金率',
        dataIndex: 'commissionRate',
        key: 'commissionRate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.commissionRate} > { record.commissionRate || '--'} </div>;
        },
      },
      {
        title: '操作类型',
        dataIndex: 'operatorType',
        key: 'operatorType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.operatorType} > {record.operatorType || '--'} </div>;
        },
      },
    ]

    // 理财
    getColumnMoney = () => [
      {
        title: '委托日期',
        dataIndex: 'sucessDate',
        key: 'sucessDate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.sucessDate} > {record.sucessDate || '--'} </div>;
        },
      },
      {
        title: '确认日期',
        dataIndex: 'confirmationDate',
        key: 'confirmationDate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.confirmationDate} > { record.confirmationDate || '--'} </div>;
        },
      },
      {
        title: '产品类型',
        dataIndex: 'productType',
        key: 'productType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productType} > { record.productType || '--'} </div>;
        },
      },
      {
        title: '产品代码',
        dataIndex: 'productCode',
        key: 'productCode',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productCode} > { record.productCode || '--'} </div>;
        },
      },
      {
        title: '产品简称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.productName} > {record.productName || '--'} </div>;
        },
      },
      {
        title: '业务类型',
        dataIndex: 'serviceType',
        key: 'serviceType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.serviceType} > { record.serviceType || '--'} </div>;
        },
      },
      {
        title: '购买份额',
        dataIndex: 'purchaseShare',
        key: 'purchaseShare',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.purchaseShare} > { record.purchaseShare || '--'} </div>;
        },
      },
      {
        title: '购买金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.amount} > {record.amount || '--'} </div>;
        },
      },
      {
        title: '手续费',
        dataIndex: 'charge',
        key: 'charge',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.charge} > { record.charge || '--'} </div>;
        },
      },
      {
        title: '金融机构代码',
        dataIndex: 'institutionCode',
        key: 'institutionCode',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.institutionCode} > { record.institutionCode || '--'} </div>;
        },
      },
      {
        title: '金融机构名称',
        dataIndex: 'institutionName',
        key: 'institutionName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.institutionName} > { record.institutionName || '--'} </div>;
        },
      },
    ]

    // 期权
    getColumnqiquan = () => [
      {
        title: '成交日期',
        dataIndex: 'closingDate',
        key: 'closingDate',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.closingDate} > {record.closingDate || '--'} </div>;
        },
      },
      {
        title: '证券名称',
        dataIndex: 'securitiesName',
        key: 'securitiesName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.securitiesName} > { record.securitiesName || '--'} </div>;
        },
      },

      {
        title: '合约',
        dataIndex: 'contract',
        key: 'contract',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.contract} > { record.contract || '--'} </div>;
        },
      },
      {
        title: '期权类型',
        dataIndex: 'optionType',
        key: 'optionType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.optionType} > { record.optionType || '--'} </div>;
        },
      },
      {
        title: '交易类型',
        dataIndex: 'profitType',
        key: 'profitType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.profitType} > { record.profitType || '--'} </div>;
        },
      },
      {
        title: '成交数量',
        dataIndex: 'number',
        key: 'number',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.number} > { record.number || '--'} </div>;
        },
      },
      {
        title: '成交价格',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.price} > { record.price || '--'} </div>;
        },
      },
      {
        title: '成交金额',
        dataIndex: 'mount',
        key: 'mount',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title = {record.mount} > { record.mount || '--'} </div>;
        },
      },
    ]

    // 汇总 普通/信用
    getTotalOne = () => [
      {
        title: '证券代码',
        dataIndex: 'productCode',
        key: 'productCode',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.productCode || '--'} </div>;
        },
      },
      {
        title: '证券名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.productName || '--'} </div>;
        },
      },
      {
        title: '成交数量',
        dataIndex: 'sucessNumber',
        key: 'sucessNumber',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.sucessNumber || '--'} </div>;
        },
      },
      {
        title: '成交金额',
        dataIndex: 'sucessMonth',
        key: 'sucessMonth',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.sucessMonth || '--'} </div>;
        },
      },
      {
        title: '佣金',
        dataIndex: 'commission',
        key: 'commission',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.commission || '--'} </div>;
        },
      },
    ]
    // 理财
    getTotalTwo = () => [
      {
        title: '产品简称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.productName || '--'} </div>;
        },
      },
      {
        title: '购买份额',
        dataIndex: 'purchaseShare',
        key: 'purchaseShare',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.purchaseShare || '--'} </div>;
        },
      },
      {
        title: '购买金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.amount || '--'} </div>;
        },
      },
      {
        title: '手续费',
        dataIndex: 'charge',
        key: 'charge',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.charge || '--'} </div>;
        },
      },
    ]
    // 期权
    getTotalThree = () => [
      {
        title: '证券名称',
        dataIndex: 'securitiesName',
        key: 'securitiesName',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.securitiesName || '--'} </div>;
        },
      },
      {
        title: '期权类型',
        dataIndex: 'optionType',
        key: 'optionType',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.optionType || '--'} </div>;
        },
      },
      {
        title: '成交数量',
        dataIndex: 'number',
        key: 'number',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.number || '--'} </div>;
        },
      },
      {
        title: '成交价格',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={text} > {record.price || '--'} </div>;
        },
      },
    ]

     // 生成uuid
     guid = () => {
      const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
       return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
     }

      getColumns = (params1,params2,params3) => { // params:账户类型 ,按月还是按日 ,查阅方式
        // 全部 -月
        if(params1 === 1 && params2 === 1){
          return this.getColumnMonth();
        }
        //  全部 -日
        if(params1 === 1 && params2 === 2){
          return this.getColumnday();
        }
        //  普通 -汇总
        if(params1 === 2 && params3 === 1){
          return this.getColumnCommonCredit();
        }
        //  信用 -汇总
        if(params1 === 3 && params3 === 1){
          return this.getColumnCredit2();
        }
        //  普通/信用 -明细
        if((params1 === 2 || params1 === 3 ) && params3 === 2){
          return this.getTotalOne();
        }
        //  理财 -汇总
        if((params1 === 4 ) && params3 === 1){
          return this.getColumnMoney();
        }
        //  理财 -明细
        if((params1 === 4 ) && params3 === 2){
          return this.getTotalTwo();
        }
        //  期权 -汇总
        if((params1 === 5 ) && params3 === 1){
          return this.getColumnqiquan();
        }
        //  期权 -明细
        if((params1 === 5 ) && params3 === 2){
          return this.getTotalThree();
        }
      }
     // 导出功能
     export = () => {
       newClickSensors({
         third_module: "交易",
         ax_page_name: "成交流水",
         ax_button_name: "成交流水导出次数"
       });
       const { isAccountClick,isMonth,isSearchType } = this.props;
       const { current,pagesize,beginDate,endDate,customerCode,accountType, jyType2,inputValue2,cpType2,businessType2,inputValueHeyue2,qiquanType2,dealType2 } = this.state;
       const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
       const action = isAccountClick === 1 ? getSucessWatertListExport : isAccountClick === 2 || isAccountClick === 3 ? getProfitNormalListExport : isAccountClick === 4 ? getProfitfinanListExport : isAccountClick === 5 ? getProfitOptionListListExport : '' ;
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
           let columns = _this.getColumns(isAccountClick,isMonth,isSearchType);
           //  let columns = _this.getColumns();
           let tableHeaderCodes = columns.map(item => item.dataIndex);
           tableHeaderCodes = tableHeaderCodes.join(',');
           let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key);
           headerInfo = headerInfo.join(',');
           // 查询条件
           let getAchievementAnalysisModel = {};
           if(isAccountClick === 1){
             getAchievementAnalysisModel = {
               accnNo: _this.props.customerCode, // 客户号
               monthOrday: isMonth.toString() === '1' ? '2' : '1' , // 按月/按日
               pageNo: current,
               pageSize: pagesize ,
               beginDate: beginDate,// 开始时间
               endDate: endDate, // 结束时间
             };
           }
           if(isAccountClick === 2 || isAccountClick === 3){
             getAchievementAnalysisModel = {
               accnNo: _this.props.customerCode, // 客户号
               accountType: (accountType - 1).toString(), // 账户类型  0普通 1信用
               pageNo: current,
               pageSize: pagesize ,
               beginDate: beginDate,// 开始时间
               endDate: endDate, // 结束时间
               istotal: isSearchType.toString(), // 明细/汇总   1 明细 2汇总
               type: jyType2.toString(), // 交易类别   0|全部；1|买入;2|卖出;3|转托管; 999|其它
               productCode: inputValue2, // 产品代码
               pageing: 0 , // 是否分页
             };
           }
           if(isAccountClick === 4){
             getAchievementAnalysisModel = {
               accnNo: _this.props.customerCode, // 客户号
               productType: cpType2, // 产品类型
               pageNo: current,
               pageSize: pagesize ,
               beginDate: beginDate,// 开始时间
               endDate: endDate, // 结束时间
               istotal: isSearchType, // 明细/汇总   1 明细 2汇总
               servicetype: businessType2,// 业务类型
               productCode: inputValue2, // 产品代码
             };
           }
           if(isAccountClick === 5){
             getAchievementAnalysisModel = {
               accnNo: _this.props.customerCode, // 客户号
               contractCode: inputValueHeyue2 , // 合约代码
               pageNo: current,
               pageSize: pagesize ,
               beginDate: beginDate,// 开始时间
               endDate: endDate, // 结束时间
               istotal: isSearchType, // 明细/汇总   1 明细 2汇总
               optionType: qiquanType2, // 期权类型
               buyWay: dealType2, // 买卖类别
             };
           }
           //  console.log(getAchievementAnalysisModel,'getAchievementAnalysisModelgetAchievementAnalysisModel');
           debugger;
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

     render() {
       const { isMonth, isAccountClick, isSearchType, CopyaccountType,isJustForMonthDayTable } = this.props;
       const { current ,pagesize, total,TableData,loading } = this.state;
       TableData.forEach((item, index) => {
         item['key'] = ((current - 1) * pagesize) + index + 1;
       });
       return (
         <Fragment>
           <div className={styles.list}>
             <div className={styles.listTitle}>
               <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>成交流水</div>
               <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
             </div>
             <Divider style={{ margin: '0 0 16px 0' }}></Divider>
             {/* 有按月Or按日 */}
             {
               isJustForMonthDayTable ? (
                 <BasicDataTable
                   rowKey='key'
                   loading={loading}
                   style={{ marginBottom: '10px' }}
                   className={`${styles.table} m-Card-Table`}
                   dataSource={TableData}
                   columns={isMonth === 1 ? this.getColumnMonth() : this.getColumnday()}
                   pagination={{
                     className: `${styles.pagination} ${styles.smallPagination}`,
                     size: 'small',
                     showSizeChanger: true,
                     showQuickJumper: true,
                     hideOnSinglePage: false,
                     pageSize: pagesize,
                     // showTotal: v => `共${v}条`,
                     defaultCurrent: 1,
                     total: Number(total),
                     onChange: this.pageChange,
                     onShowSizeChange: this.handlePageSizeChange,
                     current,
                     pageSizeOptions: ['10', '20', '50', '100'],
                     showTitle: true,
                   }}
                   // scroll={{ x: true, y: true }}
                 />
               ) : (
                 <Fragment>
                   {/* 1:明细  2:汇总 */}
                   {
                     isSearchType === 1 && (
                       <BasicDataTable
                         rowKey='key'
                         loading={loading}
                         style={{ marginBottom: '10px' }}
                         className={`${styles.table} m-Card-Table`}
                         dataSource={TableData}
                         columns={isAccountClick === 1 ? this.getColumnday() : isAccountClick === 2 ? this.getColumnCommonCredit() : isAccountClick === 3 ? this.getColumnCredit2() : isAccountClick === 4 ? this.getColumnMoney() : isAccountClick === 5 ? this.getColumnqiquan() : null}
                         pagination={{
                           size: "small",
                           className: `${styles.pagination} ${styles.smallPagination}`,
                           showQuickJumper: true,
                           pageSize: pagesize,
                           showSizeChanger: true,
                           defaultCurrent: 1,
                           total: Number(total),
                           onChange: this.pageChange,
                           onShowSizeChange: this.handlePageSizeChange,
                           current,
                           pageSizeOptions: ['10', '20', '50', '100'],
                           showTitle: true,
                         }}
                       />
                     ) }
                   {
                     isSearchType === 2 && (
                       <BasicDataTable
                         rowKey='key'
                         loading={loading}
                         style={{ marginBottom: '10px' }}
                         className={`${styles.table} m-Card-Table`}
                         dataSource={TableData}
                         columns={isAccountClick === 2 || isAccountClick === 3 ? this.getTotalOne() : isAccountClick === 4 ? this.getTotalTwo() : this.getTotalThree()}
                         pagination={{
                           size: "small",
                           className: `${styles.pagination} ${styles.smallPagination}`,
                           hideOnSinglePage: false,
                           showQuickJumper: true,
                           pageSize: pagesize,
                           showSizeChanger: true,
                           defaultCurrent: 1,
                           total: Number(total),
                           onChange: this.pageChange,
                           onShowSizeChange: this.handlePageSizeChange,
                           current,
                           pageSizeOptions: ['10', '20', '50', '100'],
                           showTitle: true,
                         }}
                       />
                     )
                   }

                 </Fragment>
               )
             }
             <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />

           </div>
         </Fragment>
       );
     }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Commontable);
