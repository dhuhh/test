import React, { useState, useEffect } from "react";
import Embranchment from "./embranchment";
import Partments from "./partments";
import Person from "./person";
import partneraction from "$assets/activityComPage/partneraction.png";
import smallpartneraction from "$assets/activityComPage/smallpartneraction.png";
import styles from "./index.less";
import { Card } from "antd";

export default function RedGoodStart(props) {
  const [activeKey, setActiveKey] = useState("embranchment");
  const [changeBaner, setChangeBaner] = useState(false);


  useEffect(() => {
    let wid = document.body.clientWidth;

    if(wid > 1280){
      setChangeBaner(false);
    }else{
      setChangeBaner(true);
    }
  }, []);

  const renderTab = (tabString, tabKey) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className={
          activeKey === tabKey ? styles.tab_active : styles.tab_unactive
        }
      >
        <div style={{ lineHeight: "38px", fontSize: 16, width: 158 }}>
          {tabString}
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <Card
        className="ax-card"
        bodyStyle={{
          padding: "0 0 40px 0"
        }}
      >
        <div
          className={
            changeBaner ? styles.head_panner_small : styles.head_panner
          }
          style={{
            backgroundImage: changeBaner
              ? `url(${smallpartneraction})`
              : `url(${partneraction})`
          }}
        >
          <div className={styles.head_box}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setActiveKey("embranchment")}
            >
              {renderTab("分支机构奖项", "embranchment")}
            </div>
            <div
              style={{ marginLeft: 8, cursor: "pointer" }}
              onClick={() => setActiveKey("partments")}
            >
              {renderTab("营业部组织奖", "partments")}
            </div>
            <div
              style={{ marginLeft: 8, cursor: "pointer" }}
              onClick={() => setActiveKey("person")}
            >
              {renderTab("员工个人奖", "person")}
            </div>
          </div>
        </div>
        <div
          style={{ left: 0 }}
          className={changeBaner ? styles.margin_top_small : styles.margin_top}
        ></div>

        <div className={styles.basic_box}>
          {activeKey === "embranchment" && <Embranchment />}
          {activeKey === "partments" && <Partments />}
          {activeKey === "person" && <Person />}
        </div>

        <div
          style={{ right: 0 }}
          className={changeBaner ? styles.margin_top_small : styles.margin_top}
        ></div>
      </Card>
    </React.Fragment>
  );
}
