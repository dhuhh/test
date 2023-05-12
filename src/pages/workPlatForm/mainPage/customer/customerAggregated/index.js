import React from 'react';
import { connect } from 'dva';
import { Tabs, message } from 'antd';
// import { routerRedux } from 'dva/router';
import { DecryptBase64, EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { fetchOperationLog } from '../../../../../services/basicservices/index';
import { ptlx } from '../../../../../utils/config';
import NewTransactionFlowStatisticsComponent from '../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/TransactionFlowStatistics';
import NewTransactionFlowSearchComponent from '../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/TransactionFlowSearch';
import NewPositionSearchComponent from '../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/PositionSearch';
import NewPositionStatisticsComponent from '../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/PositionStatistics';
import NewCapitalFlowSearchComponent from '../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/CapitalFlowSearch';
import NewCapitalFlowStatisticsComponent from '../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/CapitalFlowStatistics';
import { NewBasicStatistics } from '../../../../../components/WorkPlatForm/MainPage/Customer/CustomerAggregated';
import ComprehensiveQuery from '../../../../../components/WorkPlatForm/MainPage/Customer/CustomerAggregated/ComprehensiveQuery';

class CustomerAggregated extends React.Component {
  constructor(props){
    super(props);
    const { match: { params: { queryParams = '' } } } = props;
    const params = this.getParams(queryParams);
    let tempType = '3';
    if (params) {
      const { queryParameter = {} } = params;
      const { customerQueryType = '' } = queryParameter;
      if (`${customerQueryType}` === '1' || `${customerQueryType}` === '2') {
        tempType = '1';
      } else if (`${customerQueryType}` === '3') {
        tempType = '2';
      } else {
        tempType = '3';
      }
    }
    this.state = {
      tempType,
      total: 0,
    }
  }
  // componentDidMount() {
  //   const { match: { params: { queryParams = '' } } } = this.props;
  //   const params = this.getParams(queryParams);
  //   let tempType = '3';
  //   if (params) {
  //     const { queryParameter = {} } = params;
  //     const { customerQueryType = '' } = queryParameter;
  //     if (`${customerQueryType}` === '1' || `${customerQueryType}` === '2') {
  //       tempType = '1';
  //     } else if (`${customerQueryType}` === '3') {
  //       tempType = '2';
  //     } else {
  //       tempType = '3';
  //     }
  //   }
  //   // this.fetchAuthority(tempType);
  // }
  getParams = (str) => {
    if (str === '' || str === 'workplateform') {
      return '';
    }
    let params = null;
    try {
      // 把base64格式的变成字符串
      const parseStr = DecryptBase64(str);
      // 字符串转JSON格式
      params = JSON.parse(parseStr);
    } catch (error) {
      message.error('未知错误,无法查看客户汇总信息');
    }
    return params;
  }
  // fetchAuthority = (type) => { // 查询权限
  //   const { dispatch } = this.props;
  //   // 查询出的权限集
  //   let roleList = ['transactionFlowSearch', 'transactionFlowStatistics', 'positionSearch', 'positionStatistics', 'basicStatistics'];
  //   //
  //   const { match: { params: { queryParams = '' } } } = this.props;
  //   if (Array.isArray(roleList) && roleList.length > 0) {
  //     if (type === '1') { // 我的客户，团队客户情况
  //       roleList = roleList.filter((item) => { return item !== 'basicStatistics'; });
  //       dispatch(routerRedux.push(`/customerAggregated/${roleList[0]}/${queryParams}`));
  //     } else if (type === '2') { // 营业部客户
  //       roleList = ['basicStatistics'];
  //       dispatch(routerRedux.push(`/customerAggregated/${roleList[0]}/${queryParams}`));
  //     } else {
  //       dispatch(routerRedux.push(`/customerAggregated/${roleList[0]}/workplateform`));
  //     }
  //   }
  // }
  handleTabsChange = (key) => {
    // const { dispatch, params = {} } = this.props;
    // const { type } = this.state;
    // if (type === '3') {
    //   dispatch(routerRedux.push(`/customerAggregated/${key}/workplateform`));
    // } else {
    //   // 将查询条件base64加密
    //   const paramsStr = JSON.stringify(params);
    //   const queryParams = EncryptBase64(paramsStr);
    //   this.setState({
    //     key,
    //   });
    //   dispatch(routerRedux.push(`/customerAggregated/${key}/${queryParams}`));
    // }

    let czdx = '';
    let name = '';
    if (key === 'transactionFlowSearch') {
      czdx = '5023';
      name = '交易流水查询';
      this.changeCount(this.transactionFlowSearch);
    } else if (key === 'transactionFlowStatistics') {
      czdx = '5024';
      name = '交易流水统计';
      this.changeCount(this.transactionFlowStatistics);
    } else if (key === 'positionSearch') {
      czdx = '5025';
      name = '持仓查询';
      this.changeCount(this.positionSearch);
    } else if (key === 'positionStatistics') {
      czdx = '5026';
      name = '持仓统计';
      this.changeCount(this.positionStatistics);
    } else if (key === 'capitalflowSearch') {
      czdx = '5027';
      name = '资金流水查询';
      this.changeCount(this.capitalflowSearch);
    } else if (key === 'capitalflowStatistics') {
      czdx = '5028';
      name = '资金流水统计';
      this.changeCount(this.capitalflowStatistics);
    } else if(key === 'basicStatistics'){
      this.changeCount(this.basicStatistics);
    } else if(key === 'comprehensiveQuery'){
      this.changeCount(this.comprehensiveQuery);
    }
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    fetchOperationLog({
      czdx,
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: `查看：数据统计|${name}`,
      ip,
      ptlx,
    });
  };
  getCusCount = (customerCount) => {
    this.setState({
      total: customerCount,
    });
  }
  changeCount = (refObj) =>{
    if(refObj){
      const { customerCount } = refObj.state;
      this.setState({
        total: customerCount,
      })
    }
  }
  // 查询权限
  getActivekey = (tempType, authorities) => {
    const { transactionFlowInquery, transactionFlowStatistics, positionQuery, positionStatistics, fundFlowInquery, fundFlowStatistics, basicIndexStatistics, integratedQuery } = authorities;
    let roleList = [];
    if(transactionFlowInquery){
      roleList.push('transactionFlowSearch');
    }
    if(transactionFlowStatistics){
      roleList.push('transactionFlowStatistics');
    }
    if(positionQuery){
      roleList.push('positionSearch');
    }
    if(positionStatistics){
      roleList.push('positionStatistics');
    }
    if(fundFlowInquery){
      roleList.push('capitalflowSearch');
    }
    if(fundFlowStatistics){
      roleList.push('capitalflowStatistics');
    }
    if(basicIndexStatistics){
      roleList.push('basicStatistics');
    }
    if(integratedQuery){
      roleList.push('comprehensiveQuery');
    }
   
    let tabkey = '';
    if (Array.isArray(roleList) && roleList.length > 0) {
      if (tempType === '1') { // 我的客户，团队客户情况
        roleList = roleList.filter((item) => { return item !== 'basicStatistics'; });
        tabkey = roleList[0];
      } else if (tempType === '2') { // 营业部客户
        roleList = basicIndexStatistics ? ['basicStatistics'] : roleList;
        tabkey = roleList[0];
      } else {
        tabkey = roleList[0];
      }
    }
    return tabkey;
  }
  render() {
    // return <div style={{ margin: '2rem', textAlign: 'center' }}><Spin size="large" /></div>;
    const { dispatch, dictionary, authorities, match: { params: { queryParams = '' } }} = this.props;
    const { transactionFlowInquery, transactionFlowStatistics, positionQuery, positionStatistics, fundFlowInquery, fundFlowStatistics, basicIndexStatistics, integratedQuery } = authorities;
    const { tempType } = this.state;
    let tempParams = {};
    if (queryParams !== '') {
      const params = this.getParams(queryParams) || {};
      tempParams = params;
    }
    const { selectedCount = 0 } = tempParams;
    const tabkey = this.getActivekey(tempType, authorities);
    return(
      <div style={{marginTop: '.5rem'}}>
        <Tabs style={{ background: '#fff' }} defaultActiveKey={tabkey} onChange={this.handleTabsChange} className="m-tabs-underline m-tabs-underline-small" tabBarExtraContent={<div className="m-tabs-right">客户数：<span className="pink fwb">{this.state.total || selectedCount}</span></div>}>
        {
        // Array.isArray(transactionFlowInquery) && 
        (
        <Tabs.TabPane tab="交易流水查询" key="transactionFlowSearch">
          <NewTransactionFlowSearchComponent ref={(c) => { this.transactionFlowSearch = c; }} isSkip={queryParams !== 'workplateform'} getCusCount={this.getCusCount} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} transactionFlowInquery={transactionFlowInquery} />
        </Tabs.TabPane>
        )}
        {
        // Array.isArray(transactionFlowStatistics) && 
        (
        <Tabs.TabPane tab="交易流水统计" key="transactionFlowStatistics">
          <NewTransactionFlowStatisticsComponent ref={(c) => { this.transactionFlowStatistics = c; }} isSkip={queryParams !== 'workplateform'} getCusCount={this.getCusCount} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} transactionFlowStatistics={transactionFlowStatistics} />
        </Tabs.TabPane>
        )}
        {
        // Array.isArray(positionQuery) && 
        (
        <Tabs.TabPane tab="持仓查询" key="positionSearch">
          <NewPositionSearchComponent ref={(c) => { this.positionSearch = c; }} isSkip={queryParams !== 'workplateform'} getCusCount={this.getCusCount} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} positionQuery={positionQuery} />
        </Tabs.TabPane>
        )}
        {
        // Array.isArray(positionStatistics) && 
        (
        <Tabs.TabPane tab="持仓统计" key="positionStatistics">
          <NewPositionStatisticsComponent ref={(c) => { this.positionStatistics = c; }} isSkip={queryParams !== 'workplateform'} getCusCount={this.getCusCount} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} positionStatistics={positionStatistics} />
        </Tabs.TabPane>
        )}
        {
        // Array.isArray(fundFlowInquery) && 
        (
        <Tabs.TabPane tab="资金流水查询" key="capitalflowSearch">
          <NewCapitalFlowSearchComponent ref={(c) => { this.capitalflowSearch = c; }} isSkip={queryParams !== 'workplateform'} getCusCount={this.getCusCount} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} fundFlowInquery={fundFlowInquery} />
        </Tabs.TabPane>)}
        {
        // Array.isArray(fundFlowStatistics) && 
        (
        <Tabs.TabPane tab="资金流水统计" key="capitalflowStatistics">
          <NewCapitalFlowStatisticsComponent ref={(c) => { this.capitalflowStatistics = c; }} isSkip={queryParams !== 'workplateform'} getCusCount={this.getCusCount} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} fundFlowStatistics={fundFlowStatistics} />
        </Tabs.TabPane>)}
        {
        // Array.isArray(basicIndexStatistics) && 
        (
        <Tabs.TabPane tab="基础指标统计" key="basicStatistics">
          <NewBasicStatistics ref={(c) => { this.basicStatistics = c; }} isSkip={queryParams !== 'workplateform'} type={tempType} getCusCount={this.getCusCount} dispatch={dispatch} params={tempParams} dictionary={dictionary} basicIndexStatistics={basicIndexStatistics} />
        </Tabs.TabPane>
        )}
        {
        // Array.isArray(integratedQuery) && 
        (
        <Tabs.TabPane tab="综合查询" key="comprehensiveQuery">
          <ComprehensiveQuery ref={(c) => { this.comprehensiveQuery = c; }} isSkip={queryParams !== 'workplateform'} type={tempType} getCusCount={this.getCusCount} dispatch={dispatch} params={tempParams} dictionary={dictionary} integratedQuery={integratedQuery} />
        </Tabs.TabPane>
        )}
      </Tabs>
      </div>
      
    )
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
  userBusinessRole: global.userBusinessRole,
}))(CustomerAggregated);
