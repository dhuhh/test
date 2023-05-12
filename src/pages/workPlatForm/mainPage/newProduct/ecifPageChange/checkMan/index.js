import React from 'react';
import CheckMan from '$components/WorkPlatForm/MainPage/NewProduct/EcifPageChange/CheckMan';

export default function (props) {
  const { match: { params = {} }, location: { state = {} } } = props;
  const { customerCode = '' } = params || {};
  return <CheckMan customerCode={customerCode} state={state} />;
}


