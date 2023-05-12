import React, { useState } from "react";
import { Input } from "antd";
import styles from "./index.less";
const { TextArea } = Input;
export default function EtextArea(props) {
  /*
   *props : {options:{} ,style:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang(e) : 把输入的值返回父组件
   *
   *maxLength自定义限制字数个数
   */
  const [val, setVal] = useState("");
  const { options = {}, style = {}, onChange } = props;
  const inputChange = e => {
    setVal(e.target.value);
    // 把输入的值返回父组件
    onChange(e.target.value);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextArea
        autoSize={{
          minRows: 2,
          maxRows: 5
        }}
        onChange={inputChange}
        className={styles.eTextArea}
        // placeholder={"请输入"}
        style={{ ...style }}
        {...options}
      />
      {options.maxLength && (
        <span
          className={
            val.length === options.maxLength
              ? styles.showCountMax
              : styles.showCount
          }
        >
          {val.length}/{options.maxLength}
        </span>
      )}
    </div>
  );
}
