import { Button, Col, Row } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import Iframe from 'react-iframe';
import getIframeSrc from '$utils/getIframeSrc';
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

const ChangeLog: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    activeKey: '1',
  });

  const handleClick = (activeKey: string) => {
    const m = {
      '1': '关系变动日志访问次数',
      '2': '级别变动日志访问次数',
      '3': '信息变更日志访问次数',
      '4': '定制流水访问次数',
    };

    let name = m[activeKey as keyof typeof m];
    newViewSensors({
      third_module: '变动日志',
      ax_page_name: name
    });
    setState({ ...state, activeKey });
  }

  const buttons = [{ ibm: '1', note: '关系变动日志' }, { ibm: '2', note: '级别变动日志' },{ ibm: '3', note: '信息变更日志' },{ ibm: '4', note: '定制流水' },]

  const url = useMemo(() => {
    const { sysParam = [], location: { query: { customerCode = '' } } } = props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    if (state.activeKey === '1') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nLog/page/indexForC5.sdo?rzlx=1&customerCode=${customerCode}`;
    } else if (state.activeKey === '2') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nLog/page/indexForC5.sdo?rzlx=2&customerCode=${customerCode}`;
    } else if (state.activeKey === '3') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nLog/page/indexForC5.sdo?rzlx=3&customerCode=${customerCode}`;
    } else if (state.activeKey === '4') {
      return `${server}/bss/ncrm/ncustomer/nPanorama/nLog/page/indexForC5.sdo?rzlx=4&customerCode=${customerCode}`;
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

export default connect(({ global }: any) => ({ sysParam: global.sysParam, tokenAESEncode: global.tokenAESEncode, }))(ChangeLog);
