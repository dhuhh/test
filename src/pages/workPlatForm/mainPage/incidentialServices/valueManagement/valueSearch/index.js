import React from 'react';
import { connect } from 'dva';
import ValueSearch from '../../../../../../components/WorkPlatForm/MainPage/IncidentialServices/ValueManagement/ValueSearch/';

class ValueSearchPage extends React.Component {
  render() {
    const { dictionary, authorities ,location: { query: { zdlx = '0' } } } = this.props;
    return <ValueSearch dictionary={dictionary} authorities={authorities} zdlx={zdlx}/>;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(ValueSearchPage);
