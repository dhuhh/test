import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import BusinessWizardList from '@/components/WorkPlatform/MainPage/BusinessWizard';

class BusinessWizardPage extends React.Component {
  render() {
    const { location, match, dispatch, userBasicInfo, dictionary } = this.props;
    const { url } = match;
    const { pathname, search } = location;
    let type = '';
    if (search === '') {
      const searchs = pathname.substring(pathname.length, url.length + 2);
      type = searchs.substring(searchs.length - 1);
    } else {
      type = search.substring(search.length - 1, search.length);
    }
    return (
      <BusinessWizardList
        location={location}
        match={match}
        search={type}
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
}))(BusinessWizardPage));
