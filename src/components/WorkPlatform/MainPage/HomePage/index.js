import React from 'react';
import { withRouter, Redirect } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import MessageCenterInfo from './MyUpcoming/MessageCenterInfo';
import HomePage from './HomePage';
// import MoreAnnouncements from './ProductAnnouncement/MoreAnnouncements';

function HomePages(props) {
  const { match } = props;
  const { url: parentUrl } = match;
  return (
    <CacheSwitch>
      <CacheRoute
        exact
        path={`${parentUrl}`}
        render={() => (<HomePage {...props} parentUrl={parentUrl} />)}
      />
      <CacheRoute
        exact
        path={`${parentUrl}/infoList`}
        render={() => (<MessageCenterInfo {...props} parentUrl={parentUrl} />)}
      />
      {/* <CacheRoute
        exact
        path={`${parentUrl}/moreAnnouncements`}
        render={() => (<MoreAnnouncements {...props} parentUrl={parentUrl} />)}
      /> */}
      <Redirect exact to={`${parentUrl}`} />
    </CacheSwitch>
  );
}

export default withRouter(HomePages);
