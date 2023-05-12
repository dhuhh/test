import React ,{ useState }from 'react';
import { Row, Card } from 'antd';
import { connect } from 'dva';
import { history as router } from 'umi';
import { DecryptBase64 } from '../../../../../Common/Encrypt';
import ProdCustInfo from './prodCustInfo';
import InterruptInfo from './interruptInfo';
import CallInfo from './CallInfo';
import ServiceInfo from '../CustomerBreak/ServiceInfo';

class Index extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      custNo: '',
      type: '',
      status: '',
      note: '',
      updateFlag: '',
      fundType: '',
    };
  }
  componentWillMount() {
    localStorage.setItem('oldURl', '');
    const paramsStr = JSON.parse(DecryptBase64(this.props.queryParams));
    this.setState({ custNo: paramsStr.custNo ,type: paramsStr.type ,customerNo: paramsStr.customerNo,status: paramsStr.status ,note: paramsStr.note ,updateFlag: paramsStr.updateFlag ,fundType: paramsStr.fundType });
  }

  componentDidMount = () => {
    const { authorities = {} } = this.props;
    const { valueSearch } = authorities;
    if (valueSearch && !valueSearch.includes('details')) {
      router.push('/403');
    }
  }
  render() {
    const { dictionary = {} } = this.props;
    const { custNo ,type ,customerNo ,status ,note ,updateFlag ,fundType } = this.state;
    return (
      <React.Fragment>
        <ProdCustInfo custNo={custNo} updateFlag={updateFlag} type={type}/>
        <InterruptInfo custNo={custNo} type={type} fundType={fundType}/>
        <CallInfo custNo={custNo} type={type} customerNo={customerNo} status={status} note={note}/>
        <ServiceInfo custNo={custNo} dictionary={dictionary} />
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(Index);

