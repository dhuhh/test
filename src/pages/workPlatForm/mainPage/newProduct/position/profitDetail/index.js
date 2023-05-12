import React from 'react';
import ProfitDetail from '$components/WorkPlatForm/MainPage/NewProduct/Position/ProfitDetail';

export default function(props) {
  let { match: { params: { customerCode = '' } }, location: { state = {} } } = props;
  if (!customerCode) {
    const { query: { customerCode: cusNo = '' } } = location;
    customerCode = cusNo;
  }
  return <ProfitDetail customerCode={customerCode} state={state} />;
}