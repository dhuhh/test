import React from 'react';
import { connect } from 'dva';
import ProdBreak from '../../../../../../components/WorkPlatForm/MainPage/IncidentialServices/InterruptCustomer/ProdBreak';

class ProdBreakPage extends React.Component {
  render() {
    const { dictionary, match: { params: { queryParams } } } = this.props;
    return <ProdBreak queryParams={queryParams} dictionary={dictionary} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(ProdBreakPage);
