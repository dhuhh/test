import React, { useState } from 'react';
import { Tabs } from "antd";
import { connect } from "dva";
import PeCustomers from "./peCustomers";
import PeProductsales from "./peProductsales";
import PeHeadband from "./peHeadband";
import styles from "./index.less";

const Person =(props)=> {
  const [activeKey, setActiveKey] = useState("peCustomers");
  const { authorities = {} } = props;
  const { redGoodStart = [] } = authorities;
  return (
    <Tabs
      className={styles.tabs}
      activeKey={activeKey}
      onChange={activeKey => setActiveKey(activeKey)}
    >
      <Tabs.TabPane tab="新开中端富裕客户" key="peCustomers">
        <PeCustomers />
      </Tabs.TabPane>
      {redGoodStart.includes("redGoodStart_WealthProduct") && (
        <Tabs.TabPane tab="理财产品销售" key="peProductsales">
          <PeProductsales />
        </Tabs.TabPane>
      )}
      <Tabs.TabPane tab="基金投顾" key="peHeadband">
        <PeHeadband />
      </Tabs.TabPane>
    </Tabs>
  );
  
}
export default connect(({ global }) => ({
  authorities: global.authorities
}))(Person);