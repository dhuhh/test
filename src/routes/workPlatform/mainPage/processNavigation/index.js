import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import ProcessNavigationList from '../../../../components/WorkPlatform/MainPage/ProcessNavigation';

class ProcessNavigationPage extends React.Component {
  render() {
    const { location, match, dispatch, userBasicInfo, dictionary } = this.props;
    return (
      <ProcessNavigationList
        location={location}
        match={match}
        dispatch={dispatch}
        userBasicInfo={userBasicInfo}
        dictionary={dictionary}
      />
    );
  }
}
export default withRouter(connect(({ global }) => ({
  authorities: global.authorities,
  userBusinessRole: global.userBusinessRole,
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(ProcessNavigationPage));
