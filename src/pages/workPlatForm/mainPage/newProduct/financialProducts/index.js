import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { message } from 'antd';
// import { Row, Card, Col, Tabs, Affix, Spin } from 'antd';
// import SalesPane from '../../../../../components/WorkPlatForm/MainPage/NewProduct/FinancialProducts/ProductList/SalesPane';
import DataList from '../../../../../components/WorkPlatForm/MainPage/NewProduct/FinancialProducts/ProductList/DataList';
import { QueryUserPermission } from '../../../../../services/newProduct';

class FinancialProduct extends React.Component {
  state = {
    teamPmsn: '0', // 团队权限 0|无权限 1|有权限
  }
  componentDidMount = () => {
    this.fetchUserTeamPermission();
  }
  fetchUserTeamPermission = () => {
    QueryUserPermission().then((res) => {
      const { records = [] } = res;
      const teamPmsn = lodash.get(records, '[0].teamPmsn', '0');
      this.setState({ teamPmsn });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { location: { pathname = '' }, dictionary = {}, allProductDisplayColumns = [], authorities = {} , userBasicInfo, routeTabKey = '' } = this.props;
    // 根据路由判断展示的页面
    const showActiveKey = pathname.substr(pathname.lastIndexOf('/') + 1);
    return (
      <React.Fragment>
        {/**销售面板 */}
        {/* <SalesPane teamPmsn={this.state.teamPmsn} authorities={authorities} /> */}
        {/**金融理财产品列表 */}
        <DataList showActiveKey={showActiveKey} routeTabKey={routeTabKey} teamPmsn={this.state.teamPmsn} authorities={authorities} dictionary={dictionary} allProductDisplayColumns={allProductDisplayColumns} userBasicInfo={userBasicInfo}/>
      </React.Fragment>
    );
  }

}
export default connect(({ global, newFinancialProducts }) => ({
  dictionary: global.dictionary,
  allProductDisplayColumns: newFinancialProducts.allProductDisplayColumns,
  authorities: global.authorities,
  userBasicInfo: global.userBasicInfo,
}))(FinancialProduct);
