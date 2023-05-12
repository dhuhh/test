import React from 'react';
import InformationUpdateLogSearchForm from './form';
import InformationUpdateLogDataList from './list';

class InformationUpdateLog extends React.Component {
  render() {
    return (
      <div>
        <InformationUpdateLogSearchForm />
        <InformationUpdateLogDataList />
      </div>
    );
  }
}

export default InformationUpdateLog;
