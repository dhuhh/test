import React from 'react';
import WorkComponent from '$components/WorkPlatForm/MainPage/NewProduct/CommonWork';

function CommonWork(props) {
  const { location: { pathname = '/backlog' } } = props;
  let activeKey = pathname.substr(pathname.lastIndexOf('/') + 1);
  activeKey = 'backlog';
  return (
    <>
      <WorkComponent activeKey={activeKey} key={activeKey} />
    </>
  );
}

export default CommonWork;
