import React, { useState } from "react";
import Department from "./Department/department";
import Staff from "./Staff/staff";
import { Tabs } from "antd";
import styles from "./index.less";
const { TabPane } = Tabs;
export default function RankingListTab() {
  const [thisKey, setThisKey] = useState("2");
  const callback = key => {
    console.log(key);
    setThisKey(key);
  };

  return (
    <div style={{ background: "#fff" }} className={styles.tabFather}>
     {/*  <Tabs
        defaultActiveKey={thisKey}
        onChange={callback}
        size={"large"}
        tabBarStyle={{height:"60px",}}
      >
        <TabPane
          tab={
            <div
              className={
                thisKey === "1" ? styles.yiXuanZhong : styles.weiXuanZhong
              }
            >
              辖属营业部
            </div>
          }
          key="1"
        >
          <Department />
        </TabPane>
        <TabPane
          tab={
            <div
            style={{marginLeft:'10px'}}
              className={
                thisKey === "2" ? styles.yiXuanZhong : styles.weiXuanZhong
              }
            >
              分支员工
            </div>
          }
          key="2"
        >
          <Staff />
        </TabPane>
      </Tabs> */}
       <Staff />
    </div>
  );
}
