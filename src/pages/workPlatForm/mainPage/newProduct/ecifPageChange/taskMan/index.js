import React from 'react';
import TaskMan from '$components/WorkPlatForm/MainPage/NewProduct/EcifPageChange/TaskMan';

export default function (props) {
  const { match: { params = {} }, location: { state = {} } } = props;
  const { customerCode = '' } = params || {};
  return <TaskMan customerCode={customerCode} state={state} />;
}


