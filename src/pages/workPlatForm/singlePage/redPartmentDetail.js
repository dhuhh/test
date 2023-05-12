import React, { Component } from "react";
import PartmentDetail from "$components/WorkPlatForm/MainPage/ActivityComPage/RedGoodStart/partmentDetail";
class partmentDetail extends Component {
  
  render() {
    const { match: { params: { queryParams } } } = this.props;
    return <PartmentDetail queryParams={queryParams} />;
  }
}
export default partmentDetail;
