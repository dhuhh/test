import React from 'react';
import { connect } from 'dva';
import CustomerService from '../../../../../../components/WorkPlatForm/MainPage/Customer/HighNetWorthCus/CustomerService';
import { DecryptBase64 } from '$components/Common/Encrypt';

class customerService extends React.Component {
  render() {
    const { state: params = '' } = this.props.location;
    const { dictionary, dispatch } = this.props;
    let paramsStr = '';
    if(params){
      paramsStr = JSON.parse(DecryptBase64(params));
    }
    const { khid = '', type = '1' } = paramsStr;
    return (
      <div style={{ marginTop: '1rem' }}>
          <CustomerService key={khid} khid={khid} type={type} dictionary={dictionary} dispatch={dispatch} />
      </div>
    )
  }
}

export default connect(({ global }) => ({
  authorities: global.authorities,
  dictionary: global.dictionary,
}))(customerService);