import { Button, Col, Row, Spin } from 'antd';
import React, { FC, useState } from 'react';
import BasicInfo from '$components/WorkPlatForm/CustomerPanorama/AllInfo/BasicInfo';
import CreditAccount from '$components/WorkPlatForm/CustomerPanorama/AllInfo/CreditAccount';
import FinancialAccount from '$components/WorkPlatForm/CustomerPanorama/AllInfo/FinancialAccount';
import FundsInvestment from '$components/WorkPlatForm/CustomerPanorama/AllInfo/FundsInvestment';
import GeneralAccount from '$components/WorkPlatForm/CustomerPanorama/AllInfo/GeneralAccount';
import OptionsAccount from '$components/WorkPlatForm/CustomerPanorama/AllInfo/OptionsAccount';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import styles from './index.less';

type Props = Readonly<{
  location: any,
}>

interface State {
  accounts: any[],
  activeAccount: string,
}

const AllInfo: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    accounts: [{ ibm: '0', note: '基本信息' }, { ibm: '1', note: '普通账户' }, { ibm: '2', note: '信用账户' }, { ibm: '3', note: '理财账户' }, { ibm: '4', note: '期权账户' }, { ibm: '5', note: '基金投顾' }],
    // accounts: [{ ibm: '0', note: '基本信息' }, { ibm: '1', note: '普通账户' }, { ibm: '2', note: '信用账户' }, { ibm: '3', note: '理财账户' }, { ibm: '4', note: '期权账户' }],
    activeAccount: '0',
  });
  const [loading, setLoading] = useState(false);

  const handleAccountClick = (item:any,activeAccount: string): void => {
    let name = item.note + "点击次数"
    newClickSensors({
      third_module: "客户概况",
      ax_page_name:'全部信息',
      ax_button_name: name,
    });
    
    setState({ ...state, activeAccount })
  }

  const { location: { query: { customerCode = '' } } } = props;

  return <div>
    <Row type='flex' align='middle' style={{ padding: '32px 16px 16px', background: '#FFF' }}>
      {
        state.accounts.map((item, index) => <Col key={index}><Button onClick={() => handleAccountClick(item,item.ibm)} className={`${styles.button} ${state.activeAccount === item.ibm ? styles.activeButton : ''}`} style={{ height: 32, padding: '0 10px', marginRight: 12, fontSize: 18 }}>{item.note}</Button></Col>)
      }
      <div style={{ position: 'fixed', right: 30, top: 150, zIndex: 99, display: loading ? 'block' : 'none' }}><Spin size='small' spinning={loading} /><span style={{ paddingLeft: 6 }}>载入中...</span></div>
    </Row>
    {
      state.activeAccount === '0' ? <BasicInfo customerCode={customerCode} setLoading={setLoading} /> :
      state.activeAccount === '1' ? <GeneralAccount customerCode={customerCode} setLoading={setLoading} /> :
      state.activeAccount === '2' ? <CreditAccount customerCode={customerCode} setLoading={setLoading} /> :
      state.activeAccount === '3' ? <FinancialAccount customerCode={customerCode} setLoading={setLoading} /> :
      state.activeAccount === '4' ? <OptionsAccount customerCode={customerCode} setLoading={setLoading} /> :
      state.activeAccount === '5' ? <FundsInvestment customerCode={customerCode} setLoading={setLoading} /> : ''
    }
  </div>
}
export default AllInfo;
