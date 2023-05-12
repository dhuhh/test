import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { Redirect, routerRedux } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
// import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import MyCustomer from '../../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/FirstPage';
// import List from '../../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/CustomerList';
import translateStr from '../../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/translateStr';
import CusGroupManage from '../cusGroupManage';
import ObjectUtils from '../../../../../utils/objectUtils';
import NList from '../../../../../components/WorkPlatForm/MainPage/Customer/nList';

const khfwMap = {
  myCustomerRole: { name: '我的客户', key: '1', color: 'blue' },
  teamCustomerRole: { name: '团队客户', key: '2', color: 'pink' },
  departmentCustomerRole: { name: '营业部客户', key: '3', color: 'orange' },
};

class CustomerListFirstPage extends React.Component {
  constructor(props) {
    super(props);
    const { authorities, userBasicInfo = {} } = props;
    this.khfwDatas = [];
    if (Reflect.has(authorities, 'myCustomerRole')) {
      this.khfwDatas.push(khfwMap.myCustomerRole);
    }
    if (Reflect.has(authorities, 'teamCustomerRole')) {
      this.khfwDatas.push(khfwMap.teamCustomerRole);
    }
    if (Reflect.has(authorities, 'departmentCustomerRole')) {
      this.khfwDatas.push(khfwMap.departmentCustomerRole);
    }
    // if (this.khfwDatas.length === 0) {
    //   this.khfwDatas.push(khfwMap.myCustomerRole);
    // }
    const isCheckSysRoleType = localStorage.getItem('homepageCheckSysRoleType') === '1';
    // 默认tab展示
    let defaultCusQueryType = '1';
    if (isCheckSysRoleType) { // 根据角色来
      const { jsxz = '' } = userBasicInfo;
      // 默认展示什么tab(5.6营业部   4团队   其他个人)
      if (jsxz === '5' || jsxz === '6') {
        defaultCusQueryType = '3';
      } else if (jsxz === '4') {
        defaultCusQueryType = '2';
      }
    } else {  // 根据权限点来
      defaultCusQueryType = (this.khfwDatas.length > 0 ? lodash.get(this.khfwDatas, '[0].key', '') : '');
    }
    this.state = {
      params: { // 参数
        isSearch: true, // 是否要用接口的条件 否的话只拿历史记录的列
        customerQueryType: defaultCusQueryType, // 用户角色
        selectValue: '证券代码',
        stockCode: '', // 股票代码
        customerGroups: '', // 客户群
        customerGroupsTitles: '', // 客户群名称
        customerTags: '', // 客户标签
        customerTagTitles: '', // 客户标签
        financialProductCode: '', // 产品代码
        keyword: '',
        logicOrCondition: [], // 高级筛选
        quickOrCondition: [],
        logicOrConditionStr: '', // 高级筛选翻译字段
        cxfy: '', // 翻译字段
        totalAssetsEnd: '', // 总资产上限
        totalAssetsStart: '', // 总资产下限
        departmentIds: [],
        gxyybDatas: [], // 管辖营业部数据
        departmentsIds: '',
        commonSearchTags: [{ // 常用搜索
          key: 0,
          label: '常用搜索',
          tags: [] },
        {
          key: 1,
          label: '系统推荐方案',
          tags: [] },
        {
          key: 2,
          label: '我保存的方案',
          tags: [],
        },
        ],
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    const { authorities = [] } = nextProps;
    if (!ObjectUtils.shallowEqual(this.props.authorities, nextProps.authorities)) {
      // 查询客户范围
      if (Reflect.has(authorities, 'myCustomerRole')) {
        this.khfwDatas.push(khfwMap.myCustomerRole);
      }
      if (Reflect.has(authorities, 'teamCustomerRole')) {
        this.khfwDatas.push(khfwMap.teamCustomerRole);
      }
      if (Reflect.has(authorities, 'departmentCustomerRole')) {
        this.khfwDatas.push(khfwMap.departmentCustomerRole);
      }
      const { params = {} } = this.state;
      this.setState({
        params: {
          ...params,
          customerQueryType: this.khfwDatas.length > 0 ? this.khfwDatas[0].key : '', // 用户角色
        },
      });
    }
  }
  handleSearch = (value) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    const paramsObj = {
      ...params,
      ...value,
    };
    paramsObj.cxfy = translateStr(paramsObj);
    const datasClone = lodash.cloneDeep(paramsObj || params);
    this.setState({
      // params: paramsObj,
      datasClone,
    }, () => { dispatch(routerRedux.push('/myCustomer/nList')); });
  };

  nlListClear = () => {
    const { params } = this.state;
    this.setState({
      datasClone: params,
    });
  }

  render() {
    const { dispatch, match, myCustomer, authorities, dictionary, userBusinessRole, userBasicInfo, location } = this.props;
    const { params, datasClone } = this.state;
    const { url: parentUrl } = match;
    // 客户列表必须要customerQueryType才能渲染 一大票的接口得靠这个入参 必须等权限接口调用完了才能渲染
    if (!params.customerQueryType) {
      return null;
    }
    return (
      <CacheSwitch>
        <CacheRoute path={`${parentUrl}/index`} exact render={() => <MyCustomer userBusinessRole={userBusinessRole} authorities={authorities} handleSearch={this.handleSearch} dispatch={dispatch} {...myCustomer} />} />
        <CacheRoute path={`${parentUrl}/cusGroupManage`} render={() => <CusGroupManage nlListClear={this.nlListClear} match={match} location={location} userBusinessRole={userBusinessRole} authorities={authorities} handleSearch={this.handleSearch} dispatch={dispatch} userBasicInfo={userBasicInfo} {...myCustomer} />} />
        <CacheRoute path={`${parentUrl}/cusDynamic/:tabKey`} render={props => <MyCustomer {...props} userBusinessRole={userBusinessRole} authorities={authorities} handleSearch={this.handleSearch} dispatch={dispatch} {...myCustomer} />} />
        {/* <CacheRoute path={`${parentUrl}/list`} exact render={() => <List handleSearch={this.handleSearch} userBasicInfo={userBasicInfo} userBusinessRole={userBusinessRole} authorities={authorities} dictionary={dictionary} {...myCustomer} params={this.params} dispatch={dispatch} />} />
        <CacheRoute path={`${parentUrl}/customerList/:faid/:falx`} render={props => <List {...props} handleSearch={this.handleSearch} userBasicInfo={userBasicInfo} userBusinessRole={userBusinessRole} authorities={authorities} dictionary={dictionary} {...myCustomer} params={this.params} dispatch={dispatch} />} />
        <CacheRoute path={`${parentUrl}/customerList/:faid`} render={props => <List {...props} handleSearch={this.handleSearch} userBasicInfo={userBasicInfo} userBusinessRole={userBusinessRole} authorities={authorities} dictionary={dictionary} {...myCustomer} params={this.params} dispatch={dispatch} />} /> */}
        <CacheRoute path={`${parentUrl}/nList`} exact render={props => <NList {...props} khfwDatas={this.khfwDatas} userBasicInfo={userBasicInfo} userBusinessRole={userBusinessRole} authorities={authorities} dictionary={dictionary} {...myCustomer} params={datasClone || params} dispatch={dispatch} nlListClear={this.nlListClear} />} />
        <CacheRoute path={`${parentUrl}/nList/:faid/:falx`} exact render={props => <NList {...props} khfwDatas={this.khfwDatas} userBasicInfo={userBasicInfo} userBusinessRole={userBusinessRole} authorities={authorities} dictionary={dictionary} {...myCustomer} params={datasClone || params} dispatch={dispatch} nlListClear={this.nlListClear} />} />
        <CacheRoute path={`${parentUrl}/nList/:faid`} exact render={props => <NList {...props} khfwDatas={this.khfwDatas} userBasicInfo={userBasicInfo} userBusinessRole={userBusinessRole} authorities={authorities} dictionary={dictionary} {...myCustomer} params={datasClone || params} dispatch={dispatch} nlListClear={this.nlListClear} />} />
        <Redirect to={`${parentUrl}/nList`} />
      </CacheSwitch>
    );
  }
}
export default connect(({ myCustomer, global }) => ({
  myCustomer,
  authorities: global.authorities,
  userBusinessRole: global.userBusinessRole,
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(CustomerListFirstPage);
