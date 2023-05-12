import React from "react";
import { Button, ConfigProvider } from "antd";
import styles from "./index.less";
export default function Ebutton32(props) {
  /*
   *props : {options:{} ,types='' ,text = '' , onClick , style:{}} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *types: 主要样式带背景色 无border|| types='main'-- 次要样式 无背景色带border （按钮分类）
   *
   *text : 主要按钮 || text （按钮文案）
   *
   */
  const { options = {}, types = "", text = "", style = {} } = props;
  return (
    <React.Fragment>
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button
          {...options}
          className={
            types === "main" ? styles.eAnxiButtonM32 : styles.eAnxiButton32
          }
          onClick={props.onClick}
          style={{ ...style }}
        >
          {text || "主要按钮"}
        </Button>
      </ConfigProvider>
    </React.Fragment>
  );
}
