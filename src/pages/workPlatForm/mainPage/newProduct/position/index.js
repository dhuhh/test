import React from 'react';
import Position from '$components/WorkPlatForm/MainPage/NewProduct/Position';

export default function (props) {
  let { match: { params: { customerCode = '' } = {} } = {}, location } = props;
  if (!customerCode) {
    const { query: { customerCode: cusNo = '' } } = location;
    customerCode = cusNo;
  }

  return <Position customerCode={customerCode} />;
}