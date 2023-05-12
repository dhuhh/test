import React from 'react';
import EventComList from '$components/WorkPlatForm/MainPage/NewProduct/EcifPageChange/EventComList';

export default function (props) {

  const { location: { query: params } } = props;

  return <EventComList params= {params}/>;
}


