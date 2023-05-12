import React from 'react';
import DealListDetail from '$components/WorkPlatForm/MainPage/NewProduct/Work/DataList/DealListDetail';

export default function (props) {
  const { match: { params: { customerCode = '' } }, location: { state = {} } } = props;
  return <DealListDetail customerCode={customerCode} state={state} />;
}


