import React, { Component } from "react";
import PartnerDetail from "$components/WorkPlatForm/MainPage/ActivityComPage/PartnerAction/partmentDetail";
class partnerDetail extends Component {
  render() {
    const {
      match: {
        params: { queryParams },
      },
    } = this.props;
    return <PartnerDetail queryParams={queryParams} />;
  }
}
export default partnerDetail;
