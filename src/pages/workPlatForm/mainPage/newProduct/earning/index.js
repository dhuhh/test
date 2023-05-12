import React from 'react';
import EarningComponent from '$components/WorkPlatForm/MainPage/NewProduct/Earning';

export default function Earning(props) {
  let { match: { params: { customerCode = '' } = {} } = {}, location } = props;
  if (!customerCode) {
    const { query: { customerCode: cusNo = '' } } = location;
    customerCode = cusNo;
  }
  return <EarningComponent customerCode={customerCode} />;
}