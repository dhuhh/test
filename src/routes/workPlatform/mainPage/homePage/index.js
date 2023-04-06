import React from 'react';
import { connect } from 'dva';
import HomePages from '@/components/WorkPlatform/MainPage/HomePage';

const HomePage = (props) => {
  return <HomePages {...props} />;
};

export default connect(({ global }) => ({
  authorities: global.authorities,
  userBusinessRole: global.userBusinessRole,
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  user: global.user,
}))(HomePage);

// import React from 'react';
// import { connect } from 'dva';
// import { withRouter } from 'dva/router';
// import HomePage from '@/components/WorkPlatform/MainPage/HomePage';

// class index extends React.Component {
//   render() {
//     const { match } = this.props;
//     const { url: parentUrl } = match;
//     return (
//       <HomePage {...this.props} parentUrl={parentUrl} />
//     );
//   }
// }
// export default withRouter(connect(({ global }) => ({
//   authorities: global.authorities,
//   userBusinessRole: global.userBusinessRole,
//   dictionary: global.dictionary,
//   userBasicInfo: global.userBasicInfo,
//   user: global.user,
// }))(index));

