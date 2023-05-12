import React, { FC, Component, useState } from 'react';
import { Tabs } from 'antd';
import BusinessChance from './BusinessChance';
import CustomerEquity from './CustomerEquity';
import LifeCycle from './LifeCycle';
import emptyImg from '$assets/newProduct/customerPortrait/缺省图.png';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import styles from '../index.less';

const { TabPane } = Tabs;

type Props = Readonly<{
  customerCode: string,
  clickSensors: (ax_button_name: string) => void,
}>

interface State {
  tabKey: string,
};

const InfoCard: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    tabKey: 'businessChance',
  });

  const handleTabChange = (tabKey: string): void => {
    const m = {
      businessChance: '业务机会点击次数',
      customerEquity: '客户权益点击次数',
      lifeCycle: '生命周期点击次数',
    };

    let name = m[tabKey as keyof typeof m]
    newClickSensors({
      third_module: "客户概况",
      ax_button_name: name,
    });
    setState({ ...state, tabKey });
  };


  return (
    <Tabs activeKey={state.tabKey} onChange={handleTabChange} className={styles.tabs}>
      <TabPane tab="业务机会" key="businessChance">
        <BusinessChance customerCode={props.customerCode} />
      </TabPane>
      <TabPane tab="客户权益" key="customerEquity">
        <CustomerEquity customerCode={props.customerCode} />
        {/* <div style={{ textAlign: 'center', marginTop: 32 }}>
          <div><img src={emptyImg} style={{ width: 121, height: 81 }} /></div>
          <div style={{ color: '#61698C', fontSize: 12, lineHeight: '20px', marginTop: 3 }}>功能暂未开放</div>
        </div> */}
      </TabPane>
      <TabPane tab="生命周期" key="lifeCycle">
        <LifeCycle customerCode={props.customerCode} />
      </TabPane>
    </Tabs>
  );
};
export default InfoCard;
