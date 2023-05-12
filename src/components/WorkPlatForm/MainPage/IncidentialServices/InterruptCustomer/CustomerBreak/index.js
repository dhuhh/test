/* eslint-disable array-callback-return */
/* eslint-disable no-extend-native */
import React from 'react';
import { Row, Card } from 'antd';
import { connect } from 'dva';
import { history as router } from 'umi';
import { DecryptBase64 } from '../../../../../Common/Encrypt';
import BasicInfo from './BasicInfo';
import OpenacInfo from './OpenacInfo';
import RegisterInfo from './RegisterInfo';
import ServiceInfo from './ServiceInfo';
import ActiveInfo from './ActiveInfo';
import CallInfo from '../ProdBreak/CallInfo';
import styles from './index.less';

class CustomerBreak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAcHisData: [], // 历史开户信息
      custNo: '',
      type: '',
      status: '',
      note: '',
    };
  }

  componentWillMount() {
    localStorage.setItem('oldURl', '');
    const paramsStr = JSON.parse(DecryptBase64(this.props.queryParams));
    this.setState({ custNo: paramsStr.custNo,type: paramsStr.type,customerNo: paramsStr.customerNo ,status: paramsStr.status ,note: paramsStr.note });
  }

  componentDidMount = () => {
    const { authorities = {} } = this.props;
    const { valueSearch } = authorities;
    if (valueSearch && !valueSearch.includes('details')) {
      router.push('/403');
    }
  }

  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const { openAcHisData, custNo ,type ,customerNo,status ,note } = this.state;
    const { dictionary = {} } = this.props;
    return (
      <React.Fragment>
        <div className='pb24'>
          {/* 基础信息 */}
          <BasicInfo custNo={custNo} setData={this.setData} /> 

          {/* 开户信息 */}
          <OpenacInfo custNo={custNo} openAcHisData={openAcHisData} />

          {/* 注册信息 */}
          <RegisterInfo custNo={custNo} />

          {/* 活动信息 */}
          <ActiveInfo custNo={custNo} />

          <CallInfo custNo={custNo} type={type} customerNo={customerNo} status={status} note={note}/>

          <ServiceInfo custNo={custNo} dictionary={dictionary} />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  authorities: global.authorities,
}))(CustomerBreak);