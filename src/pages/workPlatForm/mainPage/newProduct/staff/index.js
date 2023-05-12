import React, { Component } from 'react';
import Staff from '$components/WorkPlatForm/MainPage/NewProduct/Staff';

class staff extends Component {
  render() {
    let { location: { query: { userId = '' } } } = this.props;
    if (userId === '') {
      userId = `${JSON.parse(sessionStorage.user).id}`;
    }
    return <Staff userId={userId} />;
  }
}

export default staff;