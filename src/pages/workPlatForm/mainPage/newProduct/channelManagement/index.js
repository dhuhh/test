import React, { Component } from 'react';
import ChannelManagement from '$components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/ChannelManagement';
class channelManagement extends Component {

  render() {
    return (
      <ChannelManagement state={this.props.location.state} />
    );
  }
}
export default channelManagement;