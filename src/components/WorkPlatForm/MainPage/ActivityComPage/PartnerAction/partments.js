import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { connect } from "dva";
import PaProductsales from "./paProductsales";
import PaHeadband from './paHeadband';
import PaAsset from './paAsset';

import styles from "./index.less";

const Partments = (props) => {
  const [activeKey, setActiveKey] = useState("paProductsales");
  const { authorities = {} } = props;
  const { redGoodStart = [] } = authorities;
  useEffect(() => {

  }, []);

  return (
    <Tabs
      className={styles.tabs}
      activeKey={activeKey}
      onChange={activeKey => setActiveKey(activeKey)}
    >
      <Tabs.TabPane tab="理财产品销售" key="paProductsales">
        <PaProductsales />
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="基金投顾" key="paHeadband">
        <PaHeadband />
      </Tabs.TabPane>

      <Tabs.TabPane tab="资产引入" key="paAsset">
        <PaAsset />
      </Tabs.TabPane> */}
     
    </Tabs>
  );
};
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(Partments);