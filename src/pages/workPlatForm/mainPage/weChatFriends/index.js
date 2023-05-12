import React from "react";
import Iframe from "react-iframe";
import styles from "./index.less";
import RankingListTab from "../../../../components/WorkPlatForm/MainPage/jiXiaoXiangQing";
export default function jiXiaoXiangQing() {
  return (
    <div
      style={{
        height: "1000px"
        //background: "red"
        //paddingBottom: 1500
      }}
    >
      <Iframe
        className={styles.iframe}
        height="100%"
        width="100%"
        src={`https://${window.location.host}/#/single/wechat/WechatFriends`}
        //src="https://crm.axzq.com.cn:8084/#/wechat/WechatFriends"
      />
    </div>
  );
}
