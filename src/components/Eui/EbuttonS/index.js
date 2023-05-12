import React from "react";
import { Button, ConfigProvider } from "antd";
import styles from "./index.less";
export default function EbuttonS(props) {
  /*
   *props : {options:{}  ,text = '' , onClick , style:{}} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *text : 主要按钮 || text （按钮文案）
   *
   */
  const { options = {}, text = "", style = {} } = props;
  return (
    <React.Fragment>
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button
          {...options}
          className={styles.eAnxiButtonS}
          onClick={props.onClick}
          style={{ ...style }}
        >
          {text || "主要按钮"}
        </Button>
      </ConfigProvider>
    </React.Fragment>
  );
}
