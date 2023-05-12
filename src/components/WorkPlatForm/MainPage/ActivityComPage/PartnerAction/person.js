import React, { useState } from 'react';
import { Tabs } from "antd";
import { connect } from "dva";
import PeNewaccount from "./peNewaccount";
import PeProductsales from "./peProductsales";
import PeHeadband from "./peHeadband";
import styles from "./index.less";

const Person = (props)=> {
  const [activeKey, setActiveKey] = useState("peNewaccount");
  const { authorities = {} } = props;
  const { redGoodStart = [] } = authorities;
  return (
    <Tabs
      className={styles.tabs}
      activeKey={activeKey}
      onChange={activeKey => setActiveKey(activeKey)}
    >
      <Tabs.TabPane tab="新开有效户" key="peNewaccount">
        <PeNewaccount />
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="理财产品销售" key="peProductsales">
        <PeProductsales />
      </Tabs.TabPane>
      <Tabs.TabPane tab="基金投顾" key="peHeadband">
        <PeHeadband />
      </Tabs.TabPane> */}
    </Tabs>
  );
  
};
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(Person);