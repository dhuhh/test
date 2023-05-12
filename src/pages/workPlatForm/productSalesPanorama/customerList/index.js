import React, { Component } from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { message } from 'antd';
import CustomerList from '../../../../components/WorkPlatForm/ProductSalesPanorama/CustomerList';
import { Scrollbars } from 'react-custom-scrollbars';
import { QueryUserPermission } from '$services/newProduct';
class CustomerListIndex extends Component {
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
    // console.log('props', this.props);
    const { queryType = '', customerType = '', cpid = '', authorities } = this.props;
    const pdId = cpid;
    return (
      <div style={{ height: 'calc(100vh)' }}>
        {/* <Scrollbars autoHide style={{ width: '100%' }} > */}
        <CustomerList teamPmsn={this.state.teamPmsn} authorities={authorities} queryType={queryType} customerType={customerType} pdId={pdId} />
        {/* </Scrollbars> */}
      </div>
    );
  }
}
export default connect(({ productSalesPanorama, global }) => ({
  cusMoreInfo: productSalesPanorama.cusMoreInfo,
  authorities: global.authorities,
}))(CustomerListIndex);
