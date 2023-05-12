import React, { Component } from 'react';
import GroupManagement from '$components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/GroupManagement';
class groupManagement extends Component {

  render() {
    return (
      <GroupManagement state={this.props.location.state} />
    );
  }
}
export default groupManagement;