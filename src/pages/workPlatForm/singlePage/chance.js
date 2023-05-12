import React, { Component } from 'react';
import Chance from '$components/WorkPlatForm/MainPage/NewProduct/Chance';
class chance extends Component {

  render() {
    const { location: { query: { tab = '1' ,tab1 = '0',tab2 = '1' } } } = this.props;
    return (
      <Chance tabKey={tab} tab1={tab1} tab2={tab2}/>
    );
  }
}
export default chance;