import { Button, Col, Row } from 'antd';
import React, { FC, useMemo, useState, useEffect } from 'react';
import getIframeSrc from '$utils/getIframeSrc';
import Iframe from 'react-iframe';
import { connect } from 'umi';
import styles from './index.less';

type Props = Readonly<{
  sysParam: any[],
  location: any,
  tokenAESEncode: string,
}>

interface State {
  activeKey: string,
  customerCode: string,
}

const transaction_test: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    activeKey: '1',
    customerCode: '',
  });

  useEffect(() => {
    const { location: { query: { customerCode = '' } } } = props;
    setState({ ...state, customerCode })
  }, [])

  const handleClick = (activeKey: string) => {
    setState({ ...state, activeKey });
  }

  const buttons = [{ ibm: '1', note: '成交流水' }, { ibm: '2', note: '资金流水' },{ ibm: '3', note: '预约流水' }]

  const url = useMemo(() => {
    const { sysParam = [], location: { query: { customerCode = '' } } } = props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    if (state.activeKey === '1') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nTrade/page/indexForC5.sdo?customerCode=${customerCode}`;
    } else if (state.activeKey === '2') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nTransaction/page/indexForC5.sdo?customerCode=${customerCode}`;
    } else if (state.activeKey === '3') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nAppointment/page/indexForC5.sdo?customerCode=${customerCode}`;
    } else {
      return '';
    }
  }, [state.activeKey]);

  const serverUrl = () => {
    const { sysParam = [] } = props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    return server;
  }

  // style={{ background: '#FFF' }}
  return <div >
      <Row type='flex' style={{ padding: '32px 16px 16px' }}>
      {
        buttons.map((item, index) => <Col key={index}><Button onClick={() => handleClick(item.ibm)} className={`${styles.button} ${state.activeKey === item.ibm ? styles.activeButton : ''}`} style={{ height: 32, padding: '0 10px', marginRight: 12, fontSize: 18 }}>{item.note}</Button></Col>)
      }

    </Row>
    <Iframe url={getIframeSrc(props.tokenAESEncode, url, serverUrl())} height={`${document.body.clientHeight - 120}px`} className={styles.iframe} />
  </div>
}

export default connect(({ global }: any) => ({ sysParam: global.sysParam, tokenAESEncode: global.tokenAESEncode,}))(transaction_test);
