import React from 'react';
import { connect } from 'dva';
import PerformanceAnalysis from '../../../../../components/WorkPlatForm/MainPage/IncidentialServices/PerformanceAnalysis';

class PerformanceAnalysisPage extends React.Component {
  render() {
    const { dictionary } = this.props;
    return <PerformanceAnalysis dictionary={dictionary} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(PerformanceAnalysisPage);
