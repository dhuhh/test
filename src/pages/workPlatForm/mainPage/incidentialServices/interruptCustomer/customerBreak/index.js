import React from 'react';
import { connect } from 'dva';
import CustomerBreak from '../../../../../../components/WorkPlatForm/MainPage/IncidentialServices/InterruptCustomer/CustomerBreak/';

class CustomerBreakPage extends React.Component {
  render() {
    const { dictionary, match: { params: { queryParams } } } = this.props;
    return <CustomerBreak queryParams={queryParams} dictionary={dictionary} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(CustomerBreakPage);
