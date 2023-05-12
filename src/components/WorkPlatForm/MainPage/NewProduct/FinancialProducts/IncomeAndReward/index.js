import React from 'react';
import SearchForm from './SearchForm';
import SearchTabs from './SearchTabs';
import { message, Row, Spin } from 'antd';
import { FetchQueryIncomeAndRewardList, QueryStatisticalCycle,FetchQueryOwnershipDetail } from '$services/newProduct';
import { FetchQueryProductType } from '$services/newProduct';
import { connect } from 'dva';
import moment from 'moment';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';

class IncomeAndReward extends React.Component {
  state = {
    selectKey: '1', 
    department: '', // 营业部
    departments: [], // 营业部数据
    statPeriodData: [], // 统计周期数据
    statRealationData: [], // 统计关系数据
    staticalRelation: '12||0', // 统计关系
    staticalPeriodStartTime: '', // 统计周期开始时间
    staticalPeriodEndTime: '', // 统计周期结束时间
    productMajorType: '', // 产品大类
    productSubType: '', // 产品子类
    transactionBehavior: '', // 交易行为
    pageNo: 1, // 页码
    pageSize: 20, // 页长
    sort: [{}], // 排序
    loading: true,
    exportLoading: false,
    dataSource: [], // 列表数据
    count: 0, // 列表数据量
    summary: [], // 统计数据
    cycleValue: '本月', // 统计周期值
    relateValue: '', // 统计关系值
    departmentValue: '', // 营业部值
    productCode: '', // 产品代码 --保有明细
    statisticalPeriod: moment().format('yyyyMM'), // 统计周期--保有明细 默认本月
    cpdl: '', //产品大类 --保有明细
    cpxl: '' , //产品子类 --保有明细
    cpdlDate: [], //产品大类字典 --保有明细
    cpxlDate: [], //产品子类字典 --保有明细
    allYyb: [],
  }

  componentDidMount() {
    this.getStatisticalCycle();
    this.getDepartments();
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.activeKey !== this.props.activeKey) && this.props.activeKey === 'revenueRewards') {
      this.getStatisticalCycle(true);
    }
  }

  // 字典数据排序
  sortArr = (array) => {
    return [...array].sort((a, b) => {
      return a.ibm - b.ibm;
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

  // 获取统计周期
  getStatisticalCycle = (flag = false) => {
    QueryStatisticalCycle().then((result) => {
      const { records = [] } = result;
      const temp = records.find((item) => item.dispDate === '本月');
      this.setState({
        statPeriodData: records,
        staticalPeriodStartTime: temp?.strtDate,
        staticalPeriodEndTime: temp?.endDate,
      });
      
      if (!flag) {
        this.fetchData();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleSelectKey = (e, params = {}, isReset = false) => {
    this.setState({
      selectKey: e,
      department: params.hasOwnProperty('department') ? params.department : this.state.department,
      sort: [{}],
    });
    if (isReset) {
      this.fetchData({
        key: e,
        ...params,
      });
    } else {
      this.fetchData({
        key: e,
        sort: [{}],
      });
    }
  }

  // 点击全部导出时获取总数据量
  getTotalCount = () => {
    this.setState({
      exportLoading: true,
    });
    const temp = this.state.statPeriodData.find((item) => item.dispDate === this.state.cycleValue);
    const payload = {
      department: this.state.department,
      productMajorType: this.state.productMajorType,
      productSubType: this.state.productSubType,
      productTypeConditionModels: [
        {
          "builder": {},
          "esCode": "",
          "esValue": "",
          "type": 0,
        },
      ],
      // sort: this.state.sort,
      staticalPeriodEndTime: this.state.staticalPeriodEndTime || temp?.endDate,
      staticalPeriodStartTime: this.state.staticalPeriodStartTime || temp?.strtDate,
      staticalRelation: '',
      transactionBehavior: this.state.transactionBehavior,
    };
    const p1 = FetchQueryIncomeAndRewardList({
      dimension: 1, // 汇总
      pagerModel: {
        builder: {},
        pageNo: 1,
        pageSize: 10,
      },
      sort: Number(this.state.selectKey) === 1 ? this.state.sort : [{}],
      ...payload,
    });
    const p2 = FetchQueryIncomeAndRewardList({
      dimension: 2, // 明细
      pagerModel: {
        builder: {},
        pageNo: 1,
        pageSize: 10,
      },
      sort: Number(this.state.selectKey) === 2 ? this.state.sort : [{}],
      ...payload,
    });
    const p3 = FetchQueryIncomeAndRewardList({
      dimension: 3, // 按人员
      pagerModel: {
        builder: {},
        pageNo: 1,
        pageSize: 10,
      },
      sort: Number(this.state.selectKey) === 3 ? this.state.sort : [{}],
      ...payload,
    });
    const p4 = FetchQueryIncomeAndRewardList({
      dimension: 4, // 按产品
      pagerModel: {
        builder: {},
        pageNo: 1,
        pageSize: 10,
      },
      sort: Number(this.state.selectKey) === 4 ? this.state.sort : [{}],
      ...payload,
    });
    return Promise.all([p1,p2,p3,p4]);
  }

  fetchData = ( p = {} ) => {
    if(p.key === '5'){
      this.getFetchQueryOwnershipDetail(p);
      
    }else{
      this.setState({
        loading: true,
      });
      const temp = this.state.statPeriodData.find((item) => item.dispDate === this.state.cycleValue);
      const pageNo = p.pageNo || this.state.pageNo,
        pageSize = p.pageSize || this.state.pageSize;
      const payload = {
        department: p.hasOwnProperty('department') ? p.department : this.state.department,
        productMajorType: p.hasOwnProperty('productMajorType') ? p.productMajorType : this.state.productMajorType,
        productSubType: p.hasOwnProperty('productSubType') ? p.productSubType : this.state.productSubType,
        productTypeConditionModels: [
          {
            "builder": {},
            "esCode": "",
            "esValue": "",
            "type": 0,
          },
        ],
        sort: p.sort || this.state.sort,
        staticalPeriodEndTime: p.staticalPeriodEndTime || this.state.staticalPeriodEndTime || temp?.endDate,
        staticalPeriodStartTime: p.staticalPeriodStartTime || this.state.staticalPeriodStartTime || temp?.strtDate,
        staticalRelation: p.key === '3' ? (p.hasOwnProperty('staticalRelation') ? p.staticalRelation : this.state.staticalRelation ) : '',
        transactionBehavior: p.hasOwnProperty('transactionBehavior') ? p.transactionBehavior : this.state.transactionBehavior,
      };
      FetchQueryIncomeAndRewardList({
        dimension: Number(p.key || this.state.selectKey),
        pagerModel: {
          builder: {},
          pageNo,
          pageSize,
        },
        ...payload,
      }).then((res) => {
        const { count = 0, data = [], summary = [] } = res;
        let result = [];
        data.forEach((item, index) => {
          const temp = JSON.parse(JSON.stringify(item));
          temp['no'] = ((pageNo - 1) * pageSize) + (index + 1) + '';
          result.push(temp);
        });
        this.setState({
          dataSource: result,
          summary,
          count,
          loading: false,
        });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }
  // 获取大类 子类 保有明细
  getFetchQueryProductType = (p = {}) =>{

    const statisticalPeriod = p.hasOwnProperty('statisticalPeriod') ? p.statisticalPeriod : this.state.statisticalPeriod;
    const department = p.hasOwnProperty('department') ? p.department : this.state.department ;
    const productCode = p.hasOwnProperty('productCode') ? p.productCode : this.state.productCode ;

    let payload = {
      pageLength: 0, // 页数
      pageNo: 0, //是否分页
      paging: '1',
      current: '',
      pageSize: '' ,
      department, // 营业部
      productCode, // 产品代码
      sort: '', //排序
      statisticalPeriod, // 统计周期
      cpdlDate: [],
      cpxlDate: [],
      total: -1,
      totalRows: 0 ,
    };
    Promise.all([
      FetchQueryProductType( { cplx: '1' ,...payload }),
      FetchQueryProductType( { cplx: '2' , ...payload }),
    ]).then(res=>{
      const [res1, res2 ] = res;
      const { records: records1 = [] } = res1;
      const { records: records2 = [] } = res2;
      this.setData({ cpdlDate: records1 , cpxlDate: records2 });
    });

  }

  getFetchQueryOwnershipDetail=(p = {})=>{
    
    this.setState({
      loading: true,
    });
    const pageNo = p.pageNo || this.state.pageNo;
    const pageSize = p.pageSize || this.state.pageSize;
    const sort = p.sort ;
    const statisticalPeriod = p.hasOwnProperty('statisticalPeriod') ? p.statisticalPeriod : this.state.statisticalPeriod;
    const department = p.hasOwnProperty('department') ? p.department : this.state.department ;
    const productCode = p.hasOwnProperty('productCode') ? p.productCode : this.state.productCode ;
    const cpdl = p.hasOwnProperty('cpdl') ? p.cpdl : this.state.cpdl ;
    const cpxl = p.hasOwnProperty('cpxl') ? p.cpxl : this.state.cpxl ;

    let sortRule = '' ;
    if(sort && Object.keys(sort[0])[0]){
      // 字段与排序规则间要多加个空格
      sortRule = 'JYSR.' + Object.keys(sort[0])[0].toUpperCase() + ' ' + Object.values(sort[0])[0].toUpperCase() ;
    }
    let payload = {
      pageLength: 0, // 页数
      pageNo: 0, //是否分页
      paging: '1',
      current: pageNo,
      pageSize: pageSize ,
      cpdl, //产品大类 
      cpxl, //产品子类 
      department, // 营业部
      productCode, // 产品代码
      sort: sortRule, //排序
      statisticalPeriod, // 统计周期
      total: -1,
      totalRows: 0 ,
    };
    
    this.getFetchQueryProductType(p);
    FetchQueryOwnershipDetail(payload).then(res=>{
      const { records = [] , total = 0 } = res;

      let result = [];
      records.forEach((item, index) => {
        const temp = JSON.parse(JSON.stringify(item));
        temp['no'] = ((pageNo - 1) * pageSize) + (index + 1) + '';
        result.push(temp);
      });
      this.setState({
        dataSource: result,
        loading: false,
        count: total, 
      });

    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleTableChange = (pageNo, pageSize, sort) => {
    this.fetchData({
      key: this.state.selectKey,
      pageNo,
      pageSize,
      sort,
    });
    this.setState({
      sort,
    });
  }

  setData = (obj) => {
    this.setState(obj);
  }

  render () {
    const { department = '', productMajorType = '', productSubType = '', transactionBehavior = '', staticalRelation = '', sort = [{}], 
      relateValue, cycleValue, selectKey, exportLoading = false, loading = true, departments = [], statPeriodData = [], dataSource = [], summary = [], count = 0 , productCode , statisticalPeriod , cpdlDate , cpxlDate ,cpdl , cpxl } = this.state;
      
    const { dictionary: { SRJL_TJGX = [] }, authorities = {}, sysParam = [] } = this.props;
    let incomeAndRewardListModel = {};
    if (statPeriodData.length) {
      const temp = statPeriodData.find(item => item.dispDate === cycleValue);
      incomeAndRewardListModel = {
        department,
        dimension: Number(selectKey),
        staticalPeriodStartTime: temp?.strtDate,
        staticalPeriodEndTime: temp?.endDate,
        productMajorType,
        productSubType,
        transactionBehavior,
        staticalRelation: selectKey === '3' ? staticalRelation : '',
        sort,
      };
    }
    let ownershipDetailModel = {} ;
    ownershipDetailModel = { 
      pageLength: 0, // 页数
      pageNo: 0, //是否分页
      paging: '1',
      current: '',
      pageSize: '' ,
      department, // 营业部
      productCode, // 产品代码
      cpdl, //产品大类 
      cpxl, //产品子类 
      sort: '', //排序
      statisticalPeriod, // 统计周期
      total: -1,
      totalRows: 0 ,
    };
    return (
      <Spin spinning={exportLoading}>
        <Row style={{ background: '#fff' }}>
          <SearchForm handleSelectKey={this.handleSelectKey} department={department} relateValue={relateValue} cycleValue={cycleValue} fetchData={this.fetchData} setData={this.setData} departments={departments} statPeriodData={statPeriodData} statRealationData={this.sortArr(SRJL_TJGX)} selectKey={selectKey} allYyb={this.state.allYyb}></SearchForm>
          <SearchTabs sysParam={sysParam} getTotalCount={this.getTotalCount} cycleValue={cycleValue} fetchData={this.fetchData} setData={this.setData} incomeAndRewardListModel={incomeAndRewardListModel} selectKey={selectKey} handleTableChange={this.handleTableChange} authorities={authorities} handleSelectKey={this.handleSelectKey} dataSource={dataSource} summary={summary} count={count} loading={loading} ownershipDetailModel={ownershipDetailModel} cpxlDate={cpxlDate} cpdlDate={cpdlDate}></SearchTabs>
        </Row>
      </Spin>
    );
  }

}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
  sysParam: global.sysParam,
}))(IncomeAndReward);