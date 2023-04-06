import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import PerateManagement from '@/components/WorkPlatform/MainPage/OperationCenter/OperationalCalendar';

function OperationalCalendar(props) {
  return (
    <PerateManagement {...props} />
  );
}
export default withRouter(connect(({ global }) => ({
  authorities: global.authorities,
  userBusinessRole: global.userBusinessRole,
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(OperationalCalendar));
