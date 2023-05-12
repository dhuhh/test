import React, { useState } from 'react';
import { Tabs } from "antd";
import { connect } from "dva";
import EmNewaccount from "./emNewaccount";
import EmCustomers from "./emCustomers";
import EmSecurities from './emSecurities';
import EmProductsales from './emProductsales';
import EmHeadband from './emHeadband';
import EmSigning from './emSigning';
import styles from "./index.less";

const Embranchment = (props) =>{
  const [activeKey, setActiveKey] = useState("emNewaccount");
  const { authorities = {} } = props;
  const { partnerAction = [] } = authorities;
  return (
    <Tabs
      className={styles.tabs}
      activeKey={activeKey}
      onChange={activeKey => setActiveKey(activeKey)}
    >
      <Tabs.TabPane tab="新增有效户" key="emNewaccount">
        <EmNewaccount />
      </Tabs.TabPane>
      <Tabs.TabPane tab="新增中端富裕客户" key="emCustomers">
        <EmCustomers />
      </Tabs.TabPane>
      <Tabs.TabPane tab="融资融券" key="emSecurities">
        <EmSecurities />
      </Tabs.TabPane>
      <Tabs.TabPane tab="理财产品销售" key="emProductsales">
        <EmProductsales />
      </Tabs.TabPane>
      
      {/* <Tabs.TabPane tab="基金投顾" key="emHeadband">
        <EmHeadband />
      </Tabs.TabPane>
      <Tabs.TabPane tab="全提佣签约" key="emSigning">
        <EmSigning />
      </Tabs.TabPane> */}
    </Tabs>
  );
  
};
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(Embranchment);