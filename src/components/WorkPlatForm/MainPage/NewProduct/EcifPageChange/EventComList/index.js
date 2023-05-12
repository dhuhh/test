
import React, { } from 'react';
import EcifEvent from './EcifEvent' ;
import OtherEvent from './OtherEvent' ;

export default function EventComList(props) {

  // ecif事件类型 '292' : '241'
  const showCompintent = () =>{

    if(props?.params && (props?.params?.sjid == '292' || props?.params?.sjid == '241')){
      return ( <EcifEvent eventId={props?.params?.sjid} />);
      
    }else{
      return ( <OtherEvent params={props.params}/>);
    }
  };

  return (<div>{ showCompintent()}</div>);
}
