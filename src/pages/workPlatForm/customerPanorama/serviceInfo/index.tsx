import { Button, Col, Row } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import getIframeSrc from '$utils/getIframeSrc';
import Iframe from 'react-iframe';
import { connect } from 'umi';
import { newViewSensors } from "$utils/newSensors";
import styles from './index.less';

type Props = Readonly<{
  sysParam: any[],
  location: any,
  tokenAESEncode: string,
}>

interface State {
  activeKey: string,
}

const ServiceInfo: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    activeKey: '1',
  });

  const handleClick = (activeKey: string) => {
    const m = {
      '1': '服务事件访问次数',
      '2': '发送记录访问次数',
      '3': '电话记录访问次数',
      '4': '资讯定制访问次数',
      '5': '服务记录访问次数',
    };

    let name = m[activeKey as keyof typeof m] ;

    newViewSensors({
      third_module: '服务信息',
      ax_page_name:name
    });
    setState({ ...state, activeKey });
  }

  const buttons = [{ ibm: '1', note: '服务事件' }, { ibm: '2', note: '发送记录' },{ ibm: '3', note: '电话记录' },{ ibm: '4', note: '资讯定制' },{ ibm: '5', note: '服务记录' }]

  const url = useMemo(() => {
    const { sysParam = [], location: { query: { customerCode = '' } } } = props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    if (state.activeKey === '1') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nService/page/indexForC5.sdo?lx=1&customerCode=${customerCode}`;
    } else if (state.activeKey === '2') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nService/page/indexForC5.sdo?lx=2&customerCode=${customerCode}`;
    } else if (state.activeKey === '3') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nService/page/indexForC5.sdo?lx=3&customerCode=${customerCode}`;
    } else if (state.activeKey === '4') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nService/page/indexForC5.sdo?lx=4&customerCode=${customerCode}`;
    } else if (state.activeKey === '5') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nService/page/indexForC5.sdo?lx=5&customerCode=${customerCode}`;
    } else {
      return '';
    }
  }, [state.activeKey]);

  const serverUrl = () => {
    const { sysParam = [] } = props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    return server;
  }

  return <div style={{ background: '#FFF' }}>
      <Row type='flex' style={{ padding: '32px 16px 16px' }}>
      {
        buttons.map((item, index) => <Col key={index}><Button onClick={() => handleClick(item.ibm)} className={`${styles.button} ${state.activeKey === item.ibm ? styles.activeButton : ''}`} style={{ height: 32, padding: '0 10px', marginRight: 12, fontSize: 18 }}>{item.note}</Button></Col>)
      }

    </Row>
    <Iframe url={getIframeSrc(props.tokenAESEncode, url, serverUrl())} height={`${document.body.clientHeight - 120}px`} className={styles.iframe} />
  </div>
}

export default connect(({ global }: any) => ({ sysParam: global.sysParam, tokenAESEncode: global.tokenAESEncode,}))(ServiceInfo);
