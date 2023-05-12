import React from 'react';
import { Row, Card, Checkbox, Divider, message, Tabs } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { FetchMyLastSearchScheme } from '../../../../../../../services/newProduct';
import SearchForm from './SearchForm';
import OperateBar from './OperateBar';
import TableContent from './TableContent';
import WealthCusList from '../../ManageCusList/WealthCusList';
import InvestSearch from '../../ManageCusList/InvestSearch';
import IncomeAndReward from '../../IncomeAndReward';
import SalesRevenue from '../../SalesRevenue';
import ProductAppointment from '../../ProductAppointment';
import RevenueRewardsUpload from '../../RevenueRewardsUpload';
import { addSensors } from '$components/WorkPlatForm/MainPage/NewProduct/Work/util.js';
import styles from '../index.less';

class DataList extends React.Component {
  state = {
    isSearchTermsLoaded: false, // 条件是否加载完成，加载完成之后再查询列表，防止条件加载改变payload导致列表接口重复调用
    payload: {
      excludeFunds: false, // 是否剔除货币基金：true剔除，false不剔除
      attrConditionModels: [],
      fieldsCode: [],
      pagerModel: {
        pageNo: 1,
        pageSize: 20,
      },
      productState: '1', // 产品状态
      customerType: '12', // 客户类型
      queryType: '1', // 查询类型 1个人；2团队；3营业部
      sort: [], // { "product_transmit.transmit_date.last_week": "desc" }
    },
    summary: [],
    count: 0, //产品总数
    activeKey: 'allProducts', // 默认选中tab productAppointment  allProducts revenueRewards
  }

  componentDidMount() {
    const { payload: { queryType = '', productState = '1' } } = this.state;
    this.fetchData({ queryType, productState });
    addSensors('全部产品');
  }

  componentWillUpdate(_, nextState) {
    const { payload: { queryType: preKey = '', productState: preProductState } } = this.state;
    const { payload: { queryType: aftKey = '', productState: aftProductState } } = nextState;
    if (preKey !== aftKey || preProductState !== aftProductState) {
      this.fetchData({ queryType: aftKey, productState: aftProductState });
    }
  }

  fetchData = (props) => {
    const { queryType = '', productState = '1' } = props;
    const { payload = {} } = this.state;
    if (this.tableContent) this.tableContent.setState({ loading: true });
    // 查找选中列
    FetchMyLastSearchScheme({
      srchScene: queryType,
      srchCond: productState,
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        const [data] = records;
        const { dispIdx = '' } = data; // dispIdx列信息
        let fieldsCode = dispIdx.split(',');
        fieldsCode = fieldsCode.map(m => m.split('|')[0]);
        this.handleFormChange({ fieldsCode });
        if (this.tableContent) {
          this.tableContent.fetchData({ ...payload, fieldsCode, queryType, productState });
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleFormChange = (p, callback) => {
    const { payload = {} } = this.state;
    this.setState({
      payload: {
        ...payload,
        ...p,
      },
    }, () => {
      if (callback) {
        callback();
      }
    });
  }

  handleSetCount = (count) => {
    this.setState({ count });
  }

  handleSummaryChange = (value) => {
    this.setState({ summary: value });
  }

  changeIsSearchTermsLoaded = (flag) => {
    this.setState({ isSearchTermsLoaded: flag });
  }

  handleExcludeFundsChange = (e) => {
    const checked = _.get(e, 'target.checked', false);
    this.handleFormChange({ excludeFunds: checked });
  }

  renderTab = (tabString, tabKey) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ lineHeight: '58px' }}>{tabString}</div>
        <div style={{ visibility: tabKey === this.state.activeKey ? 'visible' : 'hidden' }} className={styles.tabsInkBar}></div>
      </div>
    );
  }

  render() {
    const { payload = {}, isSearchTermsLoaded = false, summary = [], count } = this.state;
    const { dictionary = {}, allProductDisplayColumns = [], sysParam, teamPmsn = '0', authorities = {} , userBasicInfo = {}, showActiveKey, routeTabKey } = this.props;
    const { excludeFunds = false } = payload;
    const { incomeReward = [], productPanorama: productPanoramaAuth = [] , productAppointment = [] } = authorities;

    const map = {
      allProducts: '全部产品',
      financialCustomer: '理财客户',
      salesRevenue: '销量与创收',
      investment: '定投合约查询',
      revenueRewards: '收入与奖励',
    };
    return (
      <React.Fragment>
        <Row>
          <Card
            className="ax-card"
            // title={<span className="ax-card-title">金融理财产品列表</span>}
            // extra={<Checkbox className='m-select-checkbox m-circle-checkb' checked={excludeFunds} onChange={this.handleExcludeFundsChange}>剔除货基/天利宝/证金宝/新户理财</Checkbox>}
            bodyStyle={{ paddingBottom: 0, paddingTop: 0, minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}
          >
            { // 全部产品(showActiveKey为路由传参，routeTabKey为组件传参（PageRouteTab组件用于展示金融产品C5页面）)
              (showActiveKey === 'allProducts' || routeTabKey === 'allProducts') && (
                <>
                  {/* 查询表单 */}
                  <SearchForm handleExcludeFundsChange={this.handleExcludeFundsChange} excludeFunds={excludeFunds} count={count} teamPmsn={teamPmsn} authorities={this.props.authorities} ref={(e) => { this._searchForm = e; }} payload={payload} handleFormChange={this.handleFormChange} changeIsSearchTermsLoaded={this.changeIsSearchTermsLoaded} />
                  {/* 分隔 */}
                  <Divider style={{ background: '#eaeef2', margin: '20px 0' }} />
                  {/* 操作行 */}
                  <OperateBar authorities={this.props.authorities} dictionary={dictionary} allProductDisplayColumns={allProductDisplayColumns} payload={payload} handleFormChange={this.handleFormChange} summary={summary} count={count} />
                  {/* 列表 */}
                  {
                    isSearchTermsLoaded && <TableContent getInstence={(_this) => { this.tableContent = _this; }} sysParam={sysParam} allProductDisplayColumns={allProductDisplayColumns} payload={payload} handleFormChange={this.handleFormChange} handleSummaryChange={this.handleSummaryChange} handleSetCount={this.handleSetCount} searchFormRef={this._searchForm} />
                  }
                </>
              )
            }
            { // 理财客户
              productPanoramaAuth.includes('lckhlb') && (showActiveKey === 'financialCustomer' || routeTabKey === 'financialCustomer') && (
                <WealthCusList authorities={authorities} teamPmsn={teamPmsn} scene='1' />
              )
            }
            { // 销量与创收
              (showActiveKey === 'salesRevenue' || routeTabKey === 'salesRevenue' ) && (
                <SalesRevenue authorities={authorities} teamPmsn={teamPmsn} scene='1' />
              )
            }
            { // 定投合约查询
              productPanoramaAuth.includes('dtcx') && (showActiveKey === 'investment' || routeTabKey === 'investment') && (
                <InvestSearch authorities={authorities} teamPmsn={teamPmsn} scene='1' />
              )
            }
            { // 收入与奖励
              incomeReward.includes('sfzs') && (showActiveKey === 'revenueRewards' || routeTabKey === 'revenueRewards') && (
                <IncomeAndReward activeKey={this.state.activeKey} authorities={authorities} />
              )
            }
            { // 收入与奖励上传
              incomeReward.includes('sc') && (showActiveKey === 'revenueRewardsUpload' || routeTabKey === 'revenueRewardsUpload') && (
                <RevenueRewardsUpload />
              )
            }
            { // 产品预约查询
              productAppointment.includes('view') && (showActiveKey === 'productAppointment' || routeTabKey === 'productAppointment') && (
                <ProductAppointment userBasicInfo={userBasicInfo} />
              )
            }
            {/* <Tabs className={styles.tabs} activeKey={this.state.activeKey} onChange={activeKey => { this.setState({ activeKey }); addSensors(map[activeKey]); }}>
              <Tabs.TabPane tab={this.renderTab('全部产品', 'allProducts')} key='allProducts'>
                // 查询表单
                <SearchForm handleExcludeFundsChange={this.handleExcludeFundsChange} excludeFunds={excludeFunds} count={count} teamPmsn={teamPmsn} authorities={this.props.authorities} ref={(e) => { this._searchForm = e; }} payload={payload} handleFormChange={this.handleFormChange} changeIsSearchTermsLoaded={this.changeIsSearchTermsLoaded} />
                // 分隔
                <Divider style={{ background: '#eaeef2', margin: '20px 0' }} />
                // 操作行
                <OperateBar authorities={this.props.authorities} dictionary={dictionary} allProductDisplayColumns={allProductDisplayColumns} payload={payload} handleFormChange={this.handleFormChange} summary={summary} count={count} />
                // 列表
                {
                  isSearchTermsLoaded && <TableContent getInstence={(_this) => { this.tableContent = _this; }} sysParam={sysParam} allProductDisplayColumns={allProductDisplayColumns} payload={payload} handleFormChange={this.handleFormChange} handleSummaryChange={this.handleSummaryChange} handleSetCount={this.handleSetCount} searchFormRef={this._searchForm} />
                }
              </Tabs.TabPane>
              {productPanoramaAuth.includes('lckhlb') && (
                <Tabs.TabPane tab={this.renderTab('理财客户', 'financialCustomer')} key='financialCustomer'>
                  <WealthCusList authorities={authorities} teamPmsn={teamPmsn} scene='1' />
                </Tabs.TabPane>
              )}
              <Tabs.TabPane tab={this.renderTab('销量与创收', 'salesRevenue')} key='salesRevenue'>
                <SalesRevenue authorities={authorities} teamPmsn={teamPmsn} scene='1' />
              </Tabs.TabPane>
              { productPanoramaAuth.includes('dtcx') && (
                <Tabs.TabPane tab={this.renderTab('定投合约查询', 'investment')} key='investment'>
                  <InvestSearch authorities={authorities} teamPmsn={teamPmsn} scene='1' />
                </Tabs.TabPane>
              )}
              { incomeReward.includes('sfzs') && (
                <Tabs.TabPane tab={this.renderTab('收入与奖励', 'revenueRewards')} key='revenueRewards'>
                  <IncomeAndReward activeKey={this.state.activeKey} authorities={authorities} />
                </Tabs.TabPane>
              )}
              { incomeReward.includes('sc') && (
                <Tabs.TabPane tab={this.renderTab('收入与奖励上传', 'revenueRewardsUpload')} key='revenueRewardsUpload'>
                  <RevenueRewardsUpload />
                </Tabs.TabPane>
              )}
              { 
                productAppointment.includes('view') && (
                  <Tabs.TabPane tab={this.renderTab('产品预约查询', 'productAppointment')} key='productAppointment'>
                    <ProductAppointment userBasicInfo={userBasicInfo} />
                  </Tabs.TabPane>
                )
              }
            </Tabs> */}
          </Card>
        </Row>
      </React.Fragment>
    );
  }

}
export default connect(({ global }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  // userBasicInfo: global.userBasicInfo,
}))(DataList);
