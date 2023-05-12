import React, { Component } from 'react';
import { message } from 'antd';
import lodash from 'lodash';
import ManageCusList from '../../../../../../components/WorkPlatForm/MainPage/NewProduct/FinancialProducts/ManageCusList';
import { connect } from 'dva';
import { QueryUserPermission } from '$services/newProduct';

class index extends Component {
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
    const { location: { pathname = '/1', state: { scene = '1' } = {} }, authorities = {} } = this.props;
    const activeKey = pathname.substr(pathname.lastIndexOf('/') + 1) === 'cusList' ? '1' : '2';
    return (
      <div>
        <ManageCusList teamPmsn={this.state.teamPmsn} authorities={authorities} activeKey={activeKey} scene={scene} />
      </div>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(index);
