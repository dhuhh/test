import { Col, Icon, Radio, Row, message } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React, { FC, useState, useEffect } from 'react';
import { QueryCustBenefit } from '$services/newProduct';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import privilege_icon from '$assets/newProduct/customerPanorama/privilege_icon.png';
import styles from '../index.less';

type Props = Readonly<{
  customerCode: string,
}>

interface State {
  activeKey: string,
  mainly: boolean,
  equityData: any[]
}

const CustomerEquity: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    activeKey: '1',
    mainly: true,
    equityData: []
  });

  const onChange = (e: RadioChangeEvent): void => {
    const m = {
      1: '客户权益已解锁未领取点击次数',
      0: '客户权益已解锁已领取点击次数',
      2: '客户权益未解锁点击次数',
    };

    let name = m[e.target.value as keyof typeof m]
    newClickSensors({
      third_module: "客户概况",
      ax_button_name: name,
    });
    setState({ ...state, activeKey: e.target.value });
  };

  const handleClick = (): void => {
    newClickSensors({
      third_module: "客户概况",
      ax_button_name: '只看主推权益点击次数',
    });
    setState({ ...state, mainly: !state.mainly });
  };
  const fetchData = (): void => {
    QueryCustBenefit({ custCode: props.customerCode, mainPush: state.mainly ? 1 : 0 }).then((res: any) => {
      const { records = [] } = res;
      setState({ ...state, equityData: records })
    }).catch((err: any) => message.error(err.note || err.message));
  }
  useEffect(() => {
    fetchData()
  }, [state.mainly])

  const totalData: any[] = state.equityData.filter(item => item.mark === state.activeKey);
  const tabData: any[] = totalData.map(item =>
    item.beneditDetail.map((item1: any) => {
      return { levelId: item.levelId, ...item1 };
    })
  ).flat();
  const tradPriv: any[] = tabData.filter(item => item.privilegeType === 0)
  const moneyPriv: any[] = tabData.filter(item => item.privilegeType === 1)
  const servePriv: any[] = tabData.filter(item => item.privilegeType === 2)
  console.log('111', tabData, tradPriv, moneyPriv, servePriv)
  const conditionMap: any = {
    0: '注册',
    1: '开户',
    2: '当月日均资产≥1000元或近12个月贡献≥60元',
    3: '当月日均资产≥5万元或近12个月贡献≥300元',
    4: '当月日均资产≥15万元或近12个月贡献≥1200元',
    5: '当月日均资产≥30万元或近12个月贡献≥4000元',
    6: '当月日均资产≥100万元或近12个月贡献≥1万元',
    7: '当月日均资产≥500万元或近12个月贡献≥3万元',
  };
  return (
    <div style={{ padding: '24px 20px', color: '#1A2243' }}>
      <Radio.Group value={state.activeKey} onChange={onChange} className={styles.radioGroup}>
        <Radio.Button value="1">已解锁未领取</Radio.Button>
        <Radio.Button value="0">已解锁已领取</Radio.Button>
        <Radio.Button value="2">未解锁</Radio.Button>
      </Radio.Group>
      <div style={{ display: 'flex', cursor: 'pointer' }} onClick={handleClick}>
        <span style={{ fontSize: 14, margin: '0 4px 0 0', userSelect: 'none' }}>只看主推权益</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {state.mainly ? <Icon type="check-circle" theme="filled" style={{ fontSize: 15, color: '#244FFF' }} /> : <span style={{ width: 15, height: 15, border: '1px solid #74819E', borderRadius: '50%' }}></span>}
        </div>
      </div>
      <React.Fragment>
        <div style={{ marginTop: 20, fontSize: 14 }} className='ax-card-title'>交易特权</div>
        {
          tradPriv.map((item, index) => (
            <React.Fragment key={index}>
              <Row style={{ padding: '20px 0', display: 'flex' }}>
                <Col style={{ flexShrink: '0' }}><img src={privilege_icon} alt='' style={{ width: 20 }} /></Col>
                <Col style={{ marginLeft: 10 }}>
                  <Row type='flex' align='middle'>
                    <Col style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}>{item.name}</Col>
                    <Col>
                      <div style={{ padding: '2px 5px', borderRadius: 3, background: 'rgba(239,90,60,0.1)', color: '#EF5A3C', fontSize: 12 }}>{item.tag}</div>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 10, lineHeight: '17px', fontSize: 12, color: '#959CBA' }}>{item.briefText}</Row>
                  {
                    (state.activeKey === '1' || state.activeKey === '2') &&
                    <Row style={{ background: '#F0F1F5', borderRadius: 2, marginTop: 10, padding: '2px 8px', width: 'fit-content', fontSize: 12, color: '#244FFF' }}>{conditionMap[item.levelId]}</Row>
                  }
                </Col>
              </Row>
              {
                index !== tradPriv.length - 1 && <div style={{ background: 'rgba(0, 0, 0, 0.1)', width: '100%', height: 1 }}></div>
              }
            </React.Fragment>
          ))
        }
        <div style={{ marginTop: 20, fontSize: 14 }} className='ax-card-title'>理财特权</div>
        {
          moneyPriv.map((item, index) => (
            <React.Fragment key={index}>
              <Row style={{ padding: '20px 0', display: 'flex' }}>
                <Col style={{ flexShrink: '0' }}><img src={privilege_icon} alt='' /></Col>
                <Col style={{ marginLeft: 10 }}>
                  <Row type='flex' align='middle'>
                    <Col style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}>{item.name}</Col>
                    <Col>
                      <div style={{ padding: '2px 5px', borderRadius: 3, background: 'rgba(239,90,60,0.1)', color: '#EF5A3C', fontSize: 12 }}>{item.tag}</div>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 10, lineHeight: '17px', fontSize: 12, color: '#959CBA' }}>{item.briefText}</Row>
                  {
                    (state.activeKey === '1' || state.activeKey === '2') &&
                    <Row style={{ background: '#F0F1F5', borderRadius: 2, marginTop: 10, padding: '2px 8px', width: 'fit-content', fontSize: 12, color: '#244FFF' }}>{conditionMap[item.levelId]}</Row>
                  }
                </Col>
              </Row>
              {
                index !== moneyPriv.length - 1 && <div style={{ background: 'rgba(0, 0, 0, 0.1)', width: '100%', height: 1 }}></div>
              }
            </React.Fragment>
          ))
        }
        <div style={{ marginTop: 20, fontSize: 14 }} className='ax-card-title'>服务特权</div>
        {
          servePriv.map((item, index) => (
            <React.Fragment key={index}>
              <Row style={{ padding: '20px 0', display: 'flex' }}>
                <Col style={{ flexShrink: '0' }}><img src={privilege_icon} alt='' /></Col>
                <Col style={{ marginLeft: 10 }}>
                  <Row type='flex' align='middle'>
                    <Col style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}>{item.name}</Col>
                    <Col>
                      <div style={{ padding: '2px 5px', borderRadius: 3, background: 'rgba(239,90,60,0.1)', color: '#EF5A3C', fontSize: 12 }}>{item.tag}</div>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 10, lineHeight: '17px', fontSize: 12, color: '#959CBA' }}>{item.briefText}</Row>
                  {
                    (state.activeKey === '1' || state.activeKey === '2') &&
                    <Row style={{ background: '#F0F1F5', borderRadius: 2, marginTop: 10, padding: '2px 8px', width: 'fit-content', fontSize: 12, color: '#244FFF' }}>{conditionMap[item.levelId]}</Row>
                  }
                </Col>
              </Row>
              {
                index !== servePriv.length - 1 && <div style={{ background: 'rgba(0, 0, 0, 0.1)', width: '100%', height: 1 }}></div>
              }
            </React.Fragment>
          ))
        }
      </React.Fragment>


    </div>
  );
};
export default CustomerEquity;
