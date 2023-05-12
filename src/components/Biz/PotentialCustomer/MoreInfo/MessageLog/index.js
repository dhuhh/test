import React from 'react';
import MessageLogSearchForm from './form';
import MessageLogDataList from './list';

class MessageLog extends React.Component {
  render() {
    return (
      <div>
        <MessageLogSearchForm />
        <MessageLogDataList />
      </div>
    );
  }
}

export default MessageLog;
