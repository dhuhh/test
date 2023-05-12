import React,{ Component } from 'react';
import CustomerPortrait from '$components/WorkPlatForm/MainPage/NewProduct/CustomerPortrait';
class customerPortrait extends Component{
  render() {
    let { match: { params: { customerCode = '' } = {} } = {}, location } = this.props;
    if (!customerCode) {
      const { query: { customerCode: cusNo = '' } } = location;
      customerCode = cusNo;
    }
    return (
      <CustomerPortrait cusCode={customerCode} />
    );
  }
}
export default customerPortrait;