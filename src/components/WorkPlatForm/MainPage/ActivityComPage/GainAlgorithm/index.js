import React, { useState } from 'react';
import Manufacturer from './manufacturer';
import Person from './person';
import styles from './index.less';
import { Tabs , Card } from 'antd';

export default function WealthGrowthPlan(props){

  const [activeKey , setActiveKey ] = useState('manufacturer');

  return (
    <React.Fragment>
      <Tabs activeKey={activeKey} className={styles.changeTabs} onChange={activeKey => setActiveKey(activeKey)}>
        <Tabs.TabPane tab='厂商付费' key='manufacturer'>
          <Manufacturer />
        </Tabs.TabPane>
        <Tabs.TabPane tab='员工提成' key='person'>
          <Person />
        </Tabs.TabPane>
      </Tabs>
    </React.Fragment>
  );

}