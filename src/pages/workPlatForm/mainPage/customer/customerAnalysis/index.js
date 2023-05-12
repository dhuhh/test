import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Tabs, message } from 'antd';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';
import Exception from '../../../../../components/Exception';
import Profile from '../../../../../components/WorkPlatForm/MainPage/Customer/CustomerAnalysis/x/Profile';
import GroupAnalysis from '../../../../../components/WorkPlatForm/MainPage/Customer/CustomerAnalysis/x/GroupAnalysis';
import AwkwardnessRank from '../../../../../components/WorkPlatForm/MainPage/Customer/CustomerAnalysis/x/AwkwardnessRank';
import TurnoverRank from '../../../../../components/WorkPlatForm/MainPage/Customer/CustomerAnalysis/x/TurnoverRank';
import { FetchLabelAnalysis } from '../../../../../services/customerdsc/index';

class CustomerAnalysis extends PureComponent {
  state = {
    cLoading: true,
    params: '',
    dataMap: {},
  }

  componentDidMount() {
    this.handleData();
  }

  getParams = (str) => {
    let params = null;
    try {
      // 把base64格式的变成字符串
      const parseStr = DecryptBase64(str);
      // 字符串转JSON格式
      params = JSON.parse(parseStr);
    } catch (error) {
      message.error('未知错误,无法查看数据汇总分析信息');
    }
    return params;
  }

  handleData = () => {
    const { match: { params: { queryParams = '' } } } = this.props;
    if (queryParams !== '') {
      const params = this.getParams(queryParams);
      if (params) {
        this.setState({ params });
        const { queryParameter = {}, selectedRowKeys = [], selectAll } = params;
        const { departmentIds = '' } = queryParameter;
        const payload = {
          ...queryParameter,
          status: '',
          isAllSel: selectAll ? 1 : 0,
          unSelectCuscodes: selectedRowKeys.join(','),
          departmentIds,
        };
        FetchLabelAnalysis({
          // ...payload,
          // bqfl: '',
          bqfl: '',
          lx: payload.lx,
          customerListBasicModel: {
            customerGroups: payload.customerGroups || '',
            customerGroupsTitles: payload.customerGroupsTitles || '',
            customerNos: payload.unSelectCuscodes.split(','),
            customerQueryType: payload.customerQueryType || '',
            customerTagTitles: payload.customerTagTitles || '',
            customerTags: payload.customerTags || '',
            departmentIds: payload.departmentIds || [],
            financialProductCode: payload.financialProductCode || '',
            keyword: payload.keyword || '',
            status: payload.status || '',
            stockCode: payload.stockCode || '',
            totalAssetsEnd: payload.totalAssetsEnd || '',
            totalAssetsStart: payload.totalAssetsStart || '',
            aggIndicators: payload.aggIndicators || [],
            attrConditionModels: payload.attrConditionModels || [],
          },
          customerListSeniorAndQuickModel: {
            logicOrCondition: payload.logicOrCondition || [],
            quickOrCondition: payload.quickOrCondition || [],
            // 高级筛选(标签/客群体系)新增入参
            logicAntiCondition: queryParameter.logicAntiCondition || {},
            tagsConditionAnti: queryParameter.tagsConditionAnti || [],
            tagsCondition: queryParameter.tagsCondition || [],
            peopleCondition: queryParameter.peopleCondition || [],
            peopleConditionAnti: queryParameter.peopleConditionAnti || [],
          },
          customerOptModel: {
            customerNos: payload.unSelectCuscodes.split(','),
            isAllSel: selectAll ? 1 : 0,
          },
        }).then((ret = {}) => {
          const { code = 0, records = [] } = ret;
          const dataMap = {};
          if (code > 0) {
            records.forEach((item) => {
              const key = item.khbq;
              if (!dataMap[key]) {
                dataMap[key] = {};
              }
              dataMap[key][item.bqz] = item;
            });
            // console.log(dataMap, 'dataMap');
            this.setState({
              cLoading: false,
              dataMap,
            });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
          this.setState({
            cLoading: false,
          });
        });
      } else {
        this.setState({ cLoading: false });
      }
    } else {
      this.setState({ cLoading: false });
    }
  }

  render() {
    const { cLoading = true, params = '', dataMap = {} } = this.state; // eslint-disable-line
    const { loading = true, bqData = {}, authorities: { customerList = [], cusListAnalysis = [] } } = this.props;
    // console.log(bqData,'bqData')
    const exportAuth = customerList.includes('AnalysisExport');
    if (loading || cLoading) {
      return <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />;
    } if (!params) {
      return <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />;
    }
    return (
      <Fragment>
        <Profile params={params} />
        <Tabs className="m-tabs-underline m-tabs-underline-small" style={{ background: '#fff', marginTop: '1.5rem' }}>
          {
            cusListAnalysis.includes('groupAnalysis') && <Tabs.TabPane key="groupAnalysis" tab="群体分析" style={{ background: '#edf1f4' }}>
              <GroupAnalysis bqData={bqData} dataMap={dataMap} params={params} />
            </Tabs.TabPane>
          }
          {
            cusListAnalysis.includes('heavyPositionRank') && <Tabs.TabPane key="awkwardnessRank" tab="个股重仓排行">
              <AwkwardnessRank exportAuth={exportAuth} params={params} />
            </Tabs.TabPane>
          }
          {
            cusListAnalysis.includes('transactionRank') && <Tabs.TabPane key="turnoverRank" tab="个股交易排行">
              <TurnoverRank exportAuth={exportAuth} params={params} />
            </Tabs.TabPane>
          }
        </Tabs>
      </Fragment>
    );
  }
}

export default connect(({ customerAnalysis, global }) => ({
  loading: customerAnalysis.loading,
  bqData: customerAnalysis.bqData,
  authorities: global.authorities,
}))(CustomerAnalysis);
