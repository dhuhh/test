import { Card, Col, message, Modal, Row } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { connect, history } from 'umi';
import lodash from 'lodash';
import Iframe from 'react-iframe';
import getIframeSrc from '$utils/getIframeSrc';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
// import RateModal from '../Common/RateModal';
import RateModal from '../Common/RateModal/Temp';
import { QueryCustAllInfoBase, QuerySaHaStockRate } from '$services/customerPanorama';
import dobule_right_arrow from '$assets/newProduct/customerPanorama/dobule_right_arrow.png';
import send_message from '$assets/newProduct/customerPanorama/message.svg';
import styles from './index.less';

type Props = Readonly<{
  customerCode: string,
  sysParam: any[],
  tokenAESEncode: string,
  clickSensors: (ax_button_name: string) => void,
}>

interface State {
  visible: boolean,
  height: number,
  loading: boolean,
  dataSource: any[],
  sendMessageVisible: boolean,
  allInfo: any,
  account: string,
}

const BasicInfo: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    visible: false,
    height: document.body.offsetHeight < 540 ? document.body.offsetHeight - 180 : 360,
    loading: false,
    dataSource: [],
    sendMessageVisible: false,
    allInfo: {},
    account: '',
  });

  interface StateS {
    allCounType: any
  }

  const [stateCount, setStateCount] = useState<StateS>({
    allCounType: {
      ordinaryList: [],
    }
  })

  useEffect(() => {
    QueryCustAllInfoBase({ custNo: customerCode }).then((res: any) => {
      const { records = [] } = res;
      if (records.length) {
        getAccountDetail({ ...lodash.get(records, '[0]', {}) });
        setState({ ...state, allInfo: records[0] });
      }
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])



  const getAccountDetail = (item: any) => {
    // 期权 普通 信用账号
    const {  ordinaryAccont } = item
    let accountBox = {
      ordinaryList: [],
    }

    // accountType = 1|普通  2|信用 & accounts
    if (ordinaryAccont !== '') {
      QuerySaHaStockRate({ accountType: 1, accounts: ordinaryAccont }).then((res: any) => {
        const { records = [] } = res;
        records.map((item: any) => {
          if (item.szRate !== '') {
            item.szRate = `${item.szRate}‰`
          }
          if (item.shRate !== '') {
            item.shRate = `${item.shRate}‰`
          }
        })
        accountBox.ordinaryList = records
        setStateCount({ ...stateCount, allCounType: accountBox });
      })
    }

  };

  const handleClick = (account: string) => {
    setState({ ...state, visible: true, account });
    newClickSensors({
      third_module: "客户概况",
      ax_button_name: "费率按钮点击次数",
    });
  }

  const toAllInfo = () => {
    newClickSensors({
      third_module: "客户概况",
      ax_button_name: "点击全部信息",
    });
    newViewSensors({
      third_module: "客户概况",
      ax_page_name: "全部信息页面访问量",
    });

    history.push(`/customerPanorama/customerInfo/allInfo?customerCode=${props.customerCode}`);
  }

  const showSendMessage = () => {
    clickSensors('发短信');
    setState({ ...state, sendMessageVisible: true });
  }

  const { sysParam = [], customerCode = '', clickSensors } = props;
  const server = sysParam.find((item: any) => item.csmc === 'system.c4ym.url')?.csz;

  const { allInfo = {} } = state;
  const { allCounType = {} } = stateCount
  return (
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0 20px', color: '#1A2243' }}
      title={<div className="ax-card-title" style={{ color: '#1A2243' }}>基本信息</div>}
      extra={<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#1A2243' }} onClick={toAllInfo}>
        <span style={{ marginRight: 4 }}>全部信息</span>
        <img src={dobule_right_arrow} alt='' />
      </div>}
    >
      <div style={{ height: 28, background: 'linear-gradient(90deg, #F2F3F7 0%, rgba(242, 243, 247, 0.1) 100%)', display: 'flex', alignItems: 'center', padding: '0 9px', marginBottom: 9 }}>
        <span>客户全称：</span>
        <span>{allInfo.fullName || '--'}</span>
      </div>
      <div style={{ height: 28, background: 'linear-gradient(90deg, #F2F3F7 0%, rgba(242, 243, 247, 0.1) 100%)', display: 'flex', alignItems: 'center', padding: '0 9px' }}>
        <span>普通资金账号：</span>
        {/* {
          allInfo.ordinaryAccont && allInfo.ordinaryAccont.split(',').map((item: any, index: number) => (
            <div key={index}>
              <span>{item}</span>
              <span style={{ cursor: 'pointer', color: '#244FFF' }} onClick={() => handleClick(item)}>（费率）</span>
              { index < (allInfo.ordinaryAccont.split(',').length - 1) && '、'}
            </div>
          ))
        } */}
        {
          allCounType.ordinaryList.length > 0 ? allCounType.ordinaryList.map((item: any, index: number) => (
            <div key={index} style={{ color: '#1A2243' }}>
              <span>{item.account}</span>
              <span style={{ cursor: 'pointer', color: '#244FFF' }}
                onClick={() => handleClick(item.account)}>
                (深A/沪A股票费率: {item.szRate == item.shRate ? (item.szRate !== '' ? item.szRate : '--/--') : ((`${item.szRate} / ${item.shRate}`))})
              </span>
              {index < (allCounType.ordinaryList.length - 1) && '、'}
            </div>
          )) : '--'
        }
      </div>
      <Row type='flex' align='middle' style={{ padding: '6px 0 18px' }}>
        <Col span={11}>
          <div style={{ padding: '6px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ paddingRight: 7 }}>电话：{allInfo.phone}</span>
            <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={showSendMessage}><img src={send_message} alt='' /></span>
          </div>
          <div style={{ padding: '6px 0' }}>e账通：{allInfo.eAccun || '--'}</div>
          <div style={{ padding: '6px 0' }}>地址：{allInfo.familyAddress || '--'}</div>
          <div style={{ padding: '6px 0' }}>开户行：{allInfo.openBank || '--'}</div>
          <div style={{ padding: '6px 0' }}>个性化信息：{allInfo.taboo || '--'}</div>
        </Col>
        <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 1, height: 100, background: '#EBECF2' }}></div>
        </Col>
        <Col span={11}>
          <div style={{ padding: '6px 0' }}>服务关系：{allInfo.servce || '--'}</div>
          <div style={{ padding: '6px 0' }}>开发关系：{allInfo.devel || '--'}</div>
          <div style={{ padding: '6px 0' }}>无效户激活关系：{allInfo.invAction || '--'}</div>
          <div style={{ padding: '6px 0' }}>期权开发关系：{allInfo.option || '--'}</div>
        </Col>
      </Row>

      <RateModal account={state.account} mode={1} visible={state.visible} setVisible={(visible) => setState({ ...state, visible })} />

      <Modal
        visible={state.sendMessageVisible}
        title={<div style={{ color: '#1A2243' }}>{'发送短信'}</div>}
        footer={null}
        onCancel={() => { setState({ ...state, sendMessageVisible: false }); }}
        width={806}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        className={styles.modal}
      >
        <Iframe url={getIframeSrc(props.tokenAESEncode, `${server}/bss/newMsg/page/sendSingle.sdo?msgType=4&receiverType=1&sttgCode=PUB_FRE&allSelDatas=${customerCode}`, server)} height={`588px`} className={styles.iframe} />
      </Modal>
    </Card>
  );
};
export default connect(({ global }: any) => ({ sysParam: global.sysParam, tokenAESEncode: global.tokenAESEncode, }))(BasicInfo);
