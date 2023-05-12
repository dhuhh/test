import React from 'react';
import WorkComponent from '$components/WorkPlatForm/MainPage/NewProduct/Work';

function Work(props) {
  const { location: { pathname = '/backlog' } } = props;
  let activeKey = pathname.substr(pathname.lastIndexOf('/') + 1);
  activeKey = ['backlog', 'message'].includes(activeKey) ? activeKey : 'backlog';
  return (
    <>
      <WorkComponent activeKey={activeKey} key={activeKey} />
    </>
  );
}

export default Work;
