import React from 'react';
import { Tabs } from 'antd';
import { useState } from 'react';
import UnDredge from './unDredge';
import Dredge from './dredge';
import './index.css';

const { TabPane } = Tabs;

export default function AlphaTIndex() {
  const [tabKeys,setTabKeys] = useState('0');

  const onChange = (tab)=>{
    console.log(tab);
    setTabKeys(tab);
  };

  return (
    <div id='alphat-out' className='alsing'>
      <Tabs activeKey={tabKeys} onChange={onChange}>
        <TabPane tab="未交易" key="0">
          <UnDredge/>
        </TabPane>
        <TabPane tab="已交易" key="1">
          <Dredge/>
        </TabPane>
      </Tabs>
    </div>
  );
}
