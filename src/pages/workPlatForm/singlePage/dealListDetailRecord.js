import React from 'react';
import DealListDetailRecord from '$components/WorkPlatForm/MainPage/NewProduct/Work/DataList/DealListDetailRecord';

export default function (props) {
  const { match: { params: { customerCode = '' } } } = props;
  return <DealListDetailRecord customerCode={customerCode}  />;
}


