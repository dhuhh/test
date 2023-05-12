import React, { Component } from 'react';
import DataAnalysis from '$components/WorkPlatForm/MainPage/NewProduct/OpenAccountManagement/DataAnalysis';
class dataAnalysis extends Component {

  render() {
    return (
      <DataAnalysis state={this.props.location.state} />
    );
  }
}
export default dataAnalysis;